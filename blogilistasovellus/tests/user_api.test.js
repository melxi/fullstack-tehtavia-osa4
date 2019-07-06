const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

test('can\'t add user with existing username', async () => {
    const newUser = {
        username: "Melxi",
        name: "John Doe",
        password: "test"
    }
    const initialUsers = await User.countDocuments()

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const response = await api.get('/api/users')

    expect(response.body.length).toBe(initialUsers)
})

test('a user without username and atleast 3 characters long is not added', async () => {
    const newUser = {
        name: "John Doe",
        password: 'test'
    }
    const initialUsers = await User.countDocuments()

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed')

    const response = await api.get('/api/users')

    expect(response.body.length).toBe(initialUsers)
})

test('a user without password and atleast 3 characters long is not added', async () => {
    const newUser = {
        username: 'Melxi',
        name: "John Doe"
    }
    const initialUsers = await User.countDocuments()

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('The password must contain at least three character')

    const response = await api.get('/api/users')

    expect(response.body.length).toBe(initialUsers)
})

afterAll(async () => {
    await mongoose.connection.close()
})