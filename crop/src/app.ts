import { program } from 'commander';
import { run } from './scenarios/run';
const { description, name, version } = require('../package.json');

program
    .name(name)
    .version(version)
    .description(description)
    .option('-i, --input <input>', 'path to input file or folder') //'path to directory with original files'
    .option('-o, --output <output>', 'path to output file or folder') //'path to directory with original files'
    .option(
        '-c, --crop <number,number,number,number>',
        'cropParams X,Y,WIDTH,HEIGHT. Example: -c 0,0,100,50'
    )
    .option('-r, --resize <number>', 'resize to width')
    .option('-q, --quality <number 1..100>', 'resize to width')
    .option('-v, --verbose', 'print detailed info')
    .parse(process.argv);

run();
