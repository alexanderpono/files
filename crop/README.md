# crop
crop image CLI

examples

copy file from ./work/in.png to ./work/out.jpg:
```
ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -i ./work/in.png -o ./work/out.jpg
```
takeFrom(./work/in.png), putInto(./work/out.jpg), crop(2240,0,1920,1080), resizeToWidth(1280), setQuality(60%):
```
ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -i ./work/in.png -o ./work/out.jpg -c 2240,0,1920,1080 -r 1280 -q 65
```

verbose - show detailed info:
```
ts-node --project tsconfig.json -r tsconfig-paths/register src/app.ts -i ./work/in.png -o ./work/out.jpg -c 2240,0,1920,1080 -r 1280 -q 65 -v
```