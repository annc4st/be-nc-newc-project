const express = require('express');
const {
  getTopics, getEndPoints, getArticleById, getArticles,
  getCommentsForArticle, postComment, patchArticle, deleteComment,
  getUsers
} = require('../controllers/controllers.js');


const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);
//4
app.get('/api/articles/:article_id', getArticleById);
//5
app.get('/api/articles', getArticles);
//6
app.get('/api/articles/:article_id/comments', getCommentsForArticle);
//7
app.post('/api/articles/:article_id/comments', postComment);
//8
app.patch('/api/articles/:article_id', patchArticle);
//9
app.delete('/api/comments/:comment_id', deleteComment);
//10
app.get('/api/users', getUsers);





app.all('/*',(request, response) =>{
    response.status(404).send({ message: 'path is not found'})
  })



//Error handling
app.use((error, req, res, next) => {
  if (error.code === '22P02') {
    res.status(400).send({ message: 'Invalid input syntax'})
  }

    if (error.status && error.message) {
      res.status(error.status).send({ message: error.message });
    } 
    else {
       // if the error hasn't been identified,
    // respond with an internal server error
      // console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });




module.exports = app;