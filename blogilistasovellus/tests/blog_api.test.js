const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(3)
})

test('each blog has an id', async () => {
    const response = await api.get('/api/blogs')
    const identifiers = response.body.map(blog => blog.id)

    identifiers.forEach(id => {
        expect(id).toBeDefined()
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})