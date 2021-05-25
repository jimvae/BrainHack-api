import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
const app = express();
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import { handleAPICall, handleImage} from './controllers/image.js';


app.use(express.json());
app.use(cors());

const db = knex({
    // connecting to database
    client: 'pg',
    // pg for postgresql
    connection: {
      connectionString : process.env.DATABASE_URL,
    //   same as local host
      ssl: true
    }
  });

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})
app.get('/', (req, res) => { res.send('it is working')});
app.post('/signin', handleSignin(db, bcrypt));
// you can improve this by memoization and need to change the controller file
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/imageurl', (req, res) => handleAPICall(req, res));
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