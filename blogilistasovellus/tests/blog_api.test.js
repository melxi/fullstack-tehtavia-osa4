const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const initialBlogs = await Blog.countDocuments()
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs)
})

test('each blog has an id', async () => {
    const response = await api.get('/api/blogs')
    const identifiers = response.body.map(blog => blog.id)

    identifiers.forEach(id => {
        expect(id).toBeDefined()
    })
})

test('a valid blog can be added', async () => {
    const newBlog = new Blog({
        title: 'New Blog',
        author: 'Jane Doe',
        url: 'https://www.youtube.com',
        likes: 1
    })
    const initialBlogs = await Blog.countDocuments()

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)

    expect(response.body.length).toBe(initialBlogs + 1)
    expect(titles).toContain('New Blog')
})

test('likes value is set to 0 if not defined', async () => {
    const newBlog = {
        title: 'Lorem ipsum',
        author: 'Don Juan',
        url: 'http://www.macho.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const likes = response.body.map(blog => blog.likes)
    
    expect(likes[response.body.length - 1]).toBe(0)
})

test('a blog without title and url is not added', async () => {
    const initialBlogs = await Blog.countDocuments()
    const newBlog = Blog({
        author: 'John Doe',
        likes: 999
    })

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')
    
    expect(response.body.length).toBe(initialBlogs)
})

test('a blog can be deleted', async () => {
    const initialBlogs = await Blog.countDocuments()
    const responseAtStart = await api.get('/api/blogs')
    const blogsAtStart = responseAtStart.body.map(blog => blog)
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const responseAtEnd = await api.get('/api/blogs')
    const blogsAtEnd = responseAtEnd.body.map(blog => blog)

    expect(blogsAtEnd.length).toBe(initialBlogs - 1)
})

test('blogs likes quantity can be changed', async () => {
    const initialBlogs = await Blog.countDocuments()
    const responseAtStart = await api.get('/api/blogs')
    const blogsAtStart = responseAtStart.body.map(blog => blog)
    const blogToUpdate = blogsAtStart[0]
    
    const blog = {
        ...blogToUpdate,
        likes: Math.floor(Math.random() * 1000)
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .expect(200)

    const updatedBlog = await Blog.findByIdAndUpdate(blogToUpdate.id, blog, { new: true })

    expect(blogToUpdate.likes).not.toBe(updatedBlog.likes)
})

afterAll(async () => {
    await mongoose.connection.close()
})