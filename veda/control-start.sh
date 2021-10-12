#!/bin/bash

VEDA_ID=A1
VEDA_VERSION=5.8.8

ulimit -c unlimited
mkdir .pids
mkdir logs
mkdir data
mkdir data/tarantool
mkdir data/files

#export RUST_LOG="debug,actix_server=info,actix_web=info"
export RUST_BACKTRACE=1

/sbin/start-stop-daemon --start --verbose --chdir $PWD --make-pidfile --pidfile $PWD/.pids/tt-pid --background --startas /bin/bash -- -c "exec tarantool ./source/init_tarantool.lua 2>./logs/tarantool-stderr.log  >./logs/tarantool-stdout.log 2>&1"
/sbin/start-stop-daemon --start --verbose --chdir $PWD --make-pidfile --pidfile $PWD/.pids/veda-pid --background --startas /bin/bash -- -c "exec ./Veda-x86_64.AppImage.$VEDA_VERSION>> $PWD/logs/veda-console.log 2>&1"

exit 0