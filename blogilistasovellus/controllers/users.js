const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltsRound = 10
    const passwordHash = await bcrypt.hash(body.password, saltsRound)
    const user = User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (exception) {
        response.status(400).send({ error: exception.message })
    }
})

module.exports = usersRouter