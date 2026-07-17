#!/bin/sh

set -eu

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT_DIR"

echo "Cleaning Hexo cache and generated files..."
hexo clean

echo "Generating static pages..."
hexo generate

echo "Starting Hexo server..."
hexo server "$@"
