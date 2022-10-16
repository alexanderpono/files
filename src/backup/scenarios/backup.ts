import { compare, createFsScripts } from './backup.utils';
import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';
import { FsOutput } from '../ports/FsOutput';

export interface BackupProps {
    dir1: string;
    dir2: string;
    backupDir: string;
    input: FsInput;
    conOutput: ConOutput;
    fsOutput: FsOutput;
}

export const backup = async ({
    dir1,
    dir2,
    input,
    conOutput,
    fsOutput,
    backupDir
}: BackupProps) => {
    const oldDir = await input.getDirStats(dir1, '');
    const newDir = await input.getDirStats(dir2, '');

    const compareResult = compare(oldDir, newDir);
    conOutput.printDirs(oldDir, newDir);
    conOutput.printCompareResult(compareResult);

    const fsScripts = createFsScripts(dir1, dir2, backupDir, compareResult);

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
