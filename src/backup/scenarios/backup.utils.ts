import { DirStats, CompareResult, fs, FsScripts } from '@src/backup/backup.types';

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
    const copyNewFiles = compare.onlyInNew.map((fName: string) =>
        fs.copyFile(newDir + fName, oldDir + fName)
    );

    const replaceOldFilesDel = compare.changedFiles.map((fName: string) =>
        fs.delFile(oldDir + fName)
    );
    const replaceOldFilesCopy = compare.changedFiles.map((fName: string) =>
        fs.copyFile(newDir + fName, oldDir + fName)
    );

    return {
        delFromOld,
        backupDeleted,
        backupUpdateOld,
        backupUpdateNew,
        backupNew,
        copyNewFiles,
        replaceOldFilesDel,
        replaceOldFilesCopy
    };
};

export const getCurDateDir = () =>
    new Date(Date.now()).toISOString().replace(/:/g, '-').replace(/\./g, '-').replace(/T/g, '---');

export function assertParamIsSet(scenario: string, param: string, paramName: string) {
    if (typeof param !== 'string') {
        console.log(`${scenario}: ${paramName} is not specified. Exiting...`);
        process.exit();
    }
}
