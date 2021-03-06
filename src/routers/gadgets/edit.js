const express = require('express')
const auth = require('../../middleware/auth');
const { prisma } = require('../../database/pg');
const router = new express.Router();

router.post('/edit-name', auth, async (request, response) => {
    const gadget = await prisma.gadgets.update({
        where: {
            id: request.body.gadgetId
        },
        data: {
            name: request.body.newName
        }
    })

    const GADGET = {
        ...gadget,
        tags: [],
    }

    response.send({
        status: 'success',
        message: 'Connected',
        data: { gadget: GADGET },
    })
    
})

router.post('/edit-description', auth, async (request, response) => {
    const gadget = await prisma.gadgets.update({
        where: {
            id: request.body.gadgetId
        },
        data: {
            description: request.body.newDescription
        }
    })


    const GADGET = {
        ...gadget,
        tags: [],
    }

    response.send({
        status: 'success',
        message: 'description updated',
        data: { gadget: GADGET },
    })
})

router.post('/add-tags', auth, async (request, response) => {
    const gadget = await prisma.gadgets.findUnique({
        where: {
            id: request.body.gadgetId
        },
    })
    
    for (let i = 0; i < request.body.newTags.length; i++) {

        await prisma.tags.create({
            data: {
                name: request.body.newTags[i],
                gadget_id: gadget.id,
            }
        })
    }

    const tags = await prisma.tags.findMany({
        where: {
            gadget_id: request.body.gadgetId
        },
    })

    const GADGET = {
        ...gadget,
        tags: tags,
    }

    response.send({
        status: 'success',
        message: 'Connected',
        data: { gadget: GADGET },
    })
})



router.post('/remove-tag', auth, async (request, response) => {
    const tag = await prisma.tags.findFirst({
        where: {
            id : request.body.tag,
        }
    })
    await prisma.tags.delete({
        where: {
            id: tag.id,
        }
    })

    response.send({
        status: 'success',
        message: 'Connected',
    })
})

router.post('/remove-gadget', auth, async (request, response) => {
    console.log(request.body)
    const tags = await prisma.tags.findMany({
        where: {
            gadget_id: request.body.gadgetId
        }
    })
    const links = await prisma.links.findMany({
        where: {
            gadget_id: request.body.gadgetId
        }
    })

    for (let i = 0; i < tags.length; i++) {
        await prisma.tags.delete({
            where: {
                id: tags[i].id,
            }
        })
    }

    for (let i = 0; i < links.length; i++) {
        await prisma.links.delete({
            where: {
                id: links[i].id,
            }
        })
    }


    const gadget = await prisma.gadgets.delete({
        where: {
            id: request.body.gadgetId,
        }
    })

    response.send({
        status: 'success',
        message: 'Connected',
    })
})






router.post('/add-links', auth, async (request, response) => {
    const { newLinks } = request.body;
    console.log(newLinks)

    const gadget = await prisma.gadgets.findUnique({
        where: {
            id: request.body.gadgetId
        },
    })

    for (let i = 0; i < newLinks.length; i++) {
        await prisma.links.create({
            data: {
                name: newLinks[i].name,
                url: newLinks[i].url,
                gadget_id: gadget.id,
            }
        })
    }
    const tags = await prisma.tags.findMany({
        where: {
            gadget_id: gadget.id
        }
    })

    const links = await prisma.links.findMany({
        where: {
            gadget_id: request.body.gadgetId
        },
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


router.post('/remove-link', auth, async (request, response) => {
    const tag = await prisma.links.findFirst({
        where: {
            id: request.body.link,
        }
    })
    await prisma.links.delete({
        where: {
            id: tag.id,
        }
    })

    response.send({
        status: 'success',
        message: 'Connected',
    })
})

module.exports = router;