const { getArticleById, patchArticleById, getArticles } = require('./controllers/articles-controller');
const { getTopics } = require('./controllers/topics-controller');
const { getUser } = require('./controllers/user-controller');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');

const express = require('express');
const { getCommentsbyArticleId, postCommentsByArticleId } = require('./controllers/comments-controller');
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUser);
app.patch('/api/articles/:article_id', patchArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsbyArticleId);
app.post('/api/articles/:article_id/comments', postCommentsByArticleId);


app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found' });
});



module.exports = app;