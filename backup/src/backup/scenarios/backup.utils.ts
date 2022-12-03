import {
    DirStats,
    CompareResult,
    fs,
    FsScripts,
    FileStats,
    DEFAULT_SIZE_LIMIT,
    DIRECTORY
} from '@src/backup/backup.types';

export const getOnlyInFirst = (oldDir: DirStats, newDir: DirStats) =>
    Object.keys(oldDir).filter((path: string) => typeof newDir[path] === 'undefined');

export const getChangedFiles = (oldDir: DirStats, newDir: DirStats) =>
    Object.keys(oldDir)
        .filter((path: string) => typeof newDir[path] !== 'undefined')
        .filter((path: string) => {
            if (oldDir[path].emptyDir === true && newDir[path].emptyDir === true) {
                return false;
            } else {
                return newDir[path].mtime.toString() !== oldDir[path].mtime.toString();
            }
        });

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

export interface CreateFsScriptsProps {
    oldDir: string;
    newDir: string;
    backupDir: string;
    compare: CompareResult;
    oldDirStats: DirStats;
    newDirStats: DirStats;
    sizeLimit: number;
}
export const createFsScripts = (props: CreateFsScriptsProps): FsScripts => {
    const { oldDir, newDir, backupDir, compare, oldDirStats, newDirStats, sizeLimit } = props;
    const filterOldSize = (fName: string): boolean => {
        if (sizeLimit === DEFAULT_SIZE_LIMIT) {
            return true;
        }
        const fileInfo: FileStats = oldDirStats[fName];
        return fileInfo.size < sizeLimit;
    };
    const filterNewSize = (fName: string): boolean => {
        if (sizeLimit === DEFAULT_SIZE_LIMIT) {
            return true;
        }
        const fileInfo: FileStats = newDirStats[fName];
        return fileInfo.size < sizeLimit;
    };
    const backupDeleted = compare.onlyInOld.filter(filterOldSize).map((fName: string) => {
        const fileInfo: FileStats = oldDirStats[fName];
        if (fileInfo.emptyDir) {
            return fs.mkDir(backupDir + '/toDelete' + fName);
        } else {
            return fs.copyFile(oldDir + fName, backupDir + '/toDelete' + fName);
        }
    });

    const backupUpdateOld = compare.changedFiles
        .filter(filterOldSize)
        .map((fName: string) => fs.copyFile(oldDir + fName, backupDir + '/updateOld' + fName));

    const backupUpdateNew = compare.changedFiles
        .filter(filterNewSize)
        .map((fName: string) => fs.copyFile(newDir + fName, backupDir + '/updateNew' + fName));

    const backupNew = compare.onlyInNew.filter(filterNewSize).map((fName: string) => {
        const fileInfo: FileStats = newDirStats[fName];
        if (fileInfo.emptyDir) {
            return fs.mkDir(backupDir + '/new' + fName);
        } else {
            return fs.copyFile(newDir + fName, backupDir + '/new' + fName);
        }
    });

    const delFromOld = compare.onlyInOld.map((fName: string) => {
        const fileInfo: FileStats = oldDirStats[fName];
        if (fileInfo.emptyDir) {
            return fs.delDir(oldDir + fName);
        } else {
            return fs.delFile(oldDir + fName);
        }
    });
    const copyNewFiles = compare.onlyInNew.map((fName: string) => {
        const fileInfo: FileStats = newDirStats[fName];
        if (fileInfo.emptyDir) {
            return fs.mkDir(oldDir + fName);
        } else {
            return fs.copyFile(newDir + fName, oldDir + fName);
        }
    });

    const replaceOldFilesDel = compare.changedFiles.map((fName: string) =>
        fs.delFile(oldDir + fName)
    );
    const replaceOldFilesCopy = compare.changedFiles.map((fName: string) =>
        fs.copyFile(newDir + fName, oldDir + fName)
    );
    const notDirDiffedNew = [
        ...compare.onlyInNew.filter((fName: string) => !filterNewSize(fName)),
        ...compare.changedFiles.filter((fName: string) => !filterNewSize(fName))
    ];
    const notDirDiffedOld = [
        ...compare.onlyInOld.filter((fName: string) => !filterOldSize(fName)),
        ...compare.changedFiles.filter((fName: string) => !filterOldSize(fName))
    ];

    return {
        delFromOld,
        backupDeleted,
        backupUpdateOld,
        backupUpdateNew,
        backupNew,
        copyNewFiles,
        replaceOldFilesDel,
        replaceOldFilesCopy,
        notDirDiffedNew,
        notDirDiffedOld
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
