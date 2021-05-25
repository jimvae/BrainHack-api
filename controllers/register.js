const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
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
}

export default handleRegister;