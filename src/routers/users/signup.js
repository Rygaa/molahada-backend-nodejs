
const fs = require('fs');
const express = require('express')
const { prisma } = require('../../database/pg')
const router = new express.Router();
const fsPromises = fs.promises;

router.post('/createUser', async (request, response) => {
    const { username, email, password } = request.body;

    if (password.length < 8) {
        response.send({
            status: 'error',
            message: 'Password too short (need to be more than 7 characters)',
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

    response.send({
        status: 'success',
        message: 'Account created successfully',
    })
})



module.exports = router;