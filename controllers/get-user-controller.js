const { selectUsers } = require("../models/get-user-model");

exports.getUser = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send(users);
    });
};