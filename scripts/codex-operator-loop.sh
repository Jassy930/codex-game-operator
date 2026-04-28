#!/usr/bin/env bash
set -u
PROMPT_FILE="${PROMPT_FILE:-prompts/operator.prompt.md}"
LAST_OUTPUT="${LAST_OUTPUT:-.operator-last.md}"
LOG_DIR="${LOG_DIR:-.operator-logs}"
SLEEP_SECONDS="${SLEEP_SECONDS:-60}"
mkdir -p "$LOG_DIR"
round=0
echo "Starting Codex Max Autonomy Game Operator Loop."
echo "Press Ctrl+C to stop."
while true; do
  round=$((round + 1))
  timestamp="$(date +%Y%m%d-%H%M%S)"
  round_log="$LOG_DIR/round-${round}-${timestamp}.md"
  echo ""
  echo "========== MAX AUTONOMY OPERATOR ROUND $round =========="
  echo ""
  ./ops/collect-feedback.sh || true
  codex exec --output-last-message "$LAST_OUTPUT" "$(cat "$PROMPT_FILE")"
  status=$?
  if [ -f "$LAST_OUTPUT" ]; then cp "$LAST_OUTPUT" "$round_log" 2>/dev/null || true; fi
  if [ "$status" -ne 0 ]; then echo "Codex exited with status $status, but loop continues."; fi
  sleep "$SLEEP_SECONDS"
done
