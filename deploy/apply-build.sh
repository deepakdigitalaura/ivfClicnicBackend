#!/bin/bash
set -e
export PATH=/home/master/node20/bin:/home/master/.npm-global/bin:$PATH

APP_DIR=/home/1259033.cloudwaysapps.com/execjqbwvu/private_html
STANDALONE_DIR=$APP_DIR/.next/standalone
TARBALL=$APP_DIR/.deploy-incoming.tar.gz
STAGING=$APP_DIR/.deploy-staging
LOG=/home/master/refresh-reviews.log

exec >> "$LOG" 2>&1

echo "[apply-build] $(date): starting apply — build + packaging was done in CI, this only extracts + swaps + restarts"

if [ ! -s "$TARBALL" ]; then
  echo "[apply-build] $(date): ERROR — incoming tarball missing or empty; aborting WITHOUT touching the live site"
  exit 1
fi

# A truncated upload used to surface here as a bare `tar: Unexpected EOF`.
# CI verifies the checksum now, so this should never trip — but when it does,
# say so plainly instead of leaving a cryptic tar error in the log.
if ! gzip -t "$TARBALL" 2>/dev/null; then
  echo "[apply-build] $(date): ERROR — incoming tarball is corrupt/truncated; aborting WITHOUT touching the live site"
  rm -f "$TARBALL"
  exit 1
fi

rm -rf "$STAGING"
mkdir -p "$STAGING"
tar -xzf "$TARBALL" -C "$STAGING"
rm -f "$TARBALL"

# public/ is NOT in the tarball — it is ~950MB of blog/asset images that
# rarely change, and shipping it made every deploy a ~1.2GB transfer that
# regularly truncated mid-stream. It is tracked in git, and the deploy step
# runs `git reset --hard origin/main` in APP_DIR immediately before this
# script, so the checkout here is always current.
echo "[apply-build] $(date): copying public/ in from the git checkout"
if [ ! -d "$APP_DIR/public" ]; then
  echo "[apply-build] $(date): ERROR — $APP_DIR/public missing; aborting WITHOUT touching the live site"
  rm -rf "$STAGING"
  exit 1
fi
cp -r "$APP_DIR/public" "$STAGING/public"

if [ -z "$(ls -A "$STAGING" 2>/dev/null)" ] || [ ! -f "$STAGING/server.js" ] || [ ! -d "$STAGING/public" ]; then
  echo "[apply-build] $(date): ERROR — extracted build is empty or missing server.js/public; aborting WITHOUT touching the live site"
  rm -rf "$STAGING"
  exit 1
fi

echo "[apply-build] $(date): swapping in new build"
rm -rf "$STANDALONE_DIR.old"
[ -d "$STANDALONE_DIR" ] && mv "$STANDALONE_DIR" "$STANDALONE_DIR.old"
mv "$STAGING" "$STANDALONE_DIR"
rm -rf "$STANDALONE_DIR.old"

echo "[apply-build] $(date): restarting app"
pm2 restart ivfclinic-nextjs --update-env

echo "[apply-build] $(date): verifying app responds"
sleep 3
if curl -sf -o /dev/null "http://127.0.0.1:3000/"; then
  echo "[apply-build] $(date): done — app responded OK after restart"
else
  echo "[apply-build] $(date): WARNING — app did not respond OK after restart, check pm2 logs"
fi

# Varnish sits in front of Node and can cache a 404 for a static chunk if a
# request lands mid-swap (old file gone, new file not yet in place). Ban the
# static-asset path on every deploy so it always re-fetches fresh from Node.
echo "[apply-build] $(date): purging Varnish cache for /_next/static/*"
varnishadm -S /etc/varnish/secret -T localhost:6082 'ban req.url ~ "^/_next/static/"' \
  && echo "[apply-build] $(date): Varnish purge OK" \
  || echo "[apply-build] $(date): WARNING — Varnish purge failed, check varnishadm manually"
