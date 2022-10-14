import { CompareResult, DirStats } from '@src/backup/backup.types';

export class ConOutput {
    printDirs = (oldDir: DirStats, newDir: DirStats) => {
        console.log('oldDir=', oldDir);
        console.log('newDir=', newDir);
    };

    printCompareResult = (result: CompareResult) => {
        console.log('onlyInOld=', result.onlyInOld);
        console.log('onlyInNew=', result.onlyInNew);
        console.log('changedFiles=', result.changedFiles);
    };
}
