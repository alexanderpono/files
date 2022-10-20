export interface FileStats {
    name: string;
    size: number;
    mtime: Date;
}

export type DirStats = Record<string, FileStats>;

export interface CompareResult {
    onlyInOld: string[];
    onlyInNew: string[];
    changedFiles: string[];
}

export enum FsEvent {
    DEFAULT = '',
    COPY_FILE = 'FS/COPY_FILE',
    DEL_FILE = 'FS/DEL_FILE'
}

export interface CopyFileAction {
    type: FsEvent.COPY_FILE;
    payload: {
        from: string;
        to: string;
    };
}

export interface DelFileAction {
    type: FsEvent.DEL_FILE;
    payload: {
        fName: string;
    };
}

export type FsAction = CopyFileAction | DelFileAction;

export const fs = {
    copyFile: (from: string, to: string): CopyFileAction => ({
        type: FsEvent.COPY_FILE,
        payload: { from, to }
    }),
    delFile: (fName: string): DelFileAction => ({
        type: FsEvent.DEL_FILE,
        payload: { fName }
    })
};

export interface FsScripts {
    backupDeleted: CopyFileAction[];
    backupUpdateOld: CopyFileAction[];
    backupUpdateNew: CopyFileAction[];
    backupNew: CopyFileAction[];

    copyNewFiles: CopyFileAction[];
    delFromOld: DelFileAction[];
    replaceOldFilesDel: DelFileAction[];
    replaceOldFilesCopy: CopyFileAction[];
}

export interface Options {
    workDir: string;
    backupDir: string;
    diffDir: string;
    scenario: string;
    skip: string[];
}
