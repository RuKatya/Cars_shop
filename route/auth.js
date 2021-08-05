const { Router } = require('express')
const Users = require('../models/user')
const router = Router()

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
    const user = await Users.findById('60fde6f04306ab2288739bb0')
    req.session.user = user

    // app.use(async (req, res, next) => {
    //     try {
    //         req.user = user
    //         next()
    //     } catch (err) {
    //         console.log(color.bgRed.white(err))
    //     }
    // })

    req.session.save(err => {
        if (err) {
            throw err
        }
        res.redirect('/')
    })
    req.session.isAuthenticates = true

})

module.exports = router;