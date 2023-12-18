const { description, name, version } = require('../package.json');
const { program } = require('commander');
const { Scenario } = require('./types');
const { crop } = require('./scenarios/crop');

console.log('image.js! name=', name, Scenario);

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
const options = program.opts();
if (Object.keys(options).length === 0) {
    program.help();
}

if (options.scenario === Scenario.crop) {
    crop(options);
}
