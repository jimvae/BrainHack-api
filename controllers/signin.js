const handleSignin = (db, bcrypt) => (req, res) => {
    // bcrypt.compare("cookies", '$2a$10$sjODrZ48H/qV6/yGos9lsOftqpLoJSnGGHc0grNlJWw2W82ZVbW0q', function(err, res) {
    // console.log('first guess', res)
    // });

    // bcrypt.compare("veggies", '$2a$10$sjODrZ48H/qV6/yGos9lsOftqpLoJSnGGHc0grNlJWw2W82ZVbW0q', function(err, res) {
    //     console.log('second guess', res)
    // });

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
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
}

export default handleSignin;