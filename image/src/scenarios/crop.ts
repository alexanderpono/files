import { MyImage } from '@src/MyImage';
import { Options, Scenario } from '@src/types';
import { assertParamIsSet } from '@src/utils';

export const crop = async (options: Options) => {
    const curDir = process.cwd();
    if (options.verbose) {
        console.log('curDir=', curDir);
        console.log('options=', options);
    }
    assertParamIsSet(Scenario.crop, options.sz, '-sz <size>');
    assertParamIsSet(Scenario.crop, options.inputFile, '-i <inputFile>');
    assertParamIsSet(Scenario.crop, options.outputFile, '-o <outputFile>');

    const image = await MyImage.createFromFile(options.inputFile);
    const szAr = options.sz.split(',').map((s) => parseInt(s));
    const cropped = image.createCropped({ x: szAr[0], y: szAr[1] }, { x: szAr[2], y: szAr[3] });
    await cropped.save(options.outputFile);
    console.log(`${options.inputFile} -> crop(${options.sz}) -> ${options.outputFile}`);
};
