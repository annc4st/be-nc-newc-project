const db = require('../db/connection.js');

const path = require('path');


exports.fetchTopics = () => {
    return db.query(
        `SELECT * FROM topics`
    )
    .then(({rows}) => {
        return rows
    })
};

 
    
