const { exec } = require('child_process');
const path = require('path');

async function go() {
    const filesS = await getDir();
    const filesAr = filesS.trim().split('\n');
    const commands = filesAr.map((file, index) => {
        const parts = path.parse(file);
        return `cp "data/in/${file}" "data/out/${addZero(index + 1)}${parts.ext}"`;
    });
    console.log('go() commands=', commands);
    const promises = commands.map((cmd) => fsOperation(cmd));
    await Promise.all(promises);
    console.log('all files are copyed with new names from data/in into data/out');
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

function addZero(n) {
    if (n < 10) {
        return `0${n}`;
    }
    return '' + n;
}

go();
