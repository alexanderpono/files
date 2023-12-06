const { exec } = require('child_process');

async function go(command) {
    const filesS = await getDir();
    const filesAr = filesS.trim().split('\n');
    const commands = filesAr.map((file, index) => {
        return `${command} ${file}`;
    });
    console.log('go() commands=', commands);
    const promises = commands.map((cmd) => fsOperation(cmd));
    await Promise.all(promises);
    console.log('all files are cropped from data/in into data/out');
}

function fsOperation(op) {
    return new Promise((resolve, reject) => {
        exec(op, function callback(error, stdout, stderr) {
            if (error) {
                resolve('');
                return;
            }
            resolve(stdout);
        });
    });
}
function getDir() {
    return fsOperation(`ls data/in`);
}

go('./crop2530.sh');
