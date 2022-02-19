
const express = require('express')
const auth = require('../../middleware/auth')
const router = new express.Router();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 
router.post('/auto-login', auth, async (request, response) => {
    await sleep(500);
    response.send({
        status: 'success',
        message: 'Connected',
        data: request.body,
    })
})

module.exports = router;