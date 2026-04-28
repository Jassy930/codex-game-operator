#!/usr/bin/env bash
set -euo pipefail
MESSAGE="${1:-operator: autonomous game iteration}"
if [ -f package.json ]; then npm install; npm test; npm run build; fi
if git diff --quiet && git diff --cached --quiet; then echo "No changes to push."; exit 0; fi
git add .
if git diff --cached --name-only | grep -E '(^|/)(\.env|id_rsa|id_ed25519|.*\.pem)$' >/dev/null 2>&1; then echo "Refusing to commit obvious secret file."; exit 2; fi
git commit -m "$MESSAGE"
if git remote get-url origin >/dev/null 2>&1; then git push; else echo "No origin remote configured."; fi
