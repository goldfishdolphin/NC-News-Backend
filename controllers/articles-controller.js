const { selectArticleById, updateArticleByID } = require("../models/articles-model");
exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    }).catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const articleUpdate = req.body;
    updateArticleByID(articleUpdate, article_id).then((article) => {
        res.status(200).send({ article });

    })
        .catch(next);

};
