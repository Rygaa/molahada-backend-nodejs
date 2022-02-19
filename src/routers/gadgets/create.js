const express = require('express')
const auth = require('../../middleware/auth');
const { prisma } = require('../../database/pg')
const router = new express.Router();

router.post('/create-new-gadget', auth, async (request, response) => {


    // Check if gadget already exist
    const doesAlreadyExist = await prisma.gadgets.findFirst({
        where: {
            name: request.body.name,
            user_id: request.body.account.id,
        }
    })
    console.log(doesAlreadyExist)
    if (doesAlreadyExist) {
        response.send({
            status: 'error',
            message: 'Gadget already exist',
        })
        return;
    }


    const gadget = await prisma.gadgets.create({
        data: {
            name: request.body.name,
            user_id: request.body.account.id,
            description: "description"
        },
    })
    const tags = await prisma.tags.findMany({
        where: {
            gadget_id: gadget.id
        }
    })


    const GADGET = {
        ...gadget,
        tags: tags,
    }

    response.send({
        status: 'success',
        message: 'Connected',
        data: { gadget: GADGET},
    })
})



module.exports = router;