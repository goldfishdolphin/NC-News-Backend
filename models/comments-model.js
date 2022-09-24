const { ident } = require('pg-format');
const format = require('pg-format');
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
            return response.rows;
        });
};
exports.insertCommentByArticleId = (article_id, newComment) => {
    const { username } = newComment;
    const { body } = newComment;
    let queryArray = [article_id, username, body];
    if (queryArray.includes(undefined)) {
        return Promise.reject({ status: 400, message: 'Bad Request' });
    }
    let queryString = 'INSERT INTO comments (article_id, author, body) VALUES %L RETURNING *;';
    const formattedQuery = format(queryString, [queryArray]);
    return db.query(formattedQuery).then(({ rows }) => {
        return rows[0];
    });
};