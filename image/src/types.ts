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
    sz: string;
    inputFile: string;
    outputFile: string;
}

export enum Scenario {
    crop = 'crop'
}

export const DIRECTORY = -1;

export interface CalcResult {
    dirs: string[];
    dirsToPack: string[];
    archives: string[];
    commands: string[];
}
