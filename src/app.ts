import { FsInput } from '@src/backup/ports/FsInput';
import { ConOutput } from '@src/backup/ports/ConOutput';
import { printCompareResult } from './backup/scenarios/printCompareResult';
import { backup } from './backup/scenarios/backup';
import { FsOutput } from './backup/ports/FsOutput';
import { program } from 'commander';
import { Scenario } from './const';
const { description, name, version } = require('../package.json');
import path from 'path';

// renameJpg('/tmp/pic').catch(console.error);

program
    .name(name)
    .version(version)
    .description(description)
    .option('-w, --workDir [workDir]', 'path to directory with original files')
    .option('-b, --backupDir [backupDir]', 'path to directory of backup copy')
    .option('-d, --diffDir [diffDir]', 'path to directory to store differences')
    .option('-s, --scenario [scenario]', 'scenario name')
    .parse(process.argv);

const options = program.opts();
if (Object.keys(options).length === 0) {
    program.help();
}

function assertParamIsSet(scenario: string, param: string, paramName: string) {
    if (typeof param !== 'string') {
        console.log(`${scenario}: ${paramName} is not specified. Exiting...`);
        process.exit();
    }
}

const curDateDir = new Date(Date.now())
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\./g, '-')
    .replace(/T/g, '---');

switch (options.scenario) {
    case Scenario.print: {
        assertParamIsSet(Scenario.print, options.workDir, '-w <workDir>');
        assertParamIsSet(Scenario.print, options.backupDir, '-b <backupDir>');
        assertParamIsSet(Scenario.print, options.diffDir, '-d <diffDir>');
        printCompareResult({
            newDir: options.workDir,
            oldDir: options.backupDir,
            diffDir: path.format({ dir: options.diffDir, name: curDateDir }),
            input: new FsInput(),
            output: new ConOutput()
        });
        break;
    }

    case Scenario.backup: {
        assertParamIsSet(Scenario.print, options.workDir, '-w <workDir>');
        assertParamIsSet(Scenario.print, options.backupDir, '-b <backupDir>');
        assertParamIsSet(Scenario.print, options.diffDir, '-d <diffDir>');
        const conOutput = new ConOutput();
        backup({
            newDir: options.workDir,
            oldDir: options.backupDir,
            diffDir: path.format({ dir: options.diffDir, name: curDateDir }),
            input: new FsInput(),
            conOutput,
            fsOutput: new FsOutput(conOutput)
        });

        break;
    }
}
