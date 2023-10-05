const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

checkArticleExists = async (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: 'Article does not exist' });
      }

      return result.rows[0];
    })
};
module.exports.checkArticleExists = checkArticleExists;

// checkUsernameExists = async (username) => {
//   return db.query(
//     "SELECT username FROM users WHERE username = $1;", [username])
//     .then((result) => {

//         if(result.rows.length === 0) {
//             return Promise.reject({ status: 404, message: 'Username does not exist'});
//         }
//       return result.rows[0];
//     })
// };
// module.exports.checkUsernameExists = checkUsernameExists;

exports.fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "item does not exist" });
      }

      return result.rows[0];
    });
};

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
  return db.query(articlesQuery).then(({ rows }) => {
    return rows;
  });
};
//6
exports.selectArticleComments = (articleId) => {
  return db
    .query(
      `
    SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC; 
    `,
      [articleId]
    )
    .then((result) => {
      return result.rows;
    });
};
//7
exports.insertComment = (newComment, id) => {
  const { username, body } = newComment;

  return Promise.all([
    // checkUsernameExists(newComment.username),
    checkArticleExists(id)
  ])
    .then(([articleExists]) => {
      // if (!usernameExists) {
      //   return Promise.reject({ status: 404, message:'Username does not exist' });
      // }
      if (!articleExists) {
        return Promise.reject({ status: 404, message: "Article does not exist" });
      }
    
    return db.query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3 ) RETURNING *;",
      [username, body, id] );
    })
    
    .then((result) => {
      return result.rows[0];
    });
};

//8
exports.updateArticle = async (article_id, inc_votes) => {

  const articleExistsResult = await db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]);
  if (articleExistsResult.rows.length === 0) {
    return Promise.reject({ status: 404, message: 'Article does not exist' });
  }
    
  return db.query(
    `
    UPDATE articles 
    SET votes = votes + $1
    WHERE article_id = $2 
    RETURNING *;
    `,
    [inc_votes, article_id]
  )
  .then((result) => {
    
    return result.rows[0];
  });
};

 