const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
    const body = request.body

    if (body.password === undefined || body.password.length < 3) {
        response.status(400).send({ error: "The password must contain at least three character"})
    } else {
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
            next(exception)
        }
    }
})

module.exports = usersRouter