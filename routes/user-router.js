const express = require('express');
const userRouter = express.Router();
const {getUsers, getUserByUsername} = require('../controllers/controllers');

userRouter
.route('/')
.get(getUsers)

userRouter
.route('/:username')
.get(getUserByUsername);

module.exports = userRouter;