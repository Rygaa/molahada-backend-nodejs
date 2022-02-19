
var jwt = require('jsonwebtoken');
const { prisma } = require('../../database/pg')
const express = require('express')
const router = new express.Router();

router.post('/login', async (request, response) => {
    const { email, password } = request.body;
    const user = await prisma.users.findFirst({
        where: { 
            email: email,
        }
    })
    if (!user) {
        response.send({
            status: 'error',
            message: 'No user found',
        })
        return;
    }

    if (user.password !== password) {
        response.send({
            status: 'error',
            message: 'Password incorrect',
        })
        return;
    }

    const jwtoken = jwt.sign({ id: user.id }, 'password');
    response.send({
        status: 'success',
        message: 'Connected',
        data: {
            jwtoken,
            username: user.username,
            email: user.email,
        }
    })
})


module.exports = router;