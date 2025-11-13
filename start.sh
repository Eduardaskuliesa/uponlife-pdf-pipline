#!/bin/bash
gotenberg --api-port=3000 &
sleep 0.5
npx tsx src/server.ts