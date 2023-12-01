const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  selectArticleComments,
  insertComment,
  updateArticle, delComment, 
  fetchUsers, fetchUserByUsername, 
  updateComment,
  insertArticle, insertTopic
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
  const { topic, sortby, order, limit, page } = req.query;
  return fetchArticles(topic, sortby, order, limit, page).then((articles) =>{
      res.status(200).send({articles})
    })
    .catch((error) => {
      next(error)
    });
}

//6
exports.getCommentsForArticle = (req, res, next) => {
  const { article_id} = req.params;
  const {limit, page} = req.query;

  return fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ message: "Article not found" });
      } else {
        return selectArticleComments(article_id, limit, page);
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

// 18
exports.patchVotesComment = (req, res, next) =>{
  const comment_id = req.params.comment_id;
  const inc_votes = req.body.inc_votes;

  if (isNaN(comment_id)) {
    return res.status(400).send({ message: 'Invalid comment_id' });
  }
  if (isNaN(inc_votes)) {
    return res.status(400).send({ message: "Invalid votes increment" });
  }  

  return updateComment(comment_id, inc_votes)
  .then((comment) => {
    res.status(200).send({ comment})
  })
  .catch((error) => {
    next(error);
})
};


//19
exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  
  if (!newArticle.title || !newArticle.username || !newArticle.body 
    || !newArticle.topic ) { 
    return res.status(422).send({ message: 'Article body, title, topic and author cannot be empty' });
  }
   
  return insertArticle(newArticle)
  .then((article) => {
    res.status(201).send({ article})
  })
  .catch((error) => {
    next(error);
  })
}

//22 POST Topic
exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  if(!newTopic.slug || !newTopic.description) {
    return res.status(422).send({ message: 'Slug and description cannot be empty' });
  }

  return insertTopic(newTopic)
  .then((topic) => {
    res.status(201).send({topic})
  })
  .catch((error) => {
    console.error("Controller - Error posting topic:", error);
    next(error);
  })
}