import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';
import { printCompareResult } from './backup/scenarios/printCompareResult';

// renameJpg('/tmp/pic').catch(console.error);
printCompareResult({
    dir1: './d1',
    dir2: './d2',
    input: new FsInput(),
    output: new ConOutput()
});
