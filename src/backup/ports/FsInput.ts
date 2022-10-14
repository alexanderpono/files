import fs from 'fs';
import { Input } from '@src/backup/backup.types';

export class FsInput implements Input {
    openDirectory = async (path: string): Promise<fs.Dir> => await fs.promises.opendir(path);
    getFileStats = async (filePath: string): Promise<fs.Stats> => await fs.promises.stat(filePath);
}
