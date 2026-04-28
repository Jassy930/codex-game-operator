#!/usr/bin/env bash
set -euo pipefail
mkdir -p data/feedback
OUT="data/feedback/github-feedback.md"
{
  echo "# GitHub Feedback"
  echo "Generated at: $(date)"
  echo
} > "$OUT"
if ! command -v gh >/dev/null 2>&1; then echo "gh not found." >> "$OUT"; exit 0; fi
if ! gh auth status >/dev/null 2>&1; then echo "gh not authenticated." >> "$OUT"; exit 0; fi
{
  echo "## Open Issues"; gh issue list --state open --limit 100 || true
  echo; echo "## Feedback Issues"; gh issue list --label feedback --state open --limit 50 || true
  echo; echo "## Bug Issues"; gh issue list --label bug --state open --limit 50 || true
} >> "$OUT"
