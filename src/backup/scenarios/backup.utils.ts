import {
    DirStats,
    CompareResult,
    fs,
    DelFileAction,
    CopyFileAction
} from '@src/backup/backup.types';

export const getOnlyInFirst = (oldDir: DirStats, newDir: DirStats) =>
    Object.keys(oldDir).filter((path: string) => typeof newDir[path] === 'undefined');

export const getChangedFiles = (oldDir: DirStats, newDir: DirStats) =>
    Object.keys(oldDir)
        .filter((path: string) => typeof newDir[path] !== 'undefined')
        .filter((path: string) => newDir[path].mtime.toString() !== oldDir[path].mtime.toString());

export const compare = (oldDir: DirStats, newDir: DirStats): CompareResult => {
    const onlyInOld = getOnlyInFirst(oldDir, newDir);
    const onlyInNew = getOnlyInFirst(newDir, oldDir);
    const changedFiles = getChangedFiles(oldDir, newDir);
    return {
        onlyInOld,
        onlyInNew,
        changedFiles
    };
};

interface FsScripts {
    delFromOld: DelFileAction[];
    backupDeleted: CopyFileAction[];
    backupUpdateOld: CopyFileAction[];
    backupUpdateNew: CopyFileAction[];
    backupNew: CopyFileAction[];
}
export const createFsScripts = (
    oldDir: string,
    newDir: string,
    backupDir: string,
    compare: CompareResult
): FsScripts => {
    const backupDeleted = compare.onlyInOld.map((fName: string) =>
        fs.copyFile(oldDir + fName, backupDir + '/toDelete' + fName)
    );

    const backupUpdateOld = compare.changedFiles.map((fName: string) =>
        fs.copyFile(oldDir + fName, backupDir + '/updateOld' + fName)
    );

    const backupUpdateNew = compare.changedFiles.map((fName: string) =>
        fs.copyFile(newDir + fName, backupDir + '/updateNew' + fName)
    );

    const backupNew = compare.onlyInNew.map((fName: string) =>
        fs.copyFile(newDir + fName, backupDir + '/new' + fName)
    );

    const delFromOld = compare.onlyInOld.map((fName: string) => fs.delFile(oldDir + fName));

    return { delFromOld, backupDeleted, backupUpdateOld, backupUpdateNew, backupNew };
};
