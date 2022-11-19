import { assertParamIsSet, compare, createFsScripts, getCurDateDir } from './backup.utils';
import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';
import { FsOutput } from '@src/backup/ports/FsOutput';
import { Options } from '@src/backup/backup.types';
import { Scenario } from '@src/const';
import path from 'path';
import { DEFAULT_OPTIONS, parseOptions, PrintOptions } from './common.utils';

export interface BackupProps {
    oldDir: string;
    newDir: string;
    diffDir: string;
    input: FsInput;
    conOutput: ConOutput;
    fsOutput: FsOutput;
    skipFiles: string[];
    options: string;
}

const backup = async ({
    oldDir,
    newDir,
    input,
    conOutput,
    fsOutput,
    diffDir,
    skipFiles,
    options
}: BackupProps) => {
    conOutput.printDescription('backup');

    const oldDirStats = await input.getDirStats(oldDir, '', skipFiles);
    const newDirStats = await input.getDirStats(newDir, '', skipFiles);

    const compareResult = compare(oldDirStats, newDirStats);

    const parsedOptions: PrintOptions = parseOptions(options);

    conOutput.printDirs(oldDirStats, newDirStats, parsedOptions);
    conOutput.printCompareResult(compareResult, parsedOptions);

    const fsScripts = createFsScripts(oldDir, newDir, diffDir, compareResult);

    const backupPromises = [
        ...fsOutput.execCopyScript(fsScripts.backupDeleted),
        ...fsOutput.execCopyScript(fsScripts.backupNew),
        ...fsOutput.execCopyScript(fsScripts.backupUpdateOld),
        ...fsOutput.execCopyScript(fsScripts.backupUpdateNew)
    ];
    Promise.all(backupPromises)
        .then(() => {
            fsOutput.execDelScript(fsScripts.delFromOld);
            fsOutput.execCopyScript(fsScripts.copyNewFiles);

            Promise.all(fsOutput.execDelScript(fsScripts.replaceOldFilesDel)).then(() => {
                fsOutput.execCopyScript(fsScripts.replaceOldFilesCopy);
            });
        })
        .catch(() => {
            console.log('some of backupPromises failed');
        });
};

export const backupScenario = (options: Options) => {
    const curDateDir = getCurDateDir();

    assertParamIsSet(Scenario.print, options.workDir, '-w <workDir>');
    assertParamIsSet(Scenario.print, options.backupDir, '-b <backupDir>');
    assertParamIsSet(Scenario.print, options.diffDir, '-d <diffDir>');
    const conOutput = new ConOutput();
    backup({
        newDir: options.workDir,
        oldDir: options.backupDir,
        diffDir: path.format({ dir: options.diffDir, name: curDateDir }),
        input: new FsInput(),
        conOutput,
        fsOutput: new FsOutput(conOutput),
        skipFiles: options.skip,
        options: typeof options.options !== 'undefined' ? options.options : DEFAULT_OPTIONS
    });
};
