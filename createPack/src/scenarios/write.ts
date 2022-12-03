import { FsInput } from '@src/ports/FsInput';
import { FsOutput } from '@src/ports/FsOutput';
import { Options } from '@src/types';
import { getCalcResult } from '@src/utils';

export const write = async (options: Options) => {
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
    const output = new FsOutput();
    console.log('write pac.bat');
    output.writeFile(`${curDir}/pac.bat`, calcResult.commands.join('\n'));
};
