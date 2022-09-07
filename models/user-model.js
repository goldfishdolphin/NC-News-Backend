const db = require('../db/connection');
exports.selectUsers = () => {
    return db.query(`SELECT * from users`).then((users) => {
        return users.rows;
    });
};