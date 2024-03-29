#!/bin/bash

# fetch piston, install cli dependencies
git clone https://github.com/engineer-man/piston.git
cd ./piston
cd ./cli && npm i && cd ..

# use our configs and packages
cd ..
cp piston-config/docker-compose.dev.yaml ./piston
cp piston-config/docker-compose.yaml ./piston
cp -r piston-config/packages/* ./piston/packages
cp -r build/ ./piston/packages/tracer

cd ./piston

# build custom packages
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0

./piston start
./piston build-pkg nodedebug2 16.3.0
./piston build-pkg nodedebug2_ts 16.3.0
./piston build-pkg debugpy 3.10.0
./piston build-pkg codelldb_c 8.3.0
./piston build-pkg codelldb_cpp 8.3.0
./piston build-pkg codelldb_rs 1.65.0
./piston build-pkg netcoredbg_cs 5.0.201
	
