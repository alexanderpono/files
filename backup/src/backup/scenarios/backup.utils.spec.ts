import { num, rndAr, rndSize, str } from '@src/testFramework';
import { DirStats, FileStats } from '../backup.types';
import { getChangedFiles, getOnlyInFirst } from './backup.utils';

const f1: FileStats = { name: str(), size: num(), mtime: new Date('2022-10-14T17:23:08.669Z') };
const f2: FileStats = { name: str(), size: num(), mtime: new Date('2022-10-14T20:04:44.810Z') };
const f2a: FileStats = { ...f2, mtime: new Date('2022-10-14T17:23:08.669Z') };
const f3: FileStats = { name: str(), size: num(), mtime: new Date('2022-10-14T17:23:08.669Z') };

const dirFrom = (files: FileStats[]) => {
    const result: DirStats = {};
    files.forEach((fileStat: FileStats) => {
        result[fileStat.name] = fileStat;
    });
    return result;
};

describe('getOnlyInFirst', () => {
    test.each`
        oldDir           | newDir           | expected     | testName
        ${dirFrom([f1])} | ${dirFrom([])}   | ${[f1.name]} | ${'[f1], []'}
        ${dirFrom([f1])} | ${dirFrom([f1])} | ${[]}        | ${'[f1], [f1]'}
        ${dirFrom([])}   | ${dirFrom([])}   | ${[]}        | ${'[], []'}
        ${dirFrom([])}   | ${dirFrom([f1])} | ${[]}        | ${'[], [f1]'}
    `('getOnlyInFirst($testName) returns $expected', async ({ oldDir, newDir, expected }) => {
        expect(getOnlyInFirst(oldDir, newDir)).toEqual(expected);
    });
});

describe('getChangedFiles', () => {
    test.each`
        oldDir               | newDir            | expected     | testName
        ${dirFrom([f1])}     | ${dirFrom([])}    | ${[]}        | ${'[f1], []'}
        ${dirFrom([f1])}     | ${dirFrom([f1])}  | ${[]}        | ${'[f1], [f1]'}
        ${dirFrom([])}       | ${dirFrom([])}    | ${[]}        | ${'[], []'}
        ${dirFrom([])}       | ${dirFrom([f1])}  | ${[]}        | ${'[], [f1]'}
        ${dirFrom([f1, f2])} | ${dirFrom([f2a])} | ${[f2.name]} | ${'[f1, f2], [f2a]'}
    `('getChangedFiles($testName) returns $expected', async ({ oldDir, newDir, expected }) => {
        expect(getChangedFiles(oldDir, newDir)).toEqual(expected);
    });
});
