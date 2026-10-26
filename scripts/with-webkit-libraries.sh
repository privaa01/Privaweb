#!/usr/bin/env bash
# Run browser tests with a private linker cache in a rootless mount namespace.
# Keeps the host read-only and leaves Playwright dependency validation unchanged.
set -euo pipefail
repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
lib_dir="${PRIVA_WEBKIT_LIB_DIR:-$(dirname -- "$repo_root")/.tools/webkit-libs/usr/lib/x86_64-linux-gnu}"
browser_dir="${PLAYWRIGHT_BROWSERS_PATH:-$(dirname -- "$repo_root")/.cache/ms-playwright}"
if [[ "$(uname -s)" != Linux ]] || ! command -v bwrap >/dev/null || [[ ! -x /sbin/ldconfig ]]; then
  echo 'WebKit local requiere Linux, bwrap y ldconfig; no se omiten verificaciones.' >&2
  exit 1
fi
if [[ ! -r "$lib_dir/libGLESv2.so.2" ]]; then
  echo 'Faltan las bibliotecas de WebKit. Configura PRIVA_WEBKIT_LIB_DIR con las dependencias reales instaladas.' >&2
  exit 1
fi
if (( $# == 0 )); then
  echo 'Uso: bash scripts/with-webkit-libraries.sh <comando> [argumentos...]' >&2
  exit 1
fi
mkdir -p "$repo_root/.test-output"
runtime_dir="$(mktemp -d "$repo_root/.test-output/webkit-runtime.XXXXXX")"
trap 'rm -rf -- "$runtime_dir"' EXIT
printf 'include /etc/ld.so.conf\n%s\n' "$lib_dir" > "$runtime_dir/ld.so.conf"
/sbin/ldconfig -X -C "$runtime_dir/ld.so.cache" -f "$runtime_dir/ld.so.conf"
# Only this process tree sees the private cache; /etc/ld.so.cache is not modified.
bwrap --unshare-user --unshare-pid --die-with-parent \
  --ro-bind / / --proc /proc --dev-bind /dev /dev \
  --bind "$repo_root" "$repo_root" --bind /tmp /tmp \
  --ro-bind "$runtime_dir/ld.so.cache" /etc/ld.so.cache \
  --chdir "$repo_root" \
  --setenv LD_LIBRARY_PATH "$lib_dir${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" \
  --setenv PLAYWRIGHT_BROWSERS_PATH "$browser_dir" \
  --setenv npm_config_cache "$repo_root/.test-output/npm-cache" \
  --setenv XDG_CACHE_HOME "$repo_root/.test-output/webkit-xdg-cache" \
  "$@"
