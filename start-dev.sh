#!/bin/bash
cd /home/z/my-project
exec node node_modules/.bin/next dev -H 0.0.0.0 --port 3000
