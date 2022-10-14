import { DirStats, CompareResult } from '@src/backup/backup.types';

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
