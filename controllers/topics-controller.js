const { selectTopics } = require("../models/topic-model");
exports.getTopics = (req, res) => {
    selectTopics()
        .then((topic) => {
            res.status(200).send({ topic });
        });
};