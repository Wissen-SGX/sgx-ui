# SGX Frontend — Deployment Guide

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Repository Structure](#2-repository-structure)
3. [Environment Configuration](#3-environment-configuration)
4. [Build System](#4-build-system)
5. [Docker](#5-docker)
6. [AWS ECR Setup](#6-aws-ecr-setup)
7. [AWS ECS Deployment](#7-aws-ecs-deployment)
8. [Release Pipeline](#8-release-pipeline)
9. [Nginx Routing](#9-nginx-routing)
10. [Health Check](#10-health-check)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Architecture Overview

SGX Frontend is a **microfrontend monorepo** using **Module Federation** (Vite). Three independent apps are built separately and served together by a single nginx container.

```
Browser
  └── nginx (port 80)
        ├── /           → host-app  (shell / layout)
        ├── /auth/      → auth-app  (login / sso)
        └── /index-studio/      → index-studio  (dashboard, parameters-configuration, universe etc.)
```

At runtime the host-app shell loads auth-app and index-studio as federated remotes via their `remoteEntry.js` files. All three are served from the same nginx container — no cross-origin calls between microfrontends.

**Tech stack:** React 19 · Vite 7 · Module Federation · React Router v7 · Redux Toolkit · Tailwind CSS · nginx 1.25 · Node 20 (build only)

---

## 2. Repository Structure

```
sgx-frontend/
├── apps/
│   ├── auth-app/              # Auth microfrontend
│   │   ├── .env               # local defaults
│   │   ├── .env.dev
│   │   ├── .env.uat
│   │   └── .env.prod
│   ├── index-studio-app/              # Main microfrontend
│   │   ├── .env
│   │   ├── .env.dev
│   │   ├── .env.uat
│   │   └── .env.prod
│   └── host-app/              # Shell (host) app
│       ├── .env               # local defaults
│       ├── .env.dev           # federation remote URLs for dev
│       ├── .env.uat
│       └── .env.prod
├── packages/
│   ├── shared/                # Shared utilities (source-only)
│   └── ui/                    # Shared UI components (source-only)
├── infra/
│   ├── deploy/
│   │   ├── ecs-task-definition.dev.json
│   │   ├── ecs-task-definition.uat.json
│   │   └── ecs-task-definition.prod.json
│   ├── nginx/
│   │   └── nginx.conf             # nginx server config
│   ├── scripts/
│   │   ├── docker-build.sh        # Build Docker image
│   │   ├── ecr-push.sh            # Push image to ECR
│   │   ├── ecs-deploy.sh          # Register task def + deploy to ECS
│   │   └── release.sh             # Full pipeline: build → push → deploy
│   └── docker/
│       ├── Dockerfile             # Multi-stage build
│       └── docker-compose.yml     # Local Docker testing
├── config/
│   ├── env/
│   │   └── .env.example           # Template for config/env/.env.docker
│   └── tooling/
│       ├── .prettierrc
│       └── .prettierignore
└── package.json               # npm workspaces root
```

---

## 3. Environment Configuration

### 3.1 How env files work

Vite loads env files at **build time only** — values are baked into the static output. There are no runtime env vars in the container.

| File | When loaded |
|------|-------------|
| `.env` | Always (base defaults) |
| `.env.dev` | `vite build --mode dev` |
| `.env.uat` | `vite build --mode uat` |
| `.env.prod` | `vite build --mode prod` |

### 3.2 env variables per app

**auth-app** and **index-studio-app** (per environment):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_ENV` | Environment label | `dev` / `uat` / `prod` |
| `VITE_API_BASE_URL` | Backend API base URL | `https://api-dev.sgx.example.com/api` |

**host-app** (per environment):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_ENV` | Environment label | `dev` |
| `VITE_AUTH_APP_URL` | auth-app remoteEntry URL | `https://dev-sgx.example.com/auth/remoteEntry.js` |
| `VITE_INDEX_STUDIO_APP_URL` | index-studio-app remoteEntry URL | `https://dev-sgx.example.com/index-studio/remoteEntry.js` |

> **Important:** For Docker/ECS deployments, `apps/host-app/.env.<env>` uses relative paths (`/auth/remoteEntry.js`, `/index-studio/remoteEntry.js`) because all microfrontends are served from the same nginx container/domain.

### 3.3 Before deploying — update API URLs

Update the following files with real endpoints before building:

```
apps/auth-app/.env.dev       → VITE_API_BASE_URL
apps/auth-app/.env.uat       → VITE_API_BASE_URL
apps/auth-app/.env.prod      → VITE_API_BASE_URL

apps/index-studio-app/.env.dev       → VITE_API_BASE_URL
apps/index-studio-app/.env.uat       → VITE_API_BASE_URL
apps/index-studio-app/.env.prod      → VITE_API_BASE_URL
```

Federation URLs in `apps/host-app/.env.*` should remain as relative paths (`/auth/remoteEntry.js`) for container deployments — do not change these.

---

## 4. Build System

### 4.1 npm scripts (local development only)

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start all 3 apps in dev mode (HMR) |
| `npm run start:local` | Build + preview with local defaults |
| `npm run start:dev` | Build with dev env + preview locally |
| `npm run start:uat` | Build with uat env + preview locally |
| `npm run start:prod` | Build with prod env + preview locally |

Local preview ports: host `4000` · auth `4001` · index-studio `4002`

### 4.2 Build modes

The Dockerfile handles all build orchestration internally. The `BUILD_ENV` argument selects which `.env.<env>` files are loaded.

```
BUILD_ENV=dev   → loads .env.dev  for all apps
BUILD_ENV=uat   → loads .env.uat  for all apps
BUILD_ENV=prod  → loads .env.prod for all apps (default)
```

---

## 5. Docker

### 5.1 Dockerfile overview

The Dockerfile uses a **two-stage build**:

| Stage | Base image | Purpose |
|-------|-----------|---------|
| `builder` | `node:20-alpine` | Install dependencies, run Vite builds |
| `production` | `nginx:1.25-alpine` | Serve static files |

Build output layout inside the nginx container:

```
/usr/share/nginx/html/          ← host-app dist
/usr/share/nginx/html/auth/     ← auth-app dist
/usr/share/nginx/html/index-studio/     ← index-studio-app dist
```

### 5.2 Build the image

```bash
# Make scripts executable (first time only)
chmod +x infra/scripts/*.sh

# Build for a specific environment
./infra/scripts/docker-build.sh dev
./infra/scripts/docker-build.sh uat
./infra/scripts/docker-build.sh prod
```

> The Dockerfile lives at `infra/docker/Dockerfile`; the build context is always the repo root.

This produces a local image tagged `sgx-frontend:dev|uat|prod`.

### 5.3 Run locally with Docker Compose

```bash
# Run dev build on http://localhost:8080
BUILD_ENV=dev PORT=8080 docker compose -f infra/docker/docker-compose.yml up

# Run prod build on http://localhost:8080
BUILD_ENV=prod PORT=8080 docker compose -f infra/docker/docker-compose.yml up

# Stop
docker compose -f infra/docker/docker-compose.yml down
```

> Use this to verify the Docker image works correctly before pushing to ECR.

---

## 6. AWS ECR Setup

### 6.1 Create the ECR repository (one-time)

```bash
aws ecr create-repository \
  --repository-name sgx-frontend \
  --region ap-southeast-1
```

### 6.2 Configure .env.docker

Create a `config/env/.env.docker` file (copy from `config/env/.env.example`, never commit this file):

```bash
# AWS
AWS_REGION=ap-southeast-1
AWS_ACCOUNT_ID=<your-aws-account-id>
ECR_REPO=sgx-frontend

# ECS cluster
ECS_CLUSTER=sgx-cluster

# ECS service names (one per environment)
ECS_SERVICE_DEV=sgx-frontend-dev
ECS_SERVICE_UAT=sgx-frontend-uat
ECS_SERVICE_PROD=sgx-frontend-prod
```

### 6.3 Push image to ECR

```bash
./infra/scripts/ecr-push.sh dev
./infra/scripts/ecr-push.sh uat
./infra/scripts/ecr-push.sh prod
```

The script will:
1. Authenticate Docker with ECR
2. Tag the local image as `<account>.dkr.ecr.<region>.amazonaws.com/sgx-frontend:<env>`
3. Push to ECR

---

## 7. AWS ECS Deployment

### 7.1 Prerequisites

- ECS cluster exists (`ECS_CLUSTER` in `.env.docker`)
- ECS services exist for each environment (Fargate launch type, `awsvpc` network mode)
- IAM roles exist:
  - `ecsTaskExecutionRole` — with `AmazonECRReadOnly` + `CloudWatchLogsFullAccess`
  - `ecsTaskRole` — application-level permissions (S3, SSM, etc. if needed)
- CloudWatch log groups created:
  ```bash
  aws logs create-log-group --log-group-name /ecs/sgx-frontend-dev --region ap-southeast-1
  aws logs create-log-group --log-group-name /ecs/sgx-frontend-uat --region ap-southeast-1
  aws logs create-log-group --log-group-name /ecs/sgx-frontend-prod --region ap-southeast-1
  ```

### 7.2 Update task definitions

Before first deploy, update the `__ACCOUNT_ID__` placeholder in each task definition file:

```
infra/deploy/ecs-task-definition.dev.json
infra/deploy/ecs-task-definition.uat.json
infra/deploy/ecs-task-definition.prod.json
```

The `__IMAGE_URI__` placeholder is substituted automatically by `infra/scripts/ecs-deploy.sh` at deploy time.

Replace `__ACCOUNT_ID__` with your actual AWS account ID. The `__IMAGE_URI__` placeholder is substituted automatically by `infra/scripts/ecs-deploy.sh` at deploy time.

Also update `awslogs-region` in each file if your region differs from `ap-southeast-1`.

### 7.3 Task definition resource sizing

| Environment | CPU | Memory |
|-------------|-----|--------|
| dev | 256 (.25 vCPU) | 512 MB |
| uat | 256 (.25 vCPU) | 512 MB |
| prod | 512 (.5 vCPU) | 1024 MB |

### 7.4 Deploy to ECS

```bash
./infra/scripts/ecs-deploy.sh dev
./infra/scripts/ecs-deploy.sh uat
./infra/scripts/ecs-deploy.sh prod
```

The script will:
1. Register a new task definition revision with the latest ECR image URI
2. Update the ECS service to use the new task definition
3. Trigger a rolling deployment (`--force-new-deployment`)
4. Wait until the service is stable before exiting

---

## 8. Release Pipeline

### 8.1 Full pipeline (build + push + deploy)

```bash
./infra/scripts/release.sh dev
./infra/scripts/release.sh uat
./infra/scripts/release.sh prod
```

This runs all three steps in sequence — docker-build → ecr-push → ecs-deploy. If any step fails the pipeline stops.

### 8.2 Recommended CI/CD flow (GitHub Actions / Jenkins / etc.)

```
1. Checkout code
2. Configure AWS credentials
3. chmod +x infra/scripts/*.sh
4. Create config/env/.env.docker from CI secrets
5. ./infra/scripts/release.sh <env>
```

CI secrets to configure:

| Secret | Value |
|--------|-------|
| `AWS_REGION` | e.g. `ap-southeast-1` |
| `AWS_ACCOUNT_ID` | AWS account number |
| `ECR_REPO` | `sgx-frontend` |
| `ECS_CLUSTER` | ECS cluster name |
| `ECS_SERVICE_DEV` | ECS service name for dev |
| `ECS_SERVICE_UAT` | ECS service name for uat |
| `ECS_SERVICE_PROD` | ECS service name for prod |

### 8.3 ECS networking requirements

The ECS service needs:
- **Subnets:** private subnets with NAT gateway (to pull from ECR)
- **Security group:** inbound port 80 from ALB security group only
- **Load balancer:** Application Load Balancer (ALB) in public subnets forwarding to target group on port 80

---

## 9. Nginx Routing

The nginx config routes requests to the correct app based on URL path:

| Path | Serves | Falls back to |
|------|--------|---------------|
| `/health` | Health check response | — |
| `/auth/*` | auth-app static files | `/auth/index.html` (SPA) |
| `/index-studio/*` | index-studio-app static files | `/index-studio/index.html` (SPA) |
| `/*` | host-app static files | `/index.html` (SPA) |

**Caching headers:**
- HTML entry points (`index.html`) → `no-cache` (always fresh)
- Hashed assets (`.js`, `.css`, images, fonts) → `Cache-Control: public, immutable, max-age=1y`

**Compression:** gzip enabled for JS, CSS, JSON, SVG, XML.

---

## 10. Health Check

nginx exposes a health endpoint at `/health` that returns HTTP 200 with body `healthy`.

Used by:
- Docker `HEALTHCHECK` directive in the Dockerfile
- ECS container health check
- ALB target group health check — configure the ALB target group to use path `/health`, port `80`, protocol `HTTP`

---

## 11. Troubleshooting

### Container starts but shows blank page
- Check browser console for failed network requests
- Verify the ALB target group health check passes on `/health`
- Confirm the correct `BUILD_ENV` was used when building the image

### remoteEntry.js 404
- The host-app is trying to load a microfrontend remote that wasn't built or is at the wrong path
- For container deployments, `apps/host-app/.env.<env>` must use relative paths: `/auth/remoteEntry.js` and `/index-studio/remoteEntry.js`

### ECR push: unauthorized
- Re-run: `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com`
- Check IAM user/role has `ecr:GetAuthorizationToken` + `ecr:BatchCheckLayerAvailability` + `ecr:PutImage` permissions

### ECS service stuck in deployment
```bash
# Check service events
aws ecs describe-services \
  --cluster sgx-cluster \
  --services sgx-frontend-<env> \
  --region ap-southeast-1 \
  --query "services[0].events[:10]"

# Check stopped task error
aws ecs describe-tasks \
  --cluster sgx-cluster \
  --tasks <task-arn> \
  --region ap-southeast-1
```

### View live logs
```bash
aws logs tail /ecs/sgx-frontend-<env> --follow --region ap-southeast-1
```
