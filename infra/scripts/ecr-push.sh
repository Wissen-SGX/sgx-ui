#!/usr/bin/env bash
# Usage: ./scripts/ecr-push.sh <dev|uat|prod>
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

ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
IMAGE_NAME="${IMAGE_NAME:-sgx-frontend}"
LOCAL_TAG="$IMAGE_NAME:$ENV"
REMOTE_TAG="$ECR_REGISTRY/$ECR_REPO:$ENV"

echo ">>> Authenticating with ECR ($AWS_REGION)"
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo ">>> Tagging: $LOCAL_TAG → $REMOTE_TAG"
docker tag "$LOCAL_TAG" "$REMOTE_TAG"

echo ">>> Pushing: $REMOTE_TAG"
docker push "$REMOTE_TAG"

echo ">>> Push complete: $REMOTE_TAG"
