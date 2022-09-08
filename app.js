const express = require('express');
const { getArticleById, patchArticleById, getCommentsById } = require('./controllers/articles-controller');
const { getTopics } = require('./controllers/topics-controller');
const { getUser } = require('./controllers/user-controller');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');

const app = express();
app.use(express.json());
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUser);
app.get('/api/articles/:article_id', getCommentsById);
app.patch('/api/articles/:article_id', patchArticleById);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found' });
});



module.exports = app;