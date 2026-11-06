#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR=/www/wwwroot/luoxueer
export PATH="/www/server/nodejs/v24.14.1/bin:${PATH}"

corepack enable

pnpm install --frozen-lockfile
export PLAYWRIGHT_BROWSERS_PATH="${DEPLOY_DIR}/data/browsers"
pnpm exec playwright install chromium
# Fail before replacing the running site if Chromium's system libraries are missing.
node -e 'require("playwright").chromium.launch({ headless: true }).then(browser => browser.close()).catch(error => { process.stderr.write(String(error) + "\n"); process.exit(1); })'

# Keep runtime credentials outside the directory replaced by each deployment.
mkdir -p "${DEPLOY_DIR}/data"
for env_file in "${DEPLOY_DIR}/data/social.env" "${DEPLOY_DIR}/standalone/.env"; do
  if [ -z "${WEIBO_COOKIE:-}" ] && [ -f "$env_file" ]; then
    WEIBO_COOKIE=$(env -u WEIBO_COOKIE node --env-file="$env_file" -p 'process.env.WEIBO_COOKIE || ""')
  fi
done
if [ -n "${WEIBO_COOKIE:-}" ]; then
  (umask 077; printf 'WEIBO_COOKIE=%s\n' "$WEIBO_COOKIE" > "${DEPLOY_DIR}/data/social.env")
  chmod 600 "${DEPLOY_DIR}/data/social.env"
fi
export WEIBO_COOKIE
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
chmod 600 "${DEPLOY_DIR}/standalone.new/.env"

rm -rf "${DEPLOY_DIR}/standalone"
mv "${DEPLOY_DIR}/standalone.new" "${DEPLOY_DIR}/standalone"

pm2 restart luoxueer --update-env \
  || pm2 start "${DEPLOY_DIR}/standalone/server.js" --name luoxueer --cwd "${DEPLOY_DIR}/standalone"
pm2 save
