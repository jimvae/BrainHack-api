import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
const app = express();

app.use(express.json());
app.use(cors());
const db = knex({
    // connecting to database
    client: 'pg',
    // pg for postgresql
    connection: {
      host : '127.0.0.1',
    //   same as local host
      user : 'jimvincent',
      password : '',
      database : 'brainhack'
    }
  });

console.log(db.select('*').from('users').then(data => {
    console.log(data);
}));


app.post('/signin', (req, res) => {
    // bcrypt.compare("cookies", '$2a$10$sjODrZ48H/qV6/yGos9lsOftqpLoJSnGGHc0grNlJWw2W82ZVbW0q', function(err, res) {
    // console.log('first guess', res)
    // });

    // bcrypt.compare("veggies", '$2a$10$sjODrZ48H/qV6/yGos9lsOftqpLoJSnGGHc0grNlJWw2W82ZVbW0q', function(err, res) {
    //     console.log('second guess', res)
    // });

    const { email, password } = req.body;
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
              .where('email', '=', email)
              .then(user => {
                  res.json(user[0])
              })
              .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });

    // trx is for a transaction purpose
    // if one fails, everything fails

    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        // table name
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')    
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })

        .catch(err => res.status(400).json(err))
    // res.send(database.users[database.users.length - 1]);
    // or
    // res.json(database.users[database.users.length - 1]);
})


app.listen(3000, () => {
    console.log('app is running on port 3000');
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;

    // db.select('*').from('users').where({
    //     id: id
    // }) 
    // or
    db.select('*').from('users').where({id}) 
        .then(user => {
            console.log(user);
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not Found');
            }
        })
        .catch(err => res.status(400).json('error getting user'))
    // res.status(404).json('not found');
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))

})

/*

/ --> res = this is working
/signin --> POST = success/fail
post bc we are sending passwords, we want to send is as a form, not as a query string

/register --> POST = user
/profile/:userID --> GET = user
: is an optional parameter
/image --> PUT (just an update) --> updated user object (count)

*/


// // Asynchronous
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });