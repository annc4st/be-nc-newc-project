const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  selectArticleComments,
  insertComment,
  updateArticle, delComment, fetchUsers, fetchUserByUsername
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
//5 , 11
exports.getArticles = (req, res, next) => {
  const topic = req.query.topic;
  const sortby = req.query.sortby;
  const order = req.query.order;
  return fetchArticles(topic, sortby, order).then((articles) =>{
      res.status(200).send({articles})
    })
    .catch((error) => {
      next(error)
    });
}

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

  if (!newComment.body || !newComment.username) { 
    return res.status(400).send({ message: 'Comment body and username cannot be empty' });
    }  
    if (isNaN(article_id)) {
        return res.status(400).send({ message: 'Invalid article_id' });
    }

    insertComment(newComment, article_id)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch((error) => {
        next(error);
    })
};

//8 an object in the form { inc_votes: newVote }
exports.patchArticle = (req, res, next) => {
    
  const article_id=  req.params.article_id;
  const inc_votes = req.body.inc_votes;
  if (isNaN(article_id)) {
    return res.status(400).send({ message: 'Invalid article_id' });
}

  if (isNaN(inc_votes)) {
    return res.status(400).send({ message: "Invalid votes increment" });
  }  
   
    return updateArticle(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({article});
    })
    .catch((error) => {
        next(error);
    })
};

//9
exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params;
  // catching this error with psql 
//   if (isNaN(comment_id)) {
//     return res.status(400).send({ message: 'Invalid comment_id' });
// }
  delComment(comment_id).then(() =>{
    res.status(204).send();
  })
  .catch((error) => {
    next(error);
})
}
//10
exports.getUsers = (req, res, next) =>{
  fetchUsers()
  .then((users) => {
    res.status(200).send({ users });
  })
  .catch((error) => {
    next(error);
  });
};


exports.getUserByUsername = (req, res, next) =>{
  const { username } = req.params;

  fetchUserByUsername(username)
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    })
    .catch((error) => {
      next(error);
    });
}



