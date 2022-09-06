const { selectArticleById } = require("../models/get-articleById.model");
exports.getArticleById = (req, res) => {

    const { article_id } = req.params;

    // console.log(article_id);
    selectArticleById(article_id).then((article) => {
        // console.log(article);
        res.status(200).send({ article });
    });

};

