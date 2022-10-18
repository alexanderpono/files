import { assertParamIsSet, compare, createFsScripts, getCurDateDir } from './backup.utils';
import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';
import { FsOutput } from '../ports/FsOutput';
import { Options } from '../backup.types';
import { Scenario } from '@src/const';
import path from 'path';

export interface BackupProps {
    oldDir: string;
    newDir: string;
    diffDir: string;
    input: FsInput;
    conOutput: ConOutput;
    fsOutput: FsOutput;
}

const backup = async ({ oldDir, newDir, input, conOutput, fsOutput, diffDir }: BackupProps) => {
    const oldDirStats = await input.getDirStats(oldDir, '');
    const newDirStats = await input.getDirStats(newDir, '');

    const compareResult = compare(oldDirStats, newDirStats);
    conOutput.printDirs(oldDirStats, newDirStats);
    conOutput.printCompareResult(compareResult);

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
        fsOutput: new FsOutput(conOutput)
    });
};
