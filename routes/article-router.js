const express = require('express');
const articleRouter = express.Router();
const { getArticles, getArticleById, 
    patchArticle, getCommentsForArticle, postComment
} = require('../controllers/controllers.js');

articleRouter
.route('/')
.get(getArticles);

articleRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticle);

articleRouter
.route('/:article_id/comments')
.get(getCommentsForArticle)
.post(postComment);


module.exports = articleRouter;