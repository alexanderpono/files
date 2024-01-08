const fs = require('fs');

class FsOutput {
    writeFile = (fileName, data) => {
        return fs.promises.writeFile(fileName, data);
    };
}

module.exports = {
    FsOutput
};
