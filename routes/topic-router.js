const express = require('express');
const topicRouter = express.Router();
const { getTopics, postTopic} = require('../controllers/controllers.js');

topicRouter
.route('/')
.get(getTopics)
.post(postTopic);

module.exports = topicRouter;

 