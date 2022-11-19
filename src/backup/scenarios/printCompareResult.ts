import { assertParamIsSet, compare, createFsScripts, getCurDateDir } from './backup.utils';
import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';
import { Scenario } from '@src/const';
import { Options } from '@src/backup/backup.types';
import path from 'path';
import { DEFAULT_OPTIONS, parseOptions, PrintOptions } from './common.utils';

interface PrintCompareProps {
    oldDir: string;
    newDir: string;
    diffDir: string;
    input: FsInput;
    output: ConOutput;
    skipFiles: string[];
    options: string;
}

const printCompareResult = async ({
    oldDir,
    newDir,
    input,
    output,
    diffDir,
    skipFiles,
    options
}: PrintCompareProps) => {
    output.printDescription('print');

    const oldDirStats = await input.getDirStats(oldDir, '', skipFiles);
    const newDirStats = await input.getDirStats(newDir, '', skipFiles);

    const compareResult = compare(oldDirStats, newDirStats);

    const parsedOptions: PrintOptions = parseOptions(options);
    output.printDirs(oldDirStats, newDirStats, parsedOptions);
    output.printCompareResult(compareResult, parsedOptions);

    const fsScripts = createFsScripts(oldDir, newDir, diffDir, compareResult);
    output.printScripts(fsScripts, parsedOptions);
};

export const printScenario = (options: Options) => {
    const curDateDir = getCurDateDir();

    assertParamIsSet(Scenario.print, options.workDir, '-w <workDir>');
    assertParamIsSet(Scenario.print, options.backupDir, '-b <backupDir>');
    assertParamIsSet(Scenario.print, options.diffDir, '-d <diffDir>');
    printCompareResult({
        newDir: options.workDir,
        oldDir: options.backupDir,
        diffDir: path.format({ dir: options.diffDir, name: curDateDir }),
        input: new FsInput(),
        output: new ConOutput(),
        skipFiles: options.skip,
        options: typeof options.options !== 'undefined' ? options.options : DEFAULT_OPTIONS
    });
};
