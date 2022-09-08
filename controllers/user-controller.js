const { selectUsers } = require("../models/user-model");

exports.getUser = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send(users);
    });
};
