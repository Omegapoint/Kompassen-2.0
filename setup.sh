#!/bin/bash

git config --local core.hooksPath .githooks
npm config set scripts-prepend-node-path true

(cd webapp && npm i)
npm i

echo "🦕 Configs setup correctly"
