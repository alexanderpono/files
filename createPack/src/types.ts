export interface FileStats {
    name: string;
    size: number;
    mtime: Date;
}

export type DirStats = Record<string, FileStats>;

export interface Options {
    scenario: string;
    skip: string[];
    verbose: string;
    m1: string;
}

export enum Scenario {
    print = 'print',
    write = 'write'
}

export const DIRECTORY = -1;

export interface CalcResult {
    dirs: string[];
    dirsToPack: string[];
    archives: string[];
    commands: string[];
}
