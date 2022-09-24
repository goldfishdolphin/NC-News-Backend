const { response } = require("../app");
const { removeCommentById } = require("../models/comments-model");
const { selectCommentsByArticleId, insertCommentByArticleId } = require("../models/comments-model");

exports.getCommentsbyArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    })
        .catch(next);
};
exports.postCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    insertCommentByArticleId(article_id, newComment).then((comment) => {
        res.status(201).send({ comment });
    })
        .catch(next);

};
exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id).then((response) => {
        res.status(204).send(response);
    })
        .catch(next);
};