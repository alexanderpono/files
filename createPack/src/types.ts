export interface FileStats {
    name: string;
    size: number;
    mtime: Date;
}

export type DirStats = Record<string, FileStats>;

export interface Options {
    workDir: string;
    backupDir: string;
    diffDir: string;
    scenario: string;
    skip: string[];
    options: string;
    sizeLimit: string;
}

export enum Scenario {
    print = 'print',
    backup = 'backup'
}
