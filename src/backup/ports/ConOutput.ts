import { CompareResult, DirStats, FsScripts } from '@src/backup/backup.types';
const { description, name, version } = require('../../../package.json');

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

    copyFile = (from: string, to: string) => console.log(`COPY '${from}' => '${to}'`);
    delFile = (fName: string) => console.log(`DEL '${fName}'`);
    errorMkdir = (dirName: string) => console.log(`error mkdir(${dirName})`);
    errorCopyFile = (from: string, to: string) => console.log(`error COPY '${from}' => '${to}'`);

    printScripts = (fsScripts: FsScripts) => {
        console.log('fsScripts.backupDeleted=', fsScripts.backupDeleted);
        console.log('fsScripts.backupUpdateOld=', fsScripts.backupUpdateOld);
        console.log('fsScripts.backupUpdateNew=', fsScripts.backupUpdateNew);
        console.log('fsScripts.backupNew=', fsScripts.backupNew);
        console.log('fsScripts.delFromOld=', fsScripts.delFromOld);
    };

    printDescription = (scenario: string) => {
        console.log(`${name} version ${version} ${description}`);
        console.log(`selected scenario: ${scenario}`);
    };
}
