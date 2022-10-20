# files
files utilities CLI

examples

```
ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -w ./work -b ./backup -d ./diff -s print

ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -w ./work -b ./backup -d ./diff -s backup

ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts

ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -V

ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -w ./work -b ./backup -d ./diff -s backup -k .git node_modules

```