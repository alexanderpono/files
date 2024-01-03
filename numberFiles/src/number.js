const { AppParams } = require('./ports/AppParams');
const { Logger } = require('./ports/Logger');
const { AppProcess } = require('./ports/AppProcess');

const logger = new Logger();
const appParams = new AppParams(logger, new AppProcess());
const rawParams = process.argv.slice(2);

logger.printAbout();
appParams.validateParams(rawParams);

console.log('aaa');
