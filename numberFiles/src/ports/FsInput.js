const fs = require('fs');

class FsInput {
    readFile = async (fileName) => {
        return fs.promises.readFile(fileName, 'utf8', function (err, data) {
            console.log(data);
        });
    };
}

module.exports = {
    FsInput
};
