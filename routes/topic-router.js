const express = require('express');
const topicRouter = express.Router();
const { getTopics } = require('../controllers/controllers.js');

topicRouter
.route('/')
.get(getTopics);

module.exports = topicRouter;

 