const express = require('express');
const {getTopics, getEndPoints, getArticleById, getArticles} = require('../controllers/controllers.js');


const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);
//4
app.get('/api/articles/:article_id', getArticleById);
//5
app.get('/api/articles', getArticles);





app.all('/*',(request, response) =>{
    response.status(404).send({ message: 'path is not found'})
  })



//Error handling
app.use((err, req, res, next) => {
  //Since we have sent a promise reject in models.js with a status code and a message this should be pciked up by your if(err.status)
  // if (res.statusCode === 404) {
  //   res.status(404).send({ message: "item is not found" })
  // }

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