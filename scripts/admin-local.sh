#!/bin/sh
# Start from the repository root, using the existing Node runtime when needed.
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
export PATH="$PWD/.tools/npm-bootstrap/bin:$HOME/.local/bin:$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
export FIREBASE_TOOLS_LIB="${FIREBASE_TOOLS_LIB:-$HOME/.local/lib/node_modules/firebase-tools/lib}"
case "${1:-}" in
 iniciar) exec node scripts/run-admin-local.mjs ;;
 preparar) exec node scripts/prepare-admin-local.mjs ;;
 detener) exec node scripts/stop-admin-local.mjs ;;
 *) echo 'Uso: bash scripts/admin-local.sh preparar|iniciar|detener'; exit 1 ;;
esac
