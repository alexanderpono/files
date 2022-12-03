import { assertParamIsSet, compare, createFsScripts, getCurDateDir } from './backup.utils';
import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput, DEFAULT_OPTIONS } from '@src/backup/ports/ConOutput';
import { Scenario } from '@src/const';
import { DEFAULT_SIZE_LIMIT, Options } from '@src/backup/backup.types';
import path from 'path';

interface PrintCompareProps {
    oldDir: string;
    newDir: string;
    diffDir: string;
    input: FsInput;
    output: ConOutput;
    skipFiles: string[];
    sizeLimit: number;
}

const printCompareResult = async ({
    oldDir,
    newDir,
    input,
    output,
    diffDir,
    skipFiles,
    sizeLimit
}: PrintCompareProps) => {
    output.printDescription('print');

    const oldDirStats = await input.getDirStats(oldDir, '', skipFiles);
    const newDirStats = await input.getDirStats(newDir, '', skipFiles);

    const compareResult = compare(oldDirStats, newDirStats);

    output.printDirs(oldDirStats, newDirStats);
    output.printCompareResult(compareResult, oldDirStats, newDirStats);

    const fsScripts = createFsScripts({
        oldDir,
        newDir,
        backupDir: diffDir,
        compare: compareResult,
        oldDirStats,
        newDirStats,
        sizeLimit
    });
    output.printScripts(fsScripts, oldDirStats, newDirStats);
};

export const printScenario = (options: Options) => {
    const curDateDir = getCurDateDir();
    const printOptions = typeof options.options !== 'undefined' ? options.options : DEFAULT_OPTIONS;
    const sizeLimit =
        typeof options.sizeLimit !== 'undefined' && !isNaN(Number(options.sizeLimit))
            ? Number(options.sizeLimit)
            : DEFAULT_SIZE_LIMIT;

    assertParamIsSet(Scenario.print, options.workDir, '-w <workDir>');
    assertParamIsSet(Scenario.print, options.backupDir, '-b <backupDir>');
    assertParamIsSet(Scenario.print, options.diffDir, '-d <diffDir>');
    printCompareResult({
        newDir: options.workDir,
        oldDir: options.backupDir,
        diffDir: path.format({ dir: options.diffDir, name: curDateDir }),
        input: new FsInput(),
        output: new ConOutput(printOptions, options.backupDir, options.workDir),
        skipFiles: options.skip,
        sizeLimit
    });
};
