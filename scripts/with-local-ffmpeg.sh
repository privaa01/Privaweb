#!/bin/sh
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
media_bin="$project_root/.tools/ffmpeg/9.0/bin"
if [ ! -x "$media_bin/ffmpeg" ] || [ ! -x "$media_bin/ffprobe" ]; then
  echo "Faltan FFmpeg/ffprobe locales en $media_bin" >&2
  exit 1
fi
export PATH="$media_bin:$PATH"
exec "$@"
