const { Router } = require('express')
const bcrypt = require('bcryptjs')
const Users = require('../models/user')
const router = Router();
const color = require('colors')


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    // req.session.isAuthenticates = false
    //res.render('auth/login')
    //or
    req.session.destroy(() => {
        res.redirect('/auth/login')

    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const candidate = await Users.findOne({ email })

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticates = true

                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                res.redirect('/auth/login')
            }
        } else {
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.log(color.bgRed.black(err))
    }

})

router.post('/register', async (req, res) => {
    try {
        const { email, password, repeat, name } = req.body
        const candidate = await Users.findOne({ email })

        if (candidate) {
            res.redirect('/auth/login')
        } else {
            const hashpassword = await bcrypt.hash(password, 10)
            const user = new Users({
                email, name, password: hashpassword, cart: { items: [] }
            })
            await user.save()
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.log(color.bgRed.black(err))
    }
})

module.exports = router;