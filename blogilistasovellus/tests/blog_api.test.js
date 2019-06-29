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
    const contents = response.body.map(blog => blog.title)

    expect(response.body.length).toBe(initialBlogs + 1)
    expect(contents).toContain('New Blog')
})

afterAll(async () => {
    await mongoose.connection.close()
})