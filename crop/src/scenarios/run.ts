import { FsInput } from '@src/ports/FsInput';
import { Options } from '@src/types';
import { program } from 'commander';
import Clipper from 'image-clipper';
import Canvas from 'canvas';

interface IClipper {
    crop: (p1, p2, p3, p4) => IClipper;
    resize: (p1) => IClipper;
    quality: (p1) => IClipper;
    toFile: (p1, p2) => IClipper;
}

export async function run() {
    const options: Options = program.opts();
    if (Object.keys(options).length === 0) {
        program.help();
    }

    assertParamIsSet(program, options.input, '-i <input>');
    assertParamIsSet(program, options.output, '-o <output>');
    validateCrop(program, options.crop);
    validateResize(program, options.resize);
    validateQuality(program, options.quality);

    const fsi = new FsInput();
    const inputInfo = await fsi.getFileStats(options.input);
    const outputInfo = await fsi.getFileStats(options.output);
    const iDir = inputInfo.isDirectory();
    const oDir = outputInfo.isDirectory();

    if (!iDir && !oDir) {
        processFile(options);
    } else {
        console.log(`Supports only -i <file> and -o <file>`);
    }
}

function processFile(options: Options) {
    const inFile = options.input;
    const outFile = options.output;

    const clipper = Clipper();

    clipper.configure('canvas', Canvas);
    clipper.image(inFile, function (this: IClipper) {
        let step = 1;
        if (options.verbose) {
            console.log(`${step++}) load from ${inFile}`);
        }
        let clip = this;
        if (options.crop) {
            const cropOptionsAr = options.crop.split(',');
            const x = parseInt(cropOptionsAr[0]);
            const y = parseInt(cropOptionsAr[1]);
            const width = parseInt(cropOptionsAr[2]);
            const height = parseInt(cropOptionsAr[3]);
            clip = clip.crop(x, y, width, height);
            if (options.verbose) {
                console.log(`${step++}) crop(${x}, ${y}, ${width}, ${height})`);
            }
        }

        if (options.resize) {
            const targetWidth = parseInt(options.resize);
            clip = clip.resize(targetWidth);
            if (options.verbose) {
                console.log(`${step++}) resize to width(${targetWidth})`);
            }
        }

        if (options.quality) {
            const targetQuality = parseInt(options.quality);
            clip = clip.quality(targetQuality);
            if (options.verbose) {
                console.log(`${step++}) set image quality ${targetQuality}%`);
            }
        }

        clip.toFile(outFile, function () {
            if (options.verbose) {
                console.log(`${step++}) save into ${outFile}`);
            }
        });
    });
}

export function assertParamIsSet(program, param: string, paramName: string) {
    if (typeof param !== 'string') {
        console.log(`${paramName} is not specified. Exiting...`);
        program.help();
    }
}

function validateCrop(program, crop: string): boolean {
    if (crop) {
        const cropOptionsAr = crop.split(',');
        if (cropOptionsAr.length === 4) {
            const x = parseInt(cropOptionsAr[0]);
            const y = parseInt(cropOptionsAr[1]);
            const width = parseInt(cropOptionsAr[2]);
            const height = parseInt(cropOptionsAr[3]);
            if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                console.log(`Not a number in crop: ${crop}`);
                program.help();
                return false;
            } else {
                return true;
            }
        } else {
            console.log(
                `Expected format: X,Y,WIDTH,HEIGHT in crop options: "-c ${crop}". Example: "-c 0,0,500,300"`
            );
            program.help();
            return false;
        }
    }
    return true;
}

function validateResize(program, resize: string): boolean {
    if (resize) {
        const targetWidth = parseInt(resize);
        if (isNaN(targetWidth)) {
            console.log(`targetWidth is not a number: -r ${resize}. Example: "-r 500"`);
            program.help();
            return false;
        } else {
            return true;
        }
    }
    return true;
}

function validateQuality(program, quality: string): boolean {
    if (quality) {
        const targetQuality = parseInt(quality);
        if (isNaN(targetQuality)) {
            console.log(`targetQuality is not a number: -q ${quality}. Example: "-q 60"`);
            program.help();
            return false;
        } else {
            if (targetQuality < 1 || targetQuality > 100) {
                console.log(`targetQuality must be >=1 and <=100. Example: "-q 60"`);
                program.help();
                return false;
            } else {
                return true;
            }
        }
    }
    return true;
}
