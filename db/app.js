const express = require('express');
const {
  getTopics, getEndPoints, getArticleById, getArticles,
  getCommentsForArticle, postComment
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





app.all('/*',(request, response) =>{
    response.status(404).send({ message: 'path is not found'})
  })



//Error handling
app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ message: 'Invalid input syntax'})
  }

    if (err.status) {
      res.status(err.status).send({ message: err.message });
    } 
    else {
      res.status(500).send({ message: 'Internal server error' });
    }
  });




module.exports = app;