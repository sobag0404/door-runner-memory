#!/bin/bash
while true; do
  cd /home/z/my-project
  node node_modules/.bin/next dev -H 0.0.0.0 --port 3000
  echo "Server died at $(date), restarting in 3 seconds..." >> /home/z/my-project/dev.log
  sleep 3
done
