var jwt = require('jsonwebtoken');
const { prisma } = require('../database/pg')

const auth = async (request, response, next) => {
    const jwtoken = request.body.jwtoken;
    const decoded = jwt.decode(jwtoken, 'password');
    if (!decoded) {
        response.send({
            status: 'error',
            message: 'Please login',
        })
        return;
    }
    const { id } = decoded;
    const user = await prisma.users.findFirst({
        where: {
            id,
        }
    })
    if (!user) {
        response.send({
            status: 'error',
            message: 'Please login',
        })
        return;
    }
    request.body.account = user
    next();
}

module.exports = auth;