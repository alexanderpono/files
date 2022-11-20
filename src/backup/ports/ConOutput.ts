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
    PRINT_SCRIPT_BACKUP_UPDATE_OLD = '2',
    PRINT_SCRIPT_BACKUP_UPDATE_NEW = '3',
    PRINT_SCRIPT_BACKUP_NEW = '4',
    PRINT_SCRIPT_DEL_OLD = '5',
    PRINT_SCRIPT_COPY_NEW = '6',
    PRINT_NOT_DIRDIFFED_LARGE_FILES = '7'
}
interface PrintOptions {
    printOldDirStats: boolean;
    printNewDirStats: boolean;
    printOnlyInOld: boolean;
    printOnlyInNew: boolean;
    printChanged: boolean;
    printBackupDeleted: boolean;
    printBackupUpdateOld: boolean;
    printBackupUpdateNew: boolean;
    printBackupNew: boolean;
    printDelOld: boolean;
    printCopyNew: boolean;
    printNotDirDiffed: boolean;
}

const defaultPrintOptions: PrintOptions = {
    printOldDirStats: false,
    printNewDirStats: false,
    printOnlyInOld: false,
    printOnlyInNew: false,
    printChanged: false,
    printBackupDeleted: false,
    printBackupUpdateOld: false,
    printBackupUpdateNew: false,
    printBackupNew: false,
    printDelOld: false,
    printCopyNew: false,
    printNotDirDiffed: false
};

const ONE_K = 1024;
const ONE_MB = 1024 * 1024;
const bytesToSize = (bytes: number) => {
    if (bytes > ONE_MB) {
        return `${Math.floor(bytes / ONE_MB)} M`;
    }
    if (bytes > ONE_K) {
        return `${Math.floor(bytes / ONE_K)} K`;
    }
    return `${bytes}`;
};

export class ConOutput {
    private parsedOptions: PrintOptions;
    constructor(outputOptions: string, private oldDir: string, private newDir: string) {
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

    printCompareResult = (result: CompareResult, oldDirStats: DirStats, newDirStats: DirStats) => {
        const space = '============================\n';

        const echo = (varName: string, values: string[], stats: DirStats) => {
            console.log(
                `${space}${varName}=\n${values
                    .map((fileName: string) => {
                        const fileSizeBytes = stats[fileName].size;
                        return `${fileName} (${bytesToSize(fileSizeBytes)})`;
                    })
                    .join('\n')}\n\n\n`
            );
        };
        if (this.parsedOptions.printOnlyInOld) {
            echo('onlyInOld', result.onlyInOld, oldDirStats);
        }
        if (this.parsedOptions.printOnlyInNew) {
            echo('onlyInNew', result.onlyInNew, newDirStats);
        }
        if (this.parsedOptions.printChanged) {
            echo('changedFiles', result.changedFiles, newDirStats);
        }
    };

    copyFile = (from: string, to: string) => console.log(`COPY '${from}' => '${to}'`);
    delFile = (fName: string) => console.log(`DEL '${fName}'`);
    errorMkdir = (dirName: string) => console.log(`error mkdir(${dirName})`);
    errorCopyFile = (from: string, to: string) => console.log(`error COPY '${from}' => '${to}'`);

    printScripts = (fsScripts: FsScripts, oldDirStats: DirStats, newDirStats: DirStats) => {
        if (this.parsedOptions.printBackupDeleted) {
            console.log('fsScripts.backupDeleted=', fsScripts.backupDeleted);
        }

        if (this.parsedOptions.printBackupUpdateOld) {
            console.log('fsScripts.backupUpdateOld=', fsScripts.backupUpdateOld);
        }

        if (this.parsedOptions.printBackupUpdateNew) {
            console.log('fsScripts.backupUpdateNew=', fsScripts.backupUpdateNew);
        }

        if (this.parsedOptions.printBackupNew) {
            console.log('fsScripts.backupNew=', fsScripts.backupNew);
        }

        if (this.parsedOptions.printDelOld) {
            console.log('fsScripts.delFromOld=', fsScripts.delFromOld);
        }

        if (this.parsedOptions.printCopyNew) {
            console.log('fsScripts.copyNewFiles=', fsScripts.copyNewFiles);
        }

        if (this.parsedOptions.printNotDirDiffed) {
            console.log(
                'fsScripts.notDirDiffedNew=',
                fsScripts.notDirDiffedNew.map((fileName) => {
                    const fileSizeBytes = newDirStats[fileName].size;
                    return `${this.newDir}${fileName} (${bytesToSize(fileSizeBytes)})`;
                })
            );
            console.log(
                'fsScripts.notDirDiffedOld=',
                fsScripts.notDirDiffedOld.map((fileName) => {
                    const fileSizeBytes = oldDirStats[fileName].size;
                    return `${this.oldDir}${fileName} (${bytesToSize(fileSizeBytes)})`;
                })
            );
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
        printBackupUpdateOld: optionsSet.has(PrintOption.PRINT_SCRIPT_BACKUP_UPDATE_OLD),
        printBackupUpdateNew: optionsSet.has(PrintOption.PRINT_SCRIPT_BACKUP_UPDATE_NEW),
        printBackupNew: optionsSet.has(PrintOption.PRINT_SCRIPT_BACKUP_NEW),
        printDelOld: optionsSet.has(PrintOption.PRINT_SCRIPT_DEL_OLD),
        printCopyNew: optionsSet.has(PrintOption.PRINT_SCRIPT_COPY_NEW),
        printNotDirDiffed: optionsSet.has(PrintOption.PRINT_NOT_DIRDIFFED_LARGE_FILES)
    };

    return result;
}
