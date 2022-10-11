const { selectEndPoints } = require("../models/endpoints-models");

exports.getEndPoints = (req, res, next) => {
    selectEndPoints().then((endpoints) => {
        res.status(200).send(endpoints);
    })
        .catch(next);
};