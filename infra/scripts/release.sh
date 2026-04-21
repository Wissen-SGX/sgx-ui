#!/usr/bin/env bash
# Full pipeline: build → push to ECR → deploy to ECS
# Usage: ./scripts/release.sh <dev|uat|prod>
set -euo pipefail

ENV="${1:-}"
if [[ -z "$ENV" || ! "$ENV" =~ ^(dev|uat|prod)$ ]]; then
  echo "Usage: $0 <dev|uat|prod>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo " SGX Frontend Release: $ENV"
echo "========================================"

echo ""
echo "[1/3] Building Docker image..."
bash "$SCRIPT_DIR/docker-build.sh" "$ENV"

echo ""
echo "[2/3] Pushing to ECR..."
bash "$SCRIPT_DIR/ecr-push.sh" "$ENV"

echo ""
echo "[3/3] Deploying to ECS..."
bash "$SCRIPT_DIR/ecs-deploy.sh" "$ENV"

echo ""
echo "========================================"
echo " Release complete: $ENV"
echo "========================================"
