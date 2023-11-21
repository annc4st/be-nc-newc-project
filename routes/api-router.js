const express = require('express');
const apiRouter = express.Router();
const endpointRouter = require('./endpoint-router')
const articleRouter = require('./article-router')
const commentRouter = require('./comment-router')
const topicRouter = require('./topic-router')
const userRouter = require('./user-router')

apiRouter.use('/', endpointRouter)
apiRouter.use('/comments', commentRouter)
apiRouter.use('/articles', articleRouter)
apiRouter.use('/topics', topicRouter)
apiRouter.use('/users', userRouter)

module.exports = apiRouter;