class AppParams {
    logger = null;
    appProcess = null;

    constructor(logger, appProcess) {
        this.logger = logger;
        this.appProcess = appProcess;
    }

    validateParams = (params) => {
        if (params.length < 2) {
            this.logger.log('\nFATAL: not enough parameters');
            this.logger.printUsage();
            this.appProcess.exit();
        }
    };

    parseParams = (params) => ({
        srcFile: params[0],
        destFile: params[1]
    });
}

module.exports = {
    AppParams
};
