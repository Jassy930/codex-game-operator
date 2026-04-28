#!/usr/bin/env bash
set -euo pipefail
mkdir -p data/feedback
OUT="data/feedback/github-feedback.md"
{
  echo "# GitHub Feedback"
  echo "Generated at: $(date '+%Y-%m-%d %H:%M %Z')"
  echo
} > "$OUT"
if ! command -v gh >/dev/null 2>&1; then echo "gh not found." >> "$OUT"; exit 0; fi
if ! gh auth status >/dev/null 2>&1; then echo "gh not authenticated." >> "$OUT"; exit 0; fi

write_issue_section() {
  local title="$1"
  shift
  local issues
  issues="$("$@" || true)"

  echo "## $title" >> "$OUT"
  if [ -n "$issues" ]; then
    echo "$issues" >> "$OUT"
  else
    echo "None." >> "$OUT"
  fi
  echo >> "$OUT"
}

write_issue_section "Open Issues" gh issue list --state open --limit 100
write_issue_section "Feedback Issues" gh issue list --label feedback --state open --limit 50
write_issue_section "Bug Issues" gh issue list --label bug --state open --limit 50
write_issue_section "Closed Issues" gh issue list --state closed --limit 20
