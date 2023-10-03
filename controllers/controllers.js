const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  selectArticleComments,
  insertComment,
} = require("../models/models.js");

const fs = require("fs/promises");

const path = require("path");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getEndPoints = (req, res, next) => {
  const endpointsPath = path.join(__dirname, "../endpoints.json");

  fs.readFile(endpointsPath, "utf8")
    .then((data) => {
      const endpoints = JSON.parse(data);
      res.status(200).send(endpoints);
    })
    .catch((error) => {
      next(error);
    });
};

//4
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};
//5
exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};
//6
exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;

  return fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ message: "Article not found" });
      } else {
        return selectArticleComments(article_id);
      }
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};
//7
exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    
  const newComment = req.body;
  if (!newComment.body) { 
    return res.status(400).send({ message: 'Comment body cannot be empty' });
  }
  insertComment(newComment, article_id)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch((error) => {
        next(error);
    });
};
