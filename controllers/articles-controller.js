const { selectArticleById, updateArticleByID, selectComments, selectArticles } = require("../models/articles-model");
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

exports.getArticles = (req, res, next) => {
    const { order, sort_by, topic } = req.query;

    selectArticles(order, sort_by, topic).then((articles) => {
        res.status(200).send({ articles });
    })
        .catch(next);

};