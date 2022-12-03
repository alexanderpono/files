import { FsInput } from '@src/ports/FsInput';
import { Options } from '@src/types';
import { getCalcResult } from '@src/utils';

export const print = async (options: Options) => {
    const curDir = process.cwd();
    if (options.verbose) {
        console.log('curDir=', curDir);
        console.log('options=', options);
    }
    const input = new FsInput();

    const curDirStats = await input.getDirStats(curDir, '', options.skip);
    const calcResult = getCalcResult(curDirStats, options);
    if (options.verbose) {
        console.log('calcResult=', calcResult);
    }
};
