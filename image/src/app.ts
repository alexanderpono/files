import { program } from 'commander';
import { crop } from './scenarios/crop';
const { description, name, version } = require('../package.json');
import { Options, Scenario } from './types';

program
    .name(name)
    .version(version)
    .description(description)
    .option('-s, --scenario <scenario>', 'scenario name (crop)', 'crop')
    .option('-k, --skip <files...>', 'directory or file names not to process [file1,file2...]')
    .option('-v, --verbose', 'print detailed info')
    .option('-sz, --sz <size>', 'size: x,y,w,h. Example: 10,10,20,30')
    .option('-i, --inputFile <inputFile>', 'input file name')
    .option('-o, --outputFile <outputFile>', 'output file name')
    .parse(process.argv);

console.log(`${name} ${version}`);
const options: Options = program.opts();
if (Object.keys(options).length === 0) {
    program.help();
}

switch (options.scenario) {
    case Scenario.crop: {
        crop(options);
        break;
    }
}
