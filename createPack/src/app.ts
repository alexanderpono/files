import { program } from 'commander';
import { print } from './scenarios/print';
import { write } from './scenarios/write';
const { description, name, version } = require('../package.json');
import { Options, Scenario } from './types';

program
    .name(name)
    .version(version)
    .description(description)
    .option('-s, --scenario <scenario>', 'scenario name (print, write)', 'write')
    .option('-k, --skip <files...>', 'directory or file names not to process [file1,file2...]')
    .option('-v, --verbose', 'print detailed info')
    .option('-m1, --m1', 'set minimum compression')
    .parse(process.argv);

console.log(`${name} ${version}`);
const options: Options = program.opts();
if (Object.keys(options).length === 0) {
    program.help();
}

switch (options.scenario) {
    case Scenario.print: {
        print(options);
        break;
    }
    case Scenario.write: {
        write(options);
        break;
    }
}
