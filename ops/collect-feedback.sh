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

REPO_SLUG="$(gh repo view --json owner,name --jq '.owner.login + "/" + .name' 2>/dev/null || true)"
if [ -z "$REPO_SLUG" ]; then echo "gh repo not found." >> "$OUT"; exit 0; fi

list_issues() {
  local state="$1"
  local label="${2:-}"
  local limit="${3:-100}"
  local jq_filter

  jq_filter='.[] | select(.pull_request | not)'
  if [ -n "$label" ]; then
    jq_filter="$jq_filter | select([.labels[].name] | index(\"$label\"))"
  fi
  jq_filter="$jq_filter | [.number, (.state | ascii_upcase), .title, ([.labels[].name] | join(\",\")), .updated_at] | @tsv"

  gh api --method GET "repos/$REPO_SLUG/issues" \
    -F "state=$state" \
    -F "per_page=$limit" \
    --jq "$jq_filter"
}

write_issue_section() {
  local title="$1"
  shift
  local issues
  issues="$("$@" || true)"

  if [ "${WROTE_ISSUE_SECTION:-0}" -eq 1 ]; then
    echo >> "$OUT"
  fi
  WROTE_ISSUE_SECTION=1

  echo "## $title" >> "$OUT"
  if [ -n "$issues" ]; then
    echo "$issues" >> "$OUT"
  else
    echo "None." >> "$OUT"
  fi
}

write_issue_section "Open Issues" list_issues open "" 100
write_issue_section "Feedback Issues" list_issues open feedback 50
write_issue_section "Bug Issues" list_issues open bug 50
write_issue_section "Closed Issues" list_issues closed "" 20
