import fs from 'fs';
import {
    CopyFileAction,
    DelDirAction,
    DelFileAction,
    FsEvent,
    MkDirAction
} from '@src/backup/backup.types';
import { dirname } from 'path';
import { ConOutput } from './ConOutput';

export class FsOutput {
    constructor(private con: ConOutput) {}

    copyFile = (src: string, dest: string): Promise<void> => {
        return fs.promises.copyFile(src, dest, fs.constants.COPYFILE_EXCL).then(() => {
            const srcStats = fs.statSync(src);
            fs.utimesSync(dest, srcStats.atime, srcStats.mtime);
        });
    };

    replaceFile = async (src: string, dest: string): Promise<void> => {
        await fs.promises.unlink(dest);
        return fs.promises.copyFile(src, dest, fs.constants.COPYFILE_EXCL);
    };

    delFile = (fName: string) => fs.promises.unlink(fName);
    delDir = (fName: string) => fs.promises.rmdir(fName);

    execCopyScript = (script: (CopyFileAction | MkDirAction)[]) => {
        const ERR_MKDIR = 'ERR_MKDIR';
        const ERR_COPY_FILE = 'ERR_COPY_FILE';

        return script.map((action: CopyFileAction | MkDirAction) => {
            if (action.type === FsEvent.COPY_FILE) {
                this.con.copyFile(action.payload.from, action.payload.to);
                const dirName = dirname(action.payload.to);

                return fs.promises
                    .mkdir(dirName, { recursive: true })
                    .catch(() => {
                        this.con.errorMkdir(dirName);
                        return Promise.reject(ERR_MKDIR);
                    })
                    .then(() => {
                        return this.copyFile(action.payload.from, action.payload.to);
                    })
                    .catch((e) => {
                        if (e === ERR_MKDIR) {
                            return Promise.reject(ERR_MKDIR);
                        }
                        this.con.errorCopyFile(action.payload.from, action.payload.to);
                        return Promise.reject(ERR_COPY_FILE);
                    });
            } else {
                this.con.mkDir(action.payload.dirName);
                const dirName = action.payload.dirName;

                return fs.promises.mkdir(dirName, { recursive: true }).catch(() => {
                    this.con.errorMkdir(dirName);
                    return Promise.reject(ERR_MKDIR);
                });
            }
        });
    };

    execDelScript = (script: (DelFileAction | DelDirAction)[]) => {
        return script.map((action: DelFileAction | DelDirAction) => {
            if (action.type === FsEvent.DEL_FILE) {
                this.con.delFile(action.payload.fName);
                return this.delFile(action.payload.fName);
            } else {
                this.con.delDir(action.payload.dirName);
                return this.delDir(action.payload.dirName);
            }
        });
    };
}
