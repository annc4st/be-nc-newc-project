const express = require('express');
const commentRouter = express.Router();
const {deleteComment} = require('../controllers/controllers.js');


commentRouter
.route('/:comment_id')
.delete(deleteComment)


module.exports = commentRouter;

