const express = require('express');
const commentRouter = express.Router();
const {deleteComment, patchVotesComment} = require('../controllers/controllers.js');


commentRouter
.route('/:comment_id')
.delete(deleteComment)
.patch(patchVotesComment)


module.exports = commentRouter;

