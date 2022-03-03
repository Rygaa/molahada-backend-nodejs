const express = require('express')
const auth = require('../../middleware/auth');
const { prisma } = require('../../database/pg')
const router = new express.Router();


router.post('/gadgets', auth, async (request, response) => {
    const gadgets = await prisma.gadgets.findMany({
        where: {
            user_id: request.body.account.id,
        },
        orderBy: [
            {
                name: 'asc'
            }
        ]
    })

    const GADGETS = []

    for(let i = 0; i < gadgets.length; i++) {
        const tags = await prisma.tags.findMany({
            where: {
                gadget_id: gadgets[i].id
            },
            select: {
                name: true,
            }
        })
        GADGETS.push({
            ...gadgets[i],
            tags: tags,
        })
    }

    response.send({
        status: 'success',
        message: 'Connected',
        data: { gadgets: GADGETS },
    })
})



router.post('/gadget/:name', auth, async (request, response) => {
    const name = request.params.name;

    const gadget = await prisma.gadgets.findFirst({
        where: {
            name,
        }
    })

    const tags = await prisma.tags.findMany({
        where: { 
            gadget_id: gadget.id
        }
    })

    const links = await prisma.links.findMany({
        where: {
            gadget_id: gadget.id
        }
    })

    const GADGET = {
        ...gadget,
        tags: tags,
        links: links,
    }

    response.send({
        status: 'success',
        message: 'Connected',
        data: { gadget: GADGET },
    })
})


module.exports = router;