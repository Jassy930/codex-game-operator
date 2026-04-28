#!/usr/bin/env bash
set -euo pipefail
MODE="${1:-preview}"
if [ ! -f package.json ]; then echo "No package.json; nothing to deploy."; exit 0; fi
npm install
npm test || true
npm run build
if command -v vercel >/dev/null 2>&1; then
  if [ "$MODE" = "prod" ] || [ "$MODE" = "production" ]; then vercel --prod --yes; else vercel --yes; fi
else
  echo "Vercel CLI not found."
fi
