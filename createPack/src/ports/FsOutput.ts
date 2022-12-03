import fs from 'fs';

export class FsOutput {
    constructor() {}

    writeFile = (fName: string, data: string): Promise<void> => {
        return fs.promises.writeFile(fName, data);
    };
}
