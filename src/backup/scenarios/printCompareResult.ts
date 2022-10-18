import { compare, createFsScripts } from './backup.utils';
import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';

export interface PrintCompareProps {
    oldDir: string;
    newDir: string;
    diffDir: string;
    input: FsInput;
    output: ConOutput;
}
export const printCompareResult = async ({
    oldDir,
    newDir,
    input,
    output,
    diffDir
}: PrintCompareProps) => {
    const oldDirStats = await input.getDirStats(oldDir, '');
    const newDirStats = await input.getDirStats(newDir, '');

    const compareResult = compare(oldDirStats, newDirStats);

    output.printDirs(oldDirStats, newDirStats);
    output.printCompareResult(compareResult);

    const fsScripts = createFsScripts(oldDir, newDir, diffDir, compareResult);
    output.printScripts(fsScripts);
};
