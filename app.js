const express = require('express');
const app = express();
const { getArticleById } = require('./controllers/get-articleById-controller');
const { getTopics } = require('./controllers/get-topics-controller');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found' });
});



module.exports = app;