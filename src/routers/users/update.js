const multer = require('multer')
const express = require('express')
const fs = require('fs');
const auth = require('../../middleware/auth')
const { prisma } = require('../../database/pg')
const router = new express.Router();
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });
const fsPromises = fs.promises;

router.post('/update-profile', upload.single("picture"), auth, async (request, response) => {

    if (request.body.oldPassword != request.body.account.password) {
        response.send({
            status: 'error',
            message: 'Wrong password',
        })
        return;
    } 

    let user = await prisma.users.findUnique({
        where: {
            id: request.body.account.id,
        },
     
    })

    const data = {}
    request.body.email != user.email ? data.email = request.body.email : null;
    request.body.username != user.username ? data.username = request.body.username : null;
    request.body.newPassword != user.newPassword ? data.password = request.body.newPassword : null;
    request.body.newPassword == '' ? delete data.password : null;

    user = await prisma.users.update({
        where: {
            id: request.body.account.id,
        },
        data
    })

    if (request.file) {
        await fsPromises.writeFile(`${__dirname}/../../images/${user.id}.png`, request.file.buffer)
    }

    response.send({
        status: 'success',
        message: 'Profile updated',
        data: {
            user,
        }
    })
})


module.exports = router;