const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '123',
        database: 'smart-brain'
    }
});
// console.log(db.select('*').from('users'));
const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    //get user
    db.select('*').from('users').where({ id: id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('not found')
            }

        }).catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment( //increment
            'entries', 1
        ).returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('error processing entries'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})