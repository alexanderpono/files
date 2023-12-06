#!/bin/bash

npx ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -s crop -sz "$3" -i "$1" -o "$2"
