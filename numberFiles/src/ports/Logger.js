const { description, name, version } = require('../../package.json');

class Logger {
    log(...params) {
        console.log(...params);
    }

    printUsage() {
        console.log(`
Usage: number <srcFile> <srcFile>
Example: number data/files.txt data/numberedFiles.txt
        `);
    }

    printAbout() {
        console.log(`\n\n${[name, description, version].join(' | ')}`);
    }
}

module.exports = {
    Logger
};
