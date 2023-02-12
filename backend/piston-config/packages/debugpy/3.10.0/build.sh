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

# install python
PREFIX=$(realpath $(dirname $0))

mkdir -p build

cd build

curl "https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz" -o python.tar.gz
tar xzf python.tar.gz --strip-components=1
rm python.tar.gz

./configure --prefix "$PREFIX" --with-ensurepip=install
make -j$(nproc)
make install -j$(nproc)

cd ..

rm -rf build

# fetch debugpy
curl -L "https://github.com/microsoft/debugpy/archive/refs/tags/v1.6.6.tar.gz" -o debugpy.tar.gz
mkdir debugpy
tar xzf debugpy.tar.gz --strip-components=1 -C debugpy
rm debugpy.tar.gz

