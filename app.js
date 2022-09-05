const express = require('express');
const { getTopics } = require('./controllers/get-topics-controller');
const app = express();

app.get('/api/topics', getTopics);



module.exports = app;