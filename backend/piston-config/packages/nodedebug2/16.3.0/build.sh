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

# fetch vscode-node-debug2
git clone https://github.com/microsoft/vscode-node-debug2.git
cd vscode-node-debug2
npm install
npm run build

