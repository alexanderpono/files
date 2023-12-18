function assertParamIsSet(scenario, param, paramName) {
    if (typeof param !== 'string' || !param) {
        console.log(`${scenario}: ${paramName} is not specified. Exiting...`);
        process.exit();
    }
}

module.exports = {
    assertParamIsSet
};
