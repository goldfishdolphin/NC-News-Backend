const { selectCommentsByArticleId } = require("../models/comments-model");

exports.getCommentsbyArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    })
        .catch(next);
};