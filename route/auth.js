const { Router } = require('express')
const Users = require('../models/user')
const router = Router();


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
            const areSame = password === candidate.password

            req.session.user = candidate
            req.session.isAuthenticates = true

            req.session.save(err => {
                if (err) {
                    throw err
                }
                res.redirect('/')
            })

            if (areSame) {

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
        const candidate = await User.findOne({ email })

        if (candidate) {
            res.redirect('/auth/login')
        } else {
            const user = new User({
                email, name, password, cart: { items: [] }
            })
            await user.save()
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.log(color.bgRed.black(err))
    }
})

module.exports = router;