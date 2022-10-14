export interface FileStats {
    name: string;
    size: number;
    mtime: Date;
}

export type DirStats = Record<string, FileStats>;

export interface Input {
    openDirectory: (path: string) => Promise<unknown>;
    getFileStats: (filePath: string) => Promise<unknown>;
}
export interface DirEntry {
    name: string;
}

export interface InputFileStats {
    isDirectory: () => boolean;
    size: number;
    mtime: Date;
}
