#!/usr/bin/env bash
# Usage: ./scripts/ecs-deploy.sh <dev|uat|prod>
set -euo pipefail

ENV="${1:-}"
if [[ -z "$ENV" || ! "$ENV" =~ ^(dev|uat|prod)$ ]]; then
  echo "Usage: $0 <dev|uat|prod>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$INFRA_DIR")"

ENV_FILE="$ROOT_DIR/config/env/.env.docker"
if [[ -f "$ENV_FILE" ]]; then
  set -a; source "$ENV_FILE"; set +a
fi

: "${AWS_REGION:?'AWS_REGION not set in .env.docker'}"
: "${AWS_ACCOUNT_ID:?'AWS_ACCOUNT_ID not set in .env.docker'}"
: "${ECR_REPO:?'ECR_REPO not set in .env.docker'}"
: "${ECS_CLUSTER:?'ECS_CLUSTER not set in .env.docker'}"

ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
IMAGE_URI="$ECR_REGISTRY/$ECR_REPO:$ENV"
TASK_DEF_FILE="$INFRA_DIR/deploy/ecs-task-definition.$ENV.json"
TASK_FAMILY="sgx-frontend-$ENV"

# Resolve ECS service name from env-specific var
SERVICE_VAR="ECS_SERVICE_$(echo "$ENV" | tr '[:lower:]' '[:upper:]')"
ECS_SERVICE="${!SERVICE_VAR:?\"$SERVICE_VAR not set in .env.docker\"}"

echo ">>> Registering ECS task definition from $TASK_DEF_FILE"
TASK_DEF_JSON=$(cat "$TASK_DEF_FILE")

# Substitute IMAGE_URI placeholder
TASK_DEF_JSON=$(echo "$TASK_DEF_JSON" | sed "s|__IMAGE_URI__|$IMAGE_URI|g")

TASK_DEF_ARN=$(aws ecs register-task-definition \
  --cli-input-json "$TASK_DEF_JSON" \
  --region "$AWS_REGION" \
  --query "taskDefinition.taskDefinitionArn" \
  --output text)

echo ">>> Registered: $TASK_DEF_ARN"

echo ">>> Updating ECS service: $ECS_SERVICE (cluster: $ECS_CLUSTER)"
aws ecs update-service \
  --cluster "$ECS_CLUSTER" \
  --service "$ECS_SERVICE" \
  --task-definition "$TASK_DEF_ARN" \
  --force-new-deployment \
  --region "$AWS_REGION" \
  --output table

echo ">>> Waiting for service to stabilize..."
aws ecs wait services-stable \
  --cluster "$ECS_CLUSTER" \
  --services "$ECS_SERVICE" \
  --region "$AWS_REGION"

echo ">>> Deployment complete: $ECS_SERVICE ($ENV)"
