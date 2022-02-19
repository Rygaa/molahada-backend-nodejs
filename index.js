const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 4005;
app.use(express.json())
app.use(cors())
const { pool } = require('./src/database/pg.js')
const { to } = require('./src/middleware/promise.js');
const login = require('./src/routers/users/login');
const signup = require('./src/routers/users/signup');
const autoLogin = require('./src/routers/users/auto-login');
const update = require('./src/routers/users/update');
const create = require('./src/routers/gadgets/create');
const edit = require('./src/routers/gadgets/edit');
const fetch = require('./src/routers/gadgets/fetch');
const profilePP = require('./src/routers/users/profile-picture');
app.use(login);
app.use(signup);
app.use(autoLogin);
app.use(create)
app.use(edit)
app.use(fetch)
app.use(update)
app.use(profilePP)

app.get('/getUsers', async (request, response) => {
    const dbRes = await to(pool.query('SELECT * FROM users ORDER BY id ASC'));
    if (dbRes[0]) {
        response.status(404).json('Error occured during the request');
        return;
    }
    response.status(200).json({
        "message": "List of users:",
        "users": dbRes[1].rows
    });
})

app.get('/getUserById', (request, response) => {
    const id = parseInt(request.body.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    })
})




app.put('/updateUser', (request, response) => {
    const { id, name, email } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
})

app.delete('/deleteUser', (request, response) => {
    const { id } = request.body

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(200).send(`User deleted with ID: ${id}`)
    })
})





app.listen(PORT, () => { console.log(`Server Listen to ${PORT}`) });


