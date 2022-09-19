const { response } = require('../app');
const db = require('../db/connection');
exports.selectCommentsByArticleId = (article_id) => {
    return db.query(
        `SELECT comment_id, body, author, votes, created_at 
        FROM comments
        WHERE article_id=$1`, [article_id])
        .then((response) => {
            // console.log(response.rows);
            return response.rows;
        });
};