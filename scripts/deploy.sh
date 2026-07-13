#!/usr/bin/env bash
# deploy.sh — build produzione, commit artefatti public/, push su origin

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

NO_PUSH=false
for arg in "$@"; do
  case "$arg" in
    --no-push) NO_PUSH=true ;;
  esac
done

echo "▶ deploy: npm run perf..."
npm run perf

echo "▶ deploy: stage artefatti public/..."
git add -u public/
git add public/pagefind/ 2>/dev/null || true

if ! git diff --cached --quiet; then
  git commit -m "chore: aggiorna artefatti build pre-deploy"
  echo "✅ Commit artefatti build creato"
else
  echo "ℹ️  Nessun artefatto public/ da committare"
fi

if [ "$NO_PUSH" = true ]; then
  echo "ℹ️  Push saltato (--no-push)"
  exit 0
fi

BRANCH="$(git branch --show-current)"
echo "▶ deploy: push su origin/$BRANCH..."
git push -u origin "$BRANCH"
echo "✅ Deploy completato (Cloudflare Pages da main)"
