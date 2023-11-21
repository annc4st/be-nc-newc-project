const express = require('express');
const cors = require('cors');
const apiRouter = require('../routes/api-router');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);


app.all('/*',(request, response) =>{
    response.status(404).send({ message: 'path is not found'})  //to change to Bad Request
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
    res.status(500).send({ message: 'Internal server error' });
  }
  });

  // app.get('/api/topics', getTopics);
  // app.get('/api', getEndPoints);
  // app.get('/api/articles/:article_id', getArticleById);
  // app.get('/api/articles', getArticles);
  // app.patch('/api/articles/:article_id', patchArticle);
  // app.get('/api/articles/:article_id/comments', getCommentsForArticle);
  // app.post('/api/articles/:article_id/comments', postComment);
  
  // app.delete('/api/comments/:comment_id', deleteComment);
  // app.get('/api/users', getUsers);
  // app.get('/api/users/:username', getUserByUsername);

module.exports = app;