#!/bin/bash
gotenberg \
  --api-port=3000 \
  --chromium-auto-start=true &

sleep 0.5
npx tsx src/server.ts