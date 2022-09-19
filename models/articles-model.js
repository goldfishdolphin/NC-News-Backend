const format = require('pg-format');
const { response } = require('../app');
const db = require('../db/connection');
exports.selectArticleById = (article_id) => {
    return db.query(`SELECT CAST (COUNT (comment_id)as INT) as comment_count , articles.*
    FROM comments 
    RIGHT OUTER JOIN articles 
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])

        .then((response) => {
            if (response.rows.length === 0) {
                return Promise.reject({ status: 404, message: "Article not found" });
            }
            return response.rows[0];
        });
};

exports.updateArticleByID = (articleUpdate, article_id) => {
    const { inc_votes } = articleUpdate;
    if (!inc_votes) {
        return Promise.reject({ status: 400, message: 'Bad Request' });
    }
    else if (typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, message: 'Bad Request' });
    }
    return db.query(
        `UPDATE articles 
        SET votes = votes + $1
        WHERE article_id=$2
        RETURNING * ;`,
        [inc_votes, article_id]
    )
        .then((response) => {
            const comment_count = response.rows;
            return response.rows[0];
        });

};
exports.selectArticles = (order = 'DESC', sort_by = 'created_at', topic) => {
    if (!['author', 'article_id', 'title', 'votes', 'topic', 'created_at', 'comment_count'].includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'Invalid sort query' });
    }
    else if (!['asc', 'ASC', 'DESC', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, message: 'Invalid order query' });
    }

    let queryValues = [];
    let queryStr = `
SELECT articles.author,articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes , CAST (COUNT (comment_id)as INT) as comment_count
FROM comments
RIGHT OUTER JOIN articles 
ON comments.article_id = articles.article_id
`;
    if (topic) {
        queryStr += `WHERE articles.topic = %L`;
        queryValues.push(topic);
    }
    queryStr += ` 
GROUP BY articles.article_id ,comments.article_id
ORDER BY %I %s ;`;
    queryValues.push(sort_by);
    queryValues.push(order.toUpperCase());
    const formattedQuery = format(queryStr, ...queryValues);

    return db.query(formattedQuery).then((results) => {
        if (results.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Topic does not exist' });
        } else {
            return results.rows;
        }
    });
};