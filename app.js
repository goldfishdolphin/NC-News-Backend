const express = require('express');
const app = express();
const { getArticleById } = require('./controllers/get-articles-controller');
const { getTopics } = require('./controllers/get-topics-controller');
const { getUser } = require('./controllers/get-user-controller');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');

app.use(express.static('public'));
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUser);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found' });
});



module.exports = app;