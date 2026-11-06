#!/usr/bin/env bash
set -euo pipefail

release_id=${1:?release id is required}

[[ "$release_id" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]] || { echo "Invalid release id" >&2; exit 2; }

deploy_root=/www/wwwroot/luoxueer
releases_dir="${deploy_root}/releases"
data_dir="${deploy_root}/data"
release_dir="${releases_dir}/${release_id}"
staging_dir="${releases_dir}/.${release_id}.tmp"
current_link="${deploy_root}/current"
node_bin=/www/server/nodejs/v24.14.1/bin/node
pm2_bin=/www/server/nodejs/v24.14.1/bin/pm2
browser_dir="${data_dir}/browsers"
legacy_app="${deploy_root}/standalone"

exec 9>"/tmp/luoxueer-deploy.lock"
flock -n 9 || { echo "Another deployment is running" >&2; exit 1; }

mkdir -p "$releases_dir" "$data_dir"
test -f "$staging_dir/app/server.js"
test -f "$staging_dir/app/node_modules/playwright/cli.js"

export PLAYWRIGHT_BROWSERS_PATH="$browser_dir"
"$node_bin" "$staging_dir/app/node_modules/playwright/cli.js" install chromium
(
  cd "$staging_dir/app"
  "$node_bin" -e 'require("playwright").chromium.launch({ headless: true }).then(browser => browser.close()).catch(error => { console.error(error); process.exit(1); })'
)

cookie=${WEIBO_COOKIE_B64:+$(printf '%s' "$WEIBO_COOKIE_B64" | base64 -d)}
if [ -z "$cookie" ] && [ -f "$data_dir/social.env" ]; then
  cookie=$(env -u WEIBO_COOKIE "$node_bin" --env-file="$data_dir/social.env" -p 'process.env.WEIBO_COOKIE || ""')
fi
if [ -n "$cookie" ]; then
  (umask 077; printf 'WEIBO_COOKIE=%s\n' "$cookie" > "$data_dir/social.env")
fi

(umask 077; printf '%s\n' \
  'NODE_ENV=production' \
  'PORT=3000' \
  'HOSTNAME=0.0.0.0' \
  "PLAYWRIGHT_BROWSERS_PATH=${browser_dir}" \
  "SOCIAL_STATS_DATA_DIR=${data_dir}/social-stats" \
  "WEIBO_COOKIE=${cookie}" > "$staging_dir/app/.env")

previous_app=$(readlink -f "$current_link" 2>/dev/null || true)
if [ -z "$previous_app" ] && [ -f "$legacy_app/server.js" ]; then
  previous_app=$legacy_app
fi

rm -rf -- "$release_dir"
mv "$staging_dir" "$release_dir"
ln -sfn "$release_dir/app" "${current_link}.new"
mv -Tf "${current_link}.new" "$current_link"

cat > "$deploy_root/ecosystem.config.cjs" <<'EOF'
module.exports = {
  apps: [{
    name: "luoxueer",
    script: "/www/wwwroot/luoxueer/current/server.js",
    cwd: "/www/wwwroot/luoxueer/current",
    env: { NODE_ENV: "production" },
  }],
};
EOF

"$pm2_bin" delete luoxueer 2>/dev/null || true
if ! "$pm2_bin" start "$deploy_root/ecosystem.config.cjs" \
  || ! curl --fail --silent --show-error --retry 5 --retry-delay 2 --retry-connrefused \
    --connect-timeout 3 --max-time 10 http://127.0.0.1:3000/ > /dev/null \
  || ! curl --fail --silent --show-error --retry 5 --retry-delay 2 --retry-connrefused \
    --connect-timeout 3 --max-time 10 http://127.0.0.1:3000/images/home/home-portrait.webp > /dev/null; then
  if [ -n "$previous_app" ] && [ -f "$previous_app/server.js" ]; then
    ln -sfn "$previous_app" "${current_link}.new"
    mv -Tf "${current_link}.new" "$current_link"
    "$pm2_bin" delete luoxueer 2>/dev/null || true
    "$pm2_bin" start "$deploy_root/ecosystem.config.cjs" || true
  fi
  echo "Release failed health check; restored previous release" >&2
  exit 1
fi

"$pm2_bin" save
rm -f -- "/tmp/luoxueer-deploy-${release_id}.sh" "${deploy_root}/.rsync-base"
rm -rf -- "${deploy_root}/standalone.new" "$legacy_app" /www/wwwroot/luoxueer-src
find /tmp -maxdepth 1 -type f \( -name 'luoxueer-*.tar.gz' -o -name 'luoxueer-deploy-*.sh' \) -delete
find "$releases_dir" -mindepth 1 -maxdepth 1 -type d -name '.*.tmp' -exec rm -rf -- {} +

find "$releases_dir" -mindepth 1 -maxdepth 1 -type d -not -name '.*' -printf '%T@ %p\n' \
  | sort -nr \
  | tail -n +4 \
  | cut -d' ' -f2- \
  | while IFS= read -r old_release; do
      [ "$old_release" = "$release_dir" ] || rm -rf -- "$old_release"
    done

echo "Activated release ${release_id}"
