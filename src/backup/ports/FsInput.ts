import fs from 'fs';
import { DirStats } from '@src/backup/backup.types';

export class FsInput {
    openDirectory = async (path: string): Promise<fs.Dir> => await fs.promises.opendir(path);
    getFileStats = async (filePath: string): Promise<fs.Stats> => await fs.promises.stat(filePath);

    getDirStats = async (rootPath: string, localDirPath: string): Promise<DirStats> => {
        const result: DirStats = {};
        const dirHandle = await this.openDirectory(rootPath);
        for await (const dirent of dirHandle) {
            const filePath = rootPath + '/' + dirent.name;
            const localPath = localDirPath + '/' + dirent.name;
            const stats = await this.getFileStats(filePath);
            if (stats.isDirectory()) {
                const subResult = await this.getDirStats(filePath, localPath);
                Object.entries(subResult).forEach(([path, data]) => {
                    result[path] = data;
                });
                continue;
            }
            result[localPath] = { name: localPath, size: stats.size, mtime: stats.mtime };
        }

        return result;
    };
}
