import { CompareResult, DirStats, FsScripts } from '@src/backup/backup.types';
import { PrintOptions } from '@src/backup/scenarios/common.utils';
const { description, name, version } = require('../../../package.json');

export class ConOutput {
    printDirs = (oldDir: DirStats, newDir: DirStats, parsedOptions: PrintOptions) => {
        if (parsedOptions.printOldDirStats) {
            console.log('oldDir=', oldDir);
        }
        if (parsedOptions.printNewDirStats) {
            console.log('newDir=', newDir);
        }
    };

    printCompareResult = (result: CompareResult, parsedOptions: PrintOptions) => {
        if (parsedOptions.printOnlyInOld) {
            console.log('onlyInOld=', result.onlyInOld);
        }
        if (parsedOptions.printOnlyInNew) {
            console.log('onlyInNew=', result.onlyInNew);
        }
        if (parsedOptions.printChanged) {
            console.log('changedFiles=', result.changedFiles);
        }
    };

    copyFile = (from: string, to: string) => console.log(`COPY '${from}' => '${to}'`);
    delFile = (fName: string) => console.log(`DEL '${fName}'`);
    errorMkdir = (dirName: string) => console.log(`error mkdir(${dirName})`);
    errorCopyFile = (from: string, to: string) => console.log(`error COPY '${from}' => '${to}'`);

    printScripts = (fsScripts: FsScripts, parsedOptions: PrintOptions) => {
        if (parsedOptions.printBackupDeleted) {
            console.log('fsScripts.backupDeleted=', fsScripts.backupDeleted);
        }

        if (parsedOptions.printUpdateOld) {
            console.log('fsScripts.backupUpdateOld=', fsScripts.backupUpdateOld);
        }

        if (parsedOptions.printUpdateNew) {
            console.log('fsScripts.backupUpdateNew=', fsScripts.backupUpdateNew);
        }

        if (parsedOptions.printBackupNew) {
            console.log('fsScripts.backupNew=', fsScripts.backupNew);
        }

        if (parsedOptions.printDelOld) {
            console.log('fsScripts.delFromOld=', fsScripts.delFromOld);
        }
    };

    printDescription = (scenario: string) => {
        console.log(`${name} version ${version} ${description}`);
        console.log(`selected scenario: ${scenario}`);
    };
}
