import fs from 'fs';

export const openDirectory = async (path: string): Promise<fs.Dir> =>
    await fs.promises.opendir(path);
// export const openDirectory = async (path: string) => await fs.promises.opendir(path);

export const getFileStats = async (filePath: string): Promise<fs.Stats> =>
    await fs.promises.stat(filePath);
