#!/usr/bin/env bash
# Usage: ./scripts/docker-build.sh <dev|uat|prod>
set -euo pipefail

ENV="${1:-}"
if [[ -z "$ENV" || ! "$ENV" =~ ^(dev|uat|prod)$ ]]; then
  echo "Usage: $0 <dev|uat|prod>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$INFRA_DIR")"

# Load .env.docker if present
ENV_FILE="$ROOT_DIR/config/env/.env.docker"
if [[ -f "$ENV_FILE" ]]; then
  set -a; source "$ENV_FILE"; set +a
fi

IMAGE_NAME="${IMAGE_NAME:-sgx-frontend}"
IMAGE_TAG="$IMAGE_NAME:$ENV"

echo ">>> Building Docker image: $IMAGE_TAG (BUILD_ENV=$ENV)"
docker build \
  --build-arg BUILD_ENV="$ENV" \
  -f "$ROOT_DIR/infra/docker/Dockerfile" \
  -t "$IMAGE_TAG" \
  "$ROOT_DIR"

echo ">>> Build complete: $IMAGE_TAG"
