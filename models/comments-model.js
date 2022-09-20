const { response } = require('../app');
const db = require('../db/connection');
exports.selectCommentsByArticleId = (article_id) => {
    if (typeof parseInt(article_id) !== 'number') {
        return Promise.reject({ status: 400, message: 'Bad Request' });
    }
    return db.query(
        `SELECT comment_id, body, author, votes, created_at 
        FROM comments
        WHERE article_id=$1`, [article_id])
        .then((response) => {
            if (response.rows.length === 0) {
                return Promise.reject({ status: 404, message: 'Comments not found' });
            }
            // console.log(response.rows);
            return response.rows;
        });
};