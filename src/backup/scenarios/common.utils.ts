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
export interface PrintOptions {
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
    printDelOld: false
};

export const parseOptions = (options: string): PrintOptions => {
    const optionsSet = new Set(options.split(''));
    const result: PrintOptions = {
        ...defaultPrintOptions,
        printOldDirStats: optionsSet.has(PrintOption.PRINT_OLD_DIR_STATS),
        printNewDirStats: optionsSet.has(PrintOption.PRINT_NEW_DIR_STATS),
        printOnlyInOld: optionsSet.has(PrintOption.PRINT_ONLY_IN_OLD),
        printOnlyInNew: optionsSet.has(PrintOption.PRINT_ONLY_IN_NEW),
        printChanged: optionsSet.has(PrintOption.PRINT_CHANGED),
        printBackupDeleted: optionsSet.has(PrintOption.PRINT_CHANGED),
        printUpdateOld: optionsSet.has(PrintOption.PRINT_SCRIPT_UPDATE_OLD),
        printUpdateNew: optionsSet.has(PrintOption.PRINT_SCRIPT_UPDATE_NEW),
        printBackupNew: optionsSet.has(PrintOption.PRINT_SCRIPT_BACKUP_NEW),
        printDelOld: optionsSet.has(PrintOption.PRINT_SCRIPT_DEL_OLD)
    };

    return result;
};
