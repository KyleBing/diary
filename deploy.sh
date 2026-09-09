#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

DEPLOY_HOST="${DEPLOY_HOST:-kylebing.cn}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/html/diary}"
SKIP_BUILD="${SKIP_BUILD:-1}"

section() {
  echo
  echo "── $1 ──"
}

section "build"
if [[ "${SKIP_BUILD}" == "1" ]]; then
  echo "  skip build (SKIP_BUILD=1)"
else
  npm run build
fi

if [[ ! -d dist ]] || [[ ! -f dist/index.html ]]; then
  echo "error: dist/ is missing, run build first" >&2
  exit 1
fi

DEST="${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

section "upload"
echo "  → ${DEST}"
rsync -avz --delete \
  --exclude '.DS_Store' \
  dist/ "${DEST}"

section "done"
echo "  https://${DEPLOY_HOST}/diary/"
