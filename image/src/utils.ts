export function assertParamIsSet(scenario: string, param: string, paramName: string) {
    if (typeof param !== 'string' || !param) {
        console.log(`${scenario}: ${paramName} is not specified. Exiting...`);
        process.exit();
    }
}
