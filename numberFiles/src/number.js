const { AppParams } = require('./ports/AppParams');
const { Logger } = require('./ports/Logger');
const { AppProcess } = require('./ports/AppProcess');
const { FsInput } = require('./ports/FsInput');
const { FsOutput } = require('./ports/FsOutput');

const logger = new Logger();
const appParams = new AppParams(logger, new AppProcess());
const rawParams = process.argv.slice(2);

logger.printAbout();
appParams.validateParams(rawParams);
const params = appParams.parseParams(rawParams);

const run = async () => {
    const data = await new FsInput().readFile(params.srcFile);
    const linesAr = data.split('\n');

    let filesCounter = 0;
    const linesData = linesAr
        .filter((line) => line.trim() !== '')
        .map((line) => {
            const record = {
                isSoundFile: false,
                name: line,
                index: -1,
                prettyIndex: ''
            };
            return record;
        })
        .map((srcLine) => {
            const line = { ...srcLine };
            if (line.name.indexOf('.mp3') >= 0) {
                line.isSoundFile = true;
                line.index = ++filesCounter;
            }
            return line;
        })
        .map((srcLine) => {
            const line = { ...srcLine };
            if (line.isSoundFile) {
                line.prettyIndex = format(
                    getDigitsCount(filesCounter),
                    getDigitsCount(filesCounter),
                    line.index
                );
            } else {
                line.prettyIndex = new Array(getDigitsCount(filesCounter)).fill(' ').join('');
            }
            return line;
        })
        .map((line) => `${line.prettyIndex}${line.name}`);

    function getDigitsCount(n) {
        let digitsCount = 0;
        if (n === 0) {
            return 1;
        }
        let count = n;
        while (count > 0) {
            count = Math.floor(count / 10);
            digitsCount++;
        }
        return digitsCount;
    }

    function format(digitsCount, targetLength, n) {
        const numberLength = getDigitsCount(n);
        const zerosLength = digitsCount - numberLength;
        const spacesLength = targetLength - digitsCount;
        const zeros = new Array(zerosLength).fill('0').join('');
        const spaces = new Array(spacesLength).fill(' ').join('');
        const pretty = `${spaces}${zeros}${n}`;
        return pretty;
    }

    await new FsOutput().writeFile(params.destFile, linesData.join('\n'));
};

run();
