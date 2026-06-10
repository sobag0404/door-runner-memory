#!/bin/bash
trap "" SIGHUP SIGTERM SIGINT
cd /home/z/my-project
exec node node_modules/.bin/next start -H 0.0.0.0 --port 3000
