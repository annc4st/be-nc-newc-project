const express = require('express');
const endpointRouter = express.Router();
const { getEndPoints } = require('../controllers/controllers');
 

endpointRouter
.route('/')
.get(getEndPoints);
 

module.exports = endpointRouter;