#!/bin/bash
# Publish wiki pages to GitHub
# Before first run: enable Wiki in repository settings on GitHub
# and create the first page (can be empty) via the web UI.

set -e

REPO="ziffmafiya/zambretti_sager"
WIKI_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMP_DIR=$(mktemp -d)

echo "Cloning wiki repository..."
git clone "https://github.com/${REPO}.wiki.git" "$TEMP_DIR"

echo "Copying wiki pages..."
cp "$WIKI_DIR"/*.md "$TEMP_DIR/"

cd "$TEMP_DIR"
git add -A
git status

if git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi

git commit -m "docs: update wiki pages"
git push origin master 2>/dev/null || git push origin main

echo "Wiki published successfully!"
rm -rf "$TEMP_DIR"
