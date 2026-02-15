#!/bin/sh
# Génère backend/package-lock.json pour les builds Docker (hors workspace)
# À lancer depuis la racine du monorepo : ./backend/scripts/generate-lock.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cp "$BACKEND_DIR/package.json" "$TMP_DIR/"
cd "$TMP_DIR"
npm install --package-lock-only
cp package-lock.json "$BACKEND_DIR/"
echo "✓ package-lock.json généré dans backend/"
