const db = require('../db/connection.js');



exports.fetchTopics = () => {
    return db.query(
        `SELECT * FROM topics`
    )
    .then(({rows}) => {
        return rows
    })
};

//4
exports.fetchArticleById = (id) => {
    return db
    .query( `SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((result) => {
   
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404,  message: 'item does not exist'});
         }

        return result.rows[0];
    })
}
   

 
    
