export interface FileStats {
    name: string;
    size: number;
    mtime: Date;
    emptyDir?: boolean;
}

export type DirStats = Record<string, FileStats>;

export interface Options {
    input: string;
    output: string;
    crop: string;
    resize: string;
    quality: string;
    verbose: string;
}

export const DIRECTORY = -1;
