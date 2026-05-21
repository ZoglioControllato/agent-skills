#!/usr/bin/env bash
# Run P3 cloudflare-deploy translations by workstream (parallel)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WORKSTREAMS=(
  workers d1 r2 pages kv bindings agents-sdk ai-gateway api wrangler
  durable-objects queues vectorize terraform pulumi hyperdrive images stream
)

MAX_PARALLEL=4
running=0

for ws in "${WORKSTREAMS[@]}"; do
  while (( running >= MAX_PARALLEL )); do
    wait -n 2>/dev/null || wait
    ((running--)) || true
  done
  echo "Starting workstream cf-$ws"
  node tools/batch-translate-md.mjs --phase P3 --workstream "cf-$ws" >>"/tmp/translate-cf-$ws.log" 2>&1 &
  ((running++))
done
wait
echo "All cloudflare batch workstreams finished"
