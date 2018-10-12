

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect submission')
    }
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {

        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                //now insert in users
                return trx('users')
                    .returning('*') //return all the columns for the user concered
                    .insert({
                        email: loginEmail[0],//to avoid {} email format
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0])
                    })
            })//commit
            .then(trx.commit)
            //if not successful
            .catch(trx.rollback)
    })

        .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
}