
const fs = require('fs');
const express = require('express')
const { prisma } = require('../../database/pg')
const router = new express.Router();
const fsPromises = fs.promises;
var jwt = require('jsonwebtoken');
var validator = require("email-validator");
router.post('/createUser', async (request, response) => {
    const { username, email, password } = request.body;
    if (username == '') {
        response.send({
            status: 'error',
            message: 'Please provided a correct username',
        })
        return;

    }
     if (!username.replace(/\s/g, '').length) {
        response.send({
            status: 'error',
            message: 'You provided an username with just empty spaces',
        })
        return;
    }
    if (password.length < 8) {
        response.send({
            status: 'error',
            message: 'Password too short (need to be more than 7 characters)',
        })
        return;
    }
    if (!password.replace(/\s/g, '').length) {
        response.send({
            status: 'error',
            message: 'You provided an empty password',
        })
        return;
    }
    if (!validator.validate(email)) {
        response.send({
            status: 'error',
            message: 'Please provide a correct email',
        })
        return;
    }

    const doesUserExist = await prisma.users.findUnique({
        where: {
            email
        }
    })

    if (doesUserExist) {
        response.send({
            status: 'error',
            message: 'Email already used',
        })
        return;
    }




    const user = await prisma.users.create({
        data: {
            username,
            email,
            password
        }
    })
    await prisma.profilepictures.create({
        data: {
            user_id: user.id,
        }
    })

    const picture = await fsPromises.readFile(`${__dirname}/../../images/basic.png`);
    await fsPromises.writeFile(`${__dirname}/../../images/${user.id}.png`, picture);
    const jwtoken = jwt.sign({ id: user.id }, 'password');

    response.send({
        status: 'success',
        data: {jwtoken},
        message: 'Account created successfully',
    })
})



module.exports = router;