const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

test('invalid user cannot be added', async () => {
    const newUser = new User({
        username: "Melxi",
        name: "Muhammad"
    })
    const initialUsers = await User.countDocuments()

    api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const response = await api.get('/api/users')
    const users = response.body.map(user => user)

    expect(users.length).toBe(initialUsers)
})

afterAll(async () => {
    await mongoose.connection.close()
})