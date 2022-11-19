import { CompareResult, DirStats, FsScripts } from '@src/backup/backup.types';
const { description, name, version } = require('../../../package.json');

export const DEFAULT_OPTIONS = 'onONC';

enum PrintOption {
    PRINT_OLD_DIR_STATS = 'o',
    PRINT_NEW_DIR_STATS = 'n',
    PRINT_ONLY_IN_OLD = 'O',
    PRINT_ONLY_IN_NEW = 'N',
    PRINT_CHANGED = 'C',
    PRINT_SCRIPT_BACKUP_DELETED = '1',
    PRINT_SCRIPT_UPDATE_OLD = '2',
    PRINT_SCRIPT_UPDATE_NEW = '3',
    PRINT_SCRIPT_BACKUP_NEW = '4',
    PRINT_SCRIPT_DEL_OLD = '5'
}
interface PrintOptions {
    printOldDirStats: boolean;
    printNewDirStats: boolean;
    printOnlyInOld: boolean;
    printOnlyInNew: boolean;
    printChanged: boolean;
    printBackupDeleted: boolean;
    printUpdateOld: boolean;
    printUpdateNew: boolean;
    printBackupNew: boolean;
    printDelOld: boolean;
    win1251: boolean;
}

const defaultPrintOptions: PrintOptions = {
    printOldDirStats: false,
    printNewDirStats: false,
    printOnlyInOld: false,
    printOnlyInNew: false,
    printChanged: false,
    printBackupDeleted: false,
    printUpdateOld: false,
    printUpdateNew: false,
    printBackupNew: false,
    printDelOld: false,
    win1251: false
};

export class ConOutput {
    private parsedOptions: PrintOptions;
    constructor(outputOptions: string) {
        this.parsedOptions = parseOptions(outputOptions);
    }

    printDirs = (oldDir: DirStats, newDir: DirStats) => {
        if (this.parsedOptions.printOldDirStats) {
            console.log('oldDir=', oldDir);
        }
        if (this.parsedOptions.printNewDirStats) {
            console.log('newDir=', newDir);
        }
    };

    printCompareResult = (result: CompareResult) => {
        if (this.parsedOptions.printOnlyInOld) {
            console.log('onlyInOld=', result.onlyInOld);
        }
        if (this.parsedOptions.printOnlyInNew) {
            console.log('onlyInNew=', result.onlyInNew);
        }
        if (this.parsedOptions.printChanged) {
            console.log('changedFiles=', result.changedFiles);
        }
    };

    copyFile = (from: string, to: string) => console.log(`COPY '${from}' => '${to}'`);
    delFile = (fName: string) => console.log(`DEL '${fName}'`);
    errorMkdir = (dirName: string) => console.log(`error mkdir(${dirName})`);
    errorCopyFile = (from: string, to: string) => console.log(`error COPY '${from}' => '${to}'`);

    printScripts = (fsScripts: FsScripts) => {
        if (this.parsedOptions.printBackupDeleted) {
            console.log('fsScripts.backupDeleted=', fsScripts.backupDeleted);
        }

        if (this.parsedOptions.printUpdateOld) {
            console.log('fsScripts.backupUpdateOld=', fsScripts.backupUpdateOld);
        }

        if (this.parsedOptions.printUpdateNew) {
            console.log('fsScripts.backupUpdateNew=', fsScripts.backupUpdateNew);
        }

        if (this.parsedOptions.printBackupNew) {
            console.log('fsScripts.backupNew=', fsScripts.backupNew);
        }

        if (this.parsedOptions.printDelOld) {
            console.log('fsScripts.delFromOld=', fsScripts.delFromOld);
        }
    };

    printDescription = (scenario: string) => {
        console.log(`${name} version ${version} ${description}`);
        console.log(`selected scenario: ${scenario}`);
    };
}

function parseOptions(options: string): PrintOptions {
    const optionsSet = new Set(options.split(''));
    const result: PrintOptions = {
        ...defaultPrintOptions,
        printOldDirStats: optionsSet.has(PrintOption.PRINT_OLD_DIR_STATS),
        printNewDirStats: optionsSet.has(PrintOption.PRINT_NEW_DIR_STATS),
        printOnlyInOld: optionsSet.has(PrintOption.PRINT_ONLY_IN_OLD),
        printOnlyInNew: optionsSet.has(PrintOption.PRINT_ONLY_IN_NEW),
        printChanged: optionsSet.has(PrintOption.PRINT_CHANGED),
        printBackupDeleted: optionsSet.has(PrintOption.PRINT_SCRIPT_BACKUP_DELETED),
        printUpdateOld: optionsSet.has(PrintOption.PRINT_SCRIPT_UPDATE_OLD),
        printUpdateNew: optionsSet.has(PrintOption.PRINT_SCRIPT_UPDATE_NEW),
        printBackupNew: optionsSet.has(PrintOption.PRINT_SCRIPT_BACKUP_NEW),
        printDelOld: optionsSet.has(PrintOption.PRINT_SCRIPT_DEL_OLD)
    };

    return result;
}
