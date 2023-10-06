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


//also 12
exports.fetchArticleById = (id) => {
  return db
    .query(`SELECT a.article_id, a.title, a.author, a.topic, a.body,
     a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count 
    FROM articles AS a 
    LEFT JOIN comments AS c 
    ON c.article_id = a.article_id 
    WHERE a.article_id =$1
    GROUP BY a.article_id;`
    , [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "item does not exist" });
      }
      return result.rows[0];
    });
};

//5 and 11 sortby
exports.fetchArticles = async (topic) => {
  let articlesQuery;

  if (topic) {
    const topicExistsResult = await db.query(`SELECT topic FROM articles WHERE topic = $1;`, [topic]);
    if (topicExistsResult.rows.length === 0) {
      return Promise.reject({ status: 404, message: 'Topic does not exist' });
    }

    articlesQuery = `
      SELECT a.article_id, a.title, a.author, a.topic, 
      a.created_at, a.votes, a.article_img_url, 
      COUNT(c.comment_id) AS comment_count 
      FROM articles AS a 
      LEFT JOIN comments AS c ON c.article_id = a.article_id
      WHERE a.topic = '${topic}'
      GROUP BY a.article_id
      ORDER BY a.created_at DESC;
    `;
  } else {
    articlesQuery = `
      SELECT a.article_id, a.title, a.author, a.topic, 
      a.created_at, a.votes, a.article_img_url, 
      COUNT(c.comment_id) AS comment_count 
      FROM articles AS a 
      LEFT JOIN comments AS c ON c.article_id = a.article_id
      GROUP BY a.article_id
      ORDER BY a.created_at DESC; 
    `;
  }

  return db.query(articlesQuery).then(({ rows }) => {
    return rows;
  });
};
 
//6
exports.selectArticleComments = (articleId) => {
  return db
    .query(`
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

  return Promise.all([checkArticleExists(id)])
    .then(([articleExists]) => {
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
    
  return db.query(`
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

 //9
 exports.delComment = async (id) => {
  const commentExists = await db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
  if (commentExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: 'Comment does not exist' });
  }
  return db.query(
      `DELETE FROM comments WHERE comment_id = $1;
      `, [id]
  )
};
//10
exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`)
  .then(({rows}) => {
    return rows;
  })
};