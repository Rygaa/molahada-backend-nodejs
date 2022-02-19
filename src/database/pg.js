const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.prisma = prisma;


// const Pool = require('pg').Pool
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'maktaba',
//     password: 'Koikoika2',
//     port: 5432,
// })
