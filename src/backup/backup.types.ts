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
