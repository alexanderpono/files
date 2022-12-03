import { CalcResult, DIRECTORY, DirStats, FileStats, Options } from './types';

export const getCalcResult = (curDirStats: DirStats, options: Options): CalcResult => {
    const delFirstChar = (fileStat: FileStats): FileStats => ({
        ...fileStat,
        name: fileStat.name.substring(1)
    });

    const toPrint = (stats: FileStats[]): string[] => stats.map((fileStat) => fileStat.name);

    const getArchives = (dirStats: DirStats, ext: string): FileStats[] => {
        return Object.entries(curDirStats)
            .filter(([fileName, fileStat]) => {
                return (
                    (fileStat as FileStats).size !== DIRECTORY && fileName.split('.').pop() === ext
                );
            })
            .map(([fileName, fileStat]) => delFirstChar(fileStat));
    };
    const archives = getArchives(curDirStats, 'rar');
    const archivesSet = new Set(
        ...archives.map((archive: FileStats) => {
            const ar = archive.name.split('.');
            return ar.slice(0, ar.length - 1);
        })
    );

    const dirs = Object.entries(curDirStats)
        .filter(([fileName, fileStat]) => {
            return (fileStat as FileStats).size === DIRECTORY;
        })
        .map(([fileName, fileStat]) => delFirstChar(fileStat));

    const dirsToPack = dirs.filter((fileStat: FileStats) => !archivesSet.has(fileStat.name));
    const m1 = options.m1 ? '-m1 ' : '';
    const commands = toPrint(dirsToPack).map(
        (dirName: string) => `rar m -r -y ${m1}"${dirName}" "${dirName}"`
    );
    return {
        dirs: toPrint(dirs),
        archives: toPrint(archives),
        dirsToPack: toPrint(dirsToPack),
        commands
    };
};
