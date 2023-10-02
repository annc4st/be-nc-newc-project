const {fetchTopics} = require('../models/models.js');
const fs = require('fs');
const endPointFile = require('../endpoints.json');
const path = require('path');


exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((error) => {
        next(error);
    })
};

exports.getEndPoints = (req, res, next) => {
    const endpointsPath = path.join(__dirname, '../endpoints.json'); 
    fs.readFile(endpointsPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading endpoints.json:', err);
          res.status(500).send({ message: 'Internal server error' });
        } else {
          const endpoints = JSON.parse(data);
          console.log(endpoints)
          res.status(200).send(endpoints);
        }
      });
    };