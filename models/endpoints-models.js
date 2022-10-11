const fs = require("fs/promises");

exports.selectEndPoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
        return JSON.parse(data);
    });

};
