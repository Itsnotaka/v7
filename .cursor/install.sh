#!/usr/bin/env bash
set -euo pipefail

# Provision the toolchain pinned in mise.toml (node, pnpm) via mise, then
# install workspace dependencies. Safe to run repeatedly.

mise="$HOME/.local/bin/mise"

if [ ! -x "$mise" ] && ! command -v mise >/dev/null 2>&1; then
  curl -fsSL https://mise.run | sh
fi

if command -v mise >/dev/null 2>&1; then
  mise="$(command -v mise)"
fi

if ! grep -q 'mise activate bash' "$HOME/.bashrc" 2>/dev/null; then
  echo "eval \"\$($mise activate bash)\"" >> "$HOME/.bashrc"
fi

"$mise" trust
"$mise" install
"$mise" exec -- pnpm install --frozen-lockfile
