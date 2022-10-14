import { getFileStats, openDirectory } from './backup.ports.input';
import { DirStats } from './backup.types';

export const getDirStats = async (rootPath: string, localDirPath: string): Promise<DirStats> => {
    const result: DirStats = {};
    const dirHandle = await openDirectory(rootPath);
    for await (const dirent of dirHandle) {
        const filePath = rootPath + '/' + dirent.name;
        const localPath = localDirPath + '/' + dirent.name;
        const stats = await getFileStats(filePath);
        if (stats.isDirectory()) {
            const subResult = await getDirStats(filePath, localPath);
            Object.entries(subResult).forEach(([path, data]) => {
                result[path] = data;
            });
            continue;
        }
        result[localPath] = { name: localPath, size: stats.size, mtime: stats.mtime };
    }

    return result;
};

export const getOnlyInFirst = (oldDir: DirStats, newDir: DirStats) =>
    Object.keys(oldDir).filter((path: string) => typeof newDir[path] === 'undefined');

export const getChangedFiles = (oldDir: DirStats, newDir: DirStats) =>
    Object.keys(oldDir)
        .filter((path: string) => typeof newDir[path] !== 'undefined')
        .filter((path: string) => newDir[path].mtime.toString() !== oldDir[path].mtime.toString());
