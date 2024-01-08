const { exec } = require('child_process');
const path = require('path');

async function go() {
    const filesS = await getDir();
    const filesAr = filesS.trim().split('\n');
    const commands = filesAr.map((file, index) => {
        const parts = path.parse(file);
        const newName = filesAr.length < 100 ? `${addZero(index + 1)}` : `${addZeros(index + 1)}`;
        return `cp "data/in/${file}" "data/out/${newName}${parts.ext}"`;
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

function addZeros(n) {
    if (n < 10) {
        return `00${n}`;
    }
    if (n < 100) {
        return `0${n}`;
    }
    return '' + n;
}

go();
