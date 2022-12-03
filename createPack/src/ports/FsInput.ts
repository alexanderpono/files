import fs from 'fs';
import { DIRECTORY, DirStats } from '@src/types';

export class FsInput {
    openDirectory = async (path: string): Promise<fs.Dir> => await fs.promises.opendir(path);
    getFileStats = async (filePath: string): Promise<fs.Stats> => await fs.promises.stat(filePath);

    getDirStats = async (
        rootPath: string,
        localDirPath: string,
        skipFiles: string[]
    ): Promise<DirStats> => {
        const result: DirStats = {};
        const dirHandle = await this.openDirectory(rootPath);
        const toSkip = new Set(skipFiles);
        for await (const dirent of dirHandle) {
            if (toSkip.has(dirent.name)) {
                console.log(`skipping ${dirent.name}`);
                continue;
            }
            const filePath = rootPath + '/' + dirent.name;
            const localPath = localDirPath + '/' + dirent.name;
            const stats = await this.getFileStats(filePath);
            if (stats.isDirectory()) {
                result[localPath] = { name: localPath, size: DIRECTORY, mtime: stats.mtime };
                continue;
            }
            result[localPath] = { name: localPath, size: stats.size, mtime: stats.mtime };
        }

        return result;
    };
}
