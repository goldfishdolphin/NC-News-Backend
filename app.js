const express = require('express');
const { getArticleById } = require('./controllers/get-articleById-controller');
const { getTopics } = require('./controllers/get-topics-controller');
const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);


app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    }
    else (next(err));
});
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: 'Invalid ID' });
    }
    else (next(err));
});


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
});
app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found' });
});



module.exports = app;