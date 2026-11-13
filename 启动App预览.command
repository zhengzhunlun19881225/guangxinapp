#!/bin/zsh
cd "$(dirname "$0")" || exit 1
APP_NODE="$(command -v node)"
if [[ -z "$APP_NODE" && -x "/Users/alien/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
  APP_NODE="/Users/alien/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ -z "$APP_NODE" ]]; then
  print "请先安装 Node.js 22.12 或更新版本，然后重新运行本文件。"
  read -k 1
  exit 1
fi
"$APP_NODE" scripts/serve.mjs
