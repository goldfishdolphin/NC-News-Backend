const { selectTopics } = require("../models/get-topic-model");

exports.getTopics = (req, res) => {
    selectTopics()
        .then((topic) => {
            res.status(200).send({ topic });
        });
};