const handleProfileGet = (req,res,db) => {
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
}

export default handleProfileGet;