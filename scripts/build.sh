#!/usr/bin/env bash
set -e

# Cleanup
rm -rf lib es

echo 'Compile JS...'
rollup -c scripts/rollup.config.js
echo 'Done.'
echo ''

echo 'Build ES modules...'
NODE_ENV=es babel src --out-dir es --ignore 'src/browser.js'
echo 'Done.'
echo ''

echo 'Done building assets.'
