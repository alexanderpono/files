import { program } from 'commander';
const { description, name, version } = require('../package.json');
import { Options, Scenario } from './types';

program
    .name(name)
    .version(version)
    .description(description)
    .option('-s, --scenario <scenario>', 'scenario name', 'print')
    .parse(process.argv);

const options: Options = program.opts();
if (Object.keys(options).length === 0) {
    program.help();
}

switch (options.scenario) {
    case Scenario.print: {
        break;
    }
}
