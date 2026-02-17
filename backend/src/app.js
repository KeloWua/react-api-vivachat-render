const cors = require('cors');
const express = require('express')
const app = express()

const usersRoutes = require('./routes/users.routes');
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
const likesRoutes = require('./routes/likes.routes');
const chatsRoutes = require('./routes/chat/chats.routes');
const path = require("path");



app.use(cors())
app.use(express.json())
app.use('/users', usersRoutes)
app.use('/posts', postsRoutes)
app.use('/comments', commentsRoutes)
app.use('/likes', likesRoutes)
app.use('/chats', chatsRoutes)

module.exports = app;