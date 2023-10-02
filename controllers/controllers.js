const {fetchTopics, fetchArticleById} = require('../models/models.js');
 
const fs = require('fs/promises');

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

    fs.readFile(endpointsPath, 'utf8')
    .then((data) => {
      const endpoints = JSON.parse(data);
      res.status(200).send(endpoints);
    })
    .catch((error) => {
        next(error);
    })
};

//4
exports.getArticleById = (req, res, next) => {
	const {article_id} = req.params;
fetchArticleById(article_id).then((article) => {
    
	res.status(200).send({article})
})
.catch((error) => {
   next(error);
})
}

 