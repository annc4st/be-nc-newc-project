const express = require('express');
const {getTopics, getEndPoints} = require('../controllers/controllers.js');


const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);



app.all('/*',(request, response) =>{
    console.log(response)
    response.status(404).send({ message: 'path is not found'})
  })

//Error handling
app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.message });
    } 
    else {
      res.status(500).send({ message: 'Internal server error' });
    }
  });




module.exports = app;