#!/bin/bash

# get node
curl "https://nodejs.org/dist/v16.3.0/node-v16.3.0-linux-x64.tar.xz" -o node.tar.xz
tar xf node.tar.xz
mv node-v16.3.0-linux-x64 node
rm node.tar.xz

# fetch the built tracer
cp -r ../../tracer .

# add node utils to temp PATH
source ./environment

# install gcc
# XXX: we should build from source to pin version, but I don't have time to wait for that
apt install build-essential

# fetch codelldb
mkdir codelldb && cd codelldb
curl -L "https://github.com/vadimcn/vscode-lldb/releases/download/v1.8.1/codelldb-x86_64-linux.vsix" -o codelldb.vsix
unzip codelldb.vsix
rm codelldb.vsix

