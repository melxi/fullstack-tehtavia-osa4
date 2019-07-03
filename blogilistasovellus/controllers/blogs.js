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
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    console.log(exception);
    
    response.status(400).json({ error: exception.message })
  }
})

module.exports = blogsRouter