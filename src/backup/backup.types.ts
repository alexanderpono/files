export interface FileStats {
    name: string;
    size: number;
    mtime: Date;
    emptyDir?: boolean;
}
export const DIRECTORY = -1;

export type DirStats = Record<string, FileStats>;

export interface CompareResult {
    onlyInOld: string[];
    onlyInNew: string[];
    changedFiles: string[];
}

export enum FsEvent {
    DEFAULT = '',
    COPY_FILE = 'FS/COPY_FILE',
    MK_DIR = 'FS/MK_DIR',
    DEL_FILE = 'FS/DEL_FILE',
    DEL_DIR = 'FS/DEL_DIR'
}

export interface CopyFileAction {
    type: FsEvent.COPY_FILE;
    payload: {
        from: string;
        to: string;
    };
}

export interface MkDirAction {
    type: FsEvent.MK_DIR;
    payload: {
        dirName: string;
    };
}

export interface DelFileAction {
    type: FsEvent.DEL_FILE;
    payload: {
        fName: string;
    };
}

export interface DelDirAction {
    type: FsEvent.DEL_DIR;
    payload: {
        dirName: string;
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
    }),
    delDir: (dirName: string): DelDirAction => ({
        type: FsEvent.DEL_DIR,
        payload: { dirName }
    }),
    mkDir: (dirName: string): MkDirAction => ({
        type: FsEvent.MK_DIR,
        payload: { dirName }
    })
};

export interface FsScripts {
    backupDeleted: (CopyFileAction | MkDirAction)[];
    backupUpdateOld: CopyFileAction[];
    backupUpdateNew: CopyFileAction[];
    backupNew: (CopyFileAction | MkDirAction)[];

    copyNewFiles: (CopyFileAction | MkDirAction)[];
    delFromOld: (DelFileAction | DelDirAction)[];
    replaceOldFilesDel: DelFileAction[];
    replaceOldFilesCopy: CopyFileAction[];
    notDirDiffedNew: string[];
    notDirDiffedOld: string[];
}

export interface Options {
    workDir: string;
    backupDir: string;
    diffDir: string;
    scenario: string;
    skip: string[];
    options: string;
    sizeLimit: string;
}

export const DEFAULT_SIZE_LIMIT = -1;
