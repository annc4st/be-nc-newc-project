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

//5 11  15
exports.fetchArticles = async (topic, sortby="created_at", order="DESC", limit=10, page=1) => {

  const validSortBy = {
    article_id: "article_id",
    title: "title",
    body: "body",
    author: "author",
    topic: "topic",
    votes: "votes", 
    created_at: "created_at",
  };

  const validOrder = {
    DESC : 'DESC',
    ASC: 'ASC',
  }

  if (!(order in validOrder)) {
    return Promise.reject({ status: 400, message: 'Order parameter does not exist'});
  }

  if (!(sortby in validSortBy)) {
    return Promise.reject({ status: 400, message: 'Sort parameter does not exist'});
  }
  const skip = (page - 1) * limit;
   let articlesQuery;


  if (topic) {
    // console.log('topic:>> ', topic)
    const topicExistsResult = await db.query(`SELECT topic FROM articles WHERE topic = $1;`, [topic]);
    if (topicExistsResult.rows.length === 0) {
        return Promise.reject({ status: 404, message: 'Topic does not exist' });
      }

    articlesQuery = `
      SELECT a.article_id, a.title, a.author, a.body, a.topic, 
      a.created_at, a.votes, a.article_img_url, 
      COUNT(c.comment_id) AS comment_count 
      FROM articles AS a 
      LEFT JOIN comments AS c ON c.article_id = a.article_id
      WHERE a.topic = '${topic}'
      GROUP BY a.article_id, a.title, a.author, a.body, a.topic, 
      a.created_at, a.votes, a.article_img_url
      ORDER BY ${validSortBy[sortby]} ${validOrder[order]}
      LIMIT ${limit} OFFSET ${skip};
    `;
  } else if (sortby && order){
    articlesQuery = `
      SELECT a.article_id, a.title, a.author, a.body, a.topic, 
      a.created_at, a.votes, a.article_img_url, 
      COUNT(c.comment_id) AS comment_count 
      FROM articles AS a 
      LEFT JOIN comments AS c ON c.article_id = a.article_id
      GROUP BY a.article_id
      ORDER BY ${validSortBy[sortby]} ${validOrder[order]}
      LIMIT ${limit} OFFSET ${skip};
    `;
  }

  const totalCountQuery = `SELECT COUNT(*) AS total_count FROM articles AS a WHERE ${topic ? `a.topic = '${topic}'` : '1 = 1'};`; // totalCountResult
  const [articlesResult, totalCountResult]  = await Promise.all([db.query(articlesQuery), db.query(totalCountQuery)]);

  return {
    total_count: totalCountResult.rows[0].total_count,
    articles: articlesResult.rows,
    
  }
};
 
//6
exports.selectArticleComments = async (articleId, limit=10, page=1) => {
  const commentSkip = (page - 1) * limit;

  let commentQuery = `
  SELECT * FROM comments 
  WHERE article_id = ${articleId} 
  ORDER BY created_at DESC LIMIT ${limit} OFFSET ${commentSkip};
  `;

  const commentCountQuery = `
  SELECT COUNT(*) AS comment_count 
  FROM comments WHERE article_id = ${articleId};
  `;

  const [commentsResult, commentCountResult] = await Promise.all([
    db.query(commentQuery), 
    db.query(commentCountQuery)
  ])

  // console.log("models 132 >> ", commentsResult.rows)
  return  {
    comment_count: commentCountResult.rows[0].comment_count,
    commentsArray: commentsResult.rows
  }
   
    
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


exports.fetchUserByUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE username =$1;`, [username])
  .then(({rows}) => {
    if (rows.length === 0) {
     
      return null; // user not found
    }
    return rows[0];
  })
}

//18 update voting on comments
exports.updateComment = async(comment_id, inc_votes) => {
  const commentExistsResult = await db
  .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id]);

  if (commentExistsResult.rows.length === 0) {
    return Promise.reject({status: 404, message: "Comment not found"});
  }

  return db.query(
    `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`, [inc_votes, comment_id]
  )
  .then((result) => {
    return result.rows[0];
  })
  .catch((error) => {
    console.error(error);
  })
}

//19 post article
exports.insertArticle = async (newArticle) => {
  
  let { title, username, body, topic, article_img_url } = newArticle;

  if(!article_img_url) {
    article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
  }
 
  if (topic) {
    const topicExistsResult = await db.query(`SELECT slug FROM topics WHERE slug = $1;`, [topic]);
    if (topicExistsResult.rows.length === 0) {
      return Promise.reject({ status: 404, message: 'Topic does not exist' });
    }
  }

  if (username) {
    const userExistsResult = await db.query(`SELECT user FROM users WHERE username = $1;`, [username]);
    if (userExistsResult.rows.length === 0) {
      return Promise.reject({ status: 404, message: 'User does not exist' });
    }
  }
 
  return db.query(
    `INSERT INTO articles (title, author, body, topic, article_img_url) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`, [title, username, body, topic, article_img_url])
    .then((data) => {
      const result = data.rows[0];
      result.comment_count = 0; 
      return result;
    })
    .catch((error) => {
      throw error; 
    });
}
