#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR=/www/wwwroot/luoxueer
export PATH="/www/server/nodejs/v24.14.1/bin:${PATH}"

corepack enable

pnpm install --frozen-lockfile
export PLAYWRIGHT_BROWSERS_PATH="${DEPLOY_DIR}/data/browsers"
pnpm exec playwright install chromium
pnpm build

rm -rf "${DEPLOY_DIR}/standalone.new"
mv .next/standalone "${DEPLOY_DIR}/standalone.new"
mkdir -p "${DEPLOY_DIR}/standalone.new/.next"
cp -r .next/static "${DEPLOY_DIR}/standalone.new/.next/static"
cp -r public "${DEPLOY_DIR}/standalone.new/public"
if [ -d "${DEPLOY_DIR}/standalone/public/audio" ]; then
  cp -r "${DEPLOY_DIR}/standalone/public/audio" "${DEPLOY_DIR}/standalone.new/public/"
fi

printf '%s\n' \
  "NODE_ENV=production" \
  "PORT=3000" \
  "HOSTNAME=0.0.0.0" \
  "PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH}" \
  "SOCIAL_STATS_DATA_DIR=${DEPLOY_DIR}/data/social-stats" \
  "WEIBO_COOKIE=${WEIBO_COOKIE:-}" > "${DEPLOY_DIR}/standalone.new/.env"

rm -rf "${DEPLOY_DIR}/standalone"
mv "${DEPLOY_DIR}/standalone.new" "${DEPLOY_DIR}/standalone"

pm2 restart luoxueer \
  || pm2 start "${DEPLOY_DIR}/standalone/server.js" --name luoxueer --cwd "${DEPLOY_DIR}/standalone"
pm2 save
