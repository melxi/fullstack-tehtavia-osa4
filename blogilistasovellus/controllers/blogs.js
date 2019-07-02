const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? false : 0
  })

  try {
    const result = await blog.save()
    
    response.status(201).json(result.toJSON())
  } catch (expection) {
    response.status(400).json({ error: expection.message })
  }
})

module.exports = blogsRouter