const fs = require('fs');

export async function renameJpg(path) {
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
        // console.log(dirent.name);
        const fNameAr = dirent.name.split('.');
        if (fNameAr.length !== 2) {
            continue;
        }
        if (fNameAr[1] !== 'jpg') {
            continue;
        }
        if (fNameAr[0][0] === '0') {
            continue;
        }
        const newName = '0' + dirent.name;
        console.log(`${dirent.name} => ${newName}`);

        fs.renameSync(path + '/' + dirent.name, path + '/' + newName);

        // const ext = fNameAr[];
        // console.log('dirent=', dirent);
        // console.log(dirent.name);
    }
}
