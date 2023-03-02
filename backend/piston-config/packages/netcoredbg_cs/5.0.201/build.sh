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


# fetch dotnet
#
# Adapted from piston dotnet package
# https://github.com/engineer-man/piston/blob/master/packages/dotnet/5.0.201

curl "https://download.visualstudio.microsoft.com/download/pr/73a9cb2a-1acd-4d20-b864-d12797ca3d40/075dbe1dc3bba4aa85ca420167b861b6/dotnet-sdk-5.0.201-linux-x64.tar.gz" -Lo dotnet.tar.gz
tar xzf dotnet.tar.gz --strip-components=1
rm dotnet.tar.gz

# Cache nuget packages
export DOTNET_CLI_HOME=$PWD
./dotnet new console -o cache_application

rm -rf cache_application


# fetch netcoredbg
# NOTE: We have to use an outdated version since newer versions are linked with newer versions of GLIBC we can't get on Debian 10.
# TODO: Find out how to get >=GLIBCXX_3.4.26 on Buster
curl -L "https://github.com/Samsung/netcoredbg/releases/download/1.2.0-786/netcoredbg-linux-bionic-amd64.tar.gz" -o netcoredbg.tar.gz
tar xzf netcoredbg.tar.gz
rm netcoredbg.tar.gz

