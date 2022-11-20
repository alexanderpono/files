import { printScenario } from './backup/scenarios/printCompareResult';
import { backupScenario } from './backup/scenarios/backup';
import { program } from 'commander';
import { Scenario } from './const';
const { description, name, version } = require('../package.json');
import { Options } from './backup/backup.types';

// renameJpg('/tmp/pic').catch(console.error);

program
    .name(name)
    .version(version)
    .description(description)
    .option('-w, --workDir <workDir>', 'path to directory with original files')
    .option('-b, --backupDir <backupDir>', 'path to directory of backup copy')
    .option('-d, --diffDir <diffDir>', 'path to directory to store differences')
    .option('-k, --skip <files...>', 'directory or file names not to process [file1,file2...]')
    .option('-s, --scenario <scenario>', 'scenario name', 'print')
    .option('-o, --options <options>', 'output options [onONC1234567]')
    .option('-l, --sizeLimit <fileSizeLimitBytes>', 'max file size to put into diff dir')
    .parse(process.argv);

const options: Options = program.opts();
if (Object.keys(options).length === 0) {
    program.help();
}

switch (options.scenario) {
    case Scenario.print: {
        printScenario(options);
        break;
    }

    case Scenario.backup: {
        backupScenario(options);
        break;
    }
}
