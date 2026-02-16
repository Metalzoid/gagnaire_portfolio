#!/bin/sh
# Génère backend/package-lock.json pour les builds Docker (isolé du monorepo).
# Nécessite "shared": "file:../shared" dans backend/package.json.
# À lancer depuis la racine du monorepo : ./backend/scripts/generate-lock.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(cd "$BACKEND_DIR/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

# Structure tmp/backend et tmp/shared pour que file:../shared existe
mkdir -p "$TMP_DIR/backend" "$TMP_DIR/shared"
cp "$BACKEND_DIR/package.json" "$TMP_DIR/backend/"
cp -r "$ROOT_DIR/shared/." "$TMP_DIR/shared/"

cd "$TMP_DIR/backend"
npm install --package-lock-only

cp package-lock.json "$BACKEND_DIR/"
echo "✓ package-lock.json généré dans backend/"
