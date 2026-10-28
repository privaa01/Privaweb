#!/bin/sh
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
test "$(uname -s)" = Darwin
mkdir -p "$project_root/.tools/ffmpeg/9.0/bin"
clang -O2 -Wall -Wextra -Werror "$project_root/server/stories/macos-supervisor.c" -o "$project_root/.tools/ffmpeg/9.0/bin/priva-media-supervisor"
