import fs from 'fs';
import { unicodeToWin1251 } from './unicodeToWin1251';

export class FsOutput {
    constructor() {}

    writeFile = (fName: string, data: string): Promise<void> => {
        const data1251 = unicodeToWin1251(data);
        return fs.promises.writeFile(fName, data1251);
    };
}
