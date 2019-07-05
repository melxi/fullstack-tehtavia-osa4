const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })

app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app

