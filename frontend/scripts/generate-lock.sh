#!/bin/sh
# Génère frontend/package-lock.json pour les builds Docker (isolé du monorepo).
# Nécessite "shared": "file:../shared" dans frontend/package.json.
# À lancer depuis la racine du monorepo : ./frontend/scripts/generate-lock.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(cd "$FRONTEND_DIR/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

# Structure tmp/frontend et tmp/shared pour que file:../shared existe
mkdir -p "$TMP_DIR/frontend" "$TMP_DIR/shared"
cp "$FRONTEND_DIR/package.json" "$TMP_DIR/frontend/"
[ -f "$FRONTEND_DIR/.npmrc" ] && cp "$FRONTEND_DIR/.npmrc" "$TMP_DIR/frontend/"
cp -r "$ROOT_DIR/shared/." "$TMP_DIR/shared/"

cd "$TMP_DIR/frontend"
# Utiliser npm 11 pour que le lock soit identique à celui attendu dans le Dockerfile (npm ci avec npm@11)
npx --yes npm@11 install --package-lock-only

cp package-lock.json "$FRONTEND_DIR/"
echo "✓ package-lock.json généré dans frontend/"
