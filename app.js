const express = require('express');
const { getArticleById } = require('./controllers/get-articleById-controller');
const { getTopics } = require('./controllers/get-topics-controller');
const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);



app.all('/*', (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found' });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
});



module.exports = app;