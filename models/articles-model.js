const db = require('../db/connection');
exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles
    WHERE article_id=$1;`, [article_id])
        .then((response) => {
            if (response.rows.length === 0) {
                return Promise.reject({ status: 404, message: "Article not found" });
            }
            return response.rows[0];
        });
};

exports.updateArticleByID = (articleUpdate, article_id) => {
    const { inc_votes } = articleUpdate;
    return db.query(
        `UPDATE articles 
        SET votes = votes + $1
        WHERE article_id=$2
        RETURNING * ;`,
        [inc_votes, article_id]
    )
        .then((response) => {
            return response.rows[0];
        });

};