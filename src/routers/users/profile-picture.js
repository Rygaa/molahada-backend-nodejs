
const express = require('express')
const fs = require('fs');
const { prisma } = require('../../database/pg')
const { to } = require('../../middleware/promise')
const router = new express.Router();
const fsPromises = fs.promises;
router.get('/profile-picture/:username', async (request, response) => {
    const arr = request.params.username;

    const user = await prisma.users.findFirst({
        where: {
            username: arr,
        }
    })
    const image = await prisma.profilepictures.findFirst({
        where: {
            user_id: user.id
        }
    })

    response.set('Content-Type', 'image/png');
    const [err, data] = await to(fsPromises.readFile(`${__dirname}/../../images/${user.id}.png`))

    if (data) {
        response.send(data)
    }
})


module.exports = router;