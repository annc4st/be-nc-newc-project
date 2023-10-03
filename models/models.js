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
   
        // if (result.rows.length === 0) {
        //     return Promise.reject({ status: 404,  message: 'item does not exist'});
        //  }

        return result.rows[0];
    })
}

//5
exports.fetchArticles = () => {
    const articlesQuery = `
    SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
FROM articles AS a 
LEFT JOIN comments AS c 
ON c.article_id = a.article_id
GROUP BY a.article_id
ORDER BY a.created_at DESC; 
`;
    return db.query(articlesQuery)
        .then(({rows}) => {
           return rows
    })
}
//6
exports.selectArticleComments = (articleId) => {
    return db.query(`
    SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC; 
    `,  [articleId])
    .then((result) => {
        return result.rows;
    })
}
   

 
    
