#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
cd "$ROOT_DIR"

IMAGES=("home-design-backend:1.0.0" "home-design-frontend:latest" "home-design-mysql:8.0")
TAR_PATH="$ROOT_DIR/scripts/home_design_system.jar"
MYSQL_PORT=${MYSQL_PORT:-3307}

build_images() {
  docker build -f docker/mysql.Dockerfile -t home-design-mysql:8.0 .
  docker build -f docker/backend.Dockerfile -t home-design-backend:1.0.0 .
  docker build -f docker/frontend.Dockerfile -t home-design-frontend:latest .
}

export_tar() {
  docker save -o "$TAR_PATH" ${IMAGES[@]}
  echo "$TAR_PATH"
}

load_tar() {
  docker load -i "$TAR_PATH"
}

up() {
  export MYSQL_PORT
  docker compose -f docker-compose.yml up -d
}

down() {
  docker compose -f docker-compose.yml down
}

case "$1" in
  build)
    build_images
    ;;
  export)
    export_tar
    ;;
  build_export)
    build_images
    export_tar
    ;;
  start)
    load_tar
    up
    ;;
  stop)
    down
    ;;
  load)
    load_tar
    ;;
  up)
    up
    ;;
  down)
    down
    ;;
  *)
    echo "Usage: $0 {build|export|build_export|start|stop|load|up|down}"
    ;;
esac