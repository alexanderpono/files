import { compare } from './backup.utils';
import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';

export interface PrintCompareProps {
    dir1: string;
    dir2: string;
    input: FsInput;
    output: ConOutput;
}
export const printCompareResult = async ({ dir1, dir2, input, output }: PrintCompareProps) => {
    const oldDir = await input.getDirStats(dir1, '');
    const newDir = await input.getDirStats(dir2, '');

    const compareResult = compare(oldDir, newDir);

    output.printDirs(oldDir, newDir);
    output.printCompareResult(compareResult);
};
