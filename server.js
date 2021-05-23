import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Regina',
            email: 'regina@gmail.com',
            password: 'zhongli',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}


app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // bcrypt.compare("cookies", '$2a$10$sjODrZ48H/qV6/yGos9lsOftqpLoJSnGGHc0grNlJWw2W82ZVbW0q', function(err, res) {
    // console.log('first guess', res)
    // });

    // bcrypt.compare("veggies", '$2a$10$sjODrZ48H/qV6/yGos9lsOftqpLoJSnGGHc0grNlJWw2W82ZVbW0q', function(err, res) {
    //     console.log('second guess', res)
    // });


    // console.log('log', req.body.email);
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
         res.json(database.users[0]);   
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: String(Number(database.users[database.users.length - 1].id) + 1),
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    console.log(database.users);
    // res.send(database.users[database.users.length - 1]);
    // or
    res.json(database.users[database.users.length - 1]);
})


app.listen(3000, () => {
    console.log('app is running on port 3000');
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id === id) {
            res.json(user);
        }
    });
    res.status(404).json('no such user');
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    console.log(id);
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            user.entries++;
            found = true;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(404).json('no such user');
    }
    

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