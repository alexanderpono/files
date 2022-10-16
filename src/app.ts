import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';
import { printCompareResult } from './backup/scenarios/printCompareResult';
import { backup } from './backup/scenarios/backup';
import { FsOutput } from './backup/ports/FsOutput';

// renameJpg('/tmp/pic').catch(console.error);

// printCompareResult({
//     dir1: './d1',
//     dir2: './d2',
//     backupDir:
//         './backups/' +
//         new Date(Date.now())
//             .toISOString()
//             .replace(/:/g, '-')
//             .replace(/\./g, '-')
//             .replace(/T/g, '---'),
//     input: new FsInput(),
//     output: new ConOutput()
// });

const conOutput = new ConOutput();
backup({
    dir1: './d1',
    dir2: './d2',
    backupDir:
        './backups/' +
        new Date(Date.now())
            .toISOString()
            .replace(/:/g, '-')
            .replace(/\./g, '-')
            .replace(/T/g, '---'),
    input: new FsInput(),
    conOutput,
    fsOutput: new FsOutput(conOutput)
});
