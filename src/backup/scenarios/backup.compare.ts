import { Input } from '@src/backup/backup.types';
import { getChangedFiles, getDirStats, getOnlyInFirst } from './backup.utils';

export async function compare(dir1: string, dir2: string, input: Input) {
    const oldDir = await getDirStats(dir1, '', input);
    const newDir = await getDirStats(dir2, '', input);

    console.log('oldDir=', oldDir);
    console.log('newDir=', newDir);

    const onlyInOld = getOnlyInFirst(oldDir, newDir);
    console.log('onlyInOld=', onlyInOld);

    const onlyInNew = getOnlyInFirst(newDir, oldDir);
    console.log('onlyInNew=', onlyInNew);

    const changedFiles = getChangedFiles(oldDir, newDir);
    console.log('changedFiles=', changedFiles);
}
