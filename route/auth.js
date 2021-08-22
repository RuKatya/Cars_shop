const { Router } = require('express')
const bcrypt = require('bcryptjs')
const Users = require('../models/user')
const router = Router();
const color = require('colors')

//keys
const keys = require('../keys')

//nodemailer
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')

//crypto
const crypto = require('crypto')

//validator
const {body, validationResult} = require('express-validator/check')

const tranporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRIP_API_KEY }
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        registError: req.flash('registError'),
        loginError: req.flash('loginError')
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
                req.flash('loginError', 'Wrong password')
                res.redirect('/auth/login')
            }
        } else {
            req.flash('loginError', 'User not exist')
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.log(color.bgRed.black(err))
    }

})

router.post('/register', body('email').isEmail(), async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body
        const candidate = await Users.findOne({ email })

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            req.flash('registError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login')
        }

        if (candidate) {
            req.flash('registError', 'User exist')
            res.redirect('/auth/login')
        } else {
            const hashpassword = await bcrypt.hash(password, 10)
            const user = new Users({
                email, name, password: hashpassword, cart: { items: [] }
            })
            await user.save()
            await tranporter.sendMail(regEmail(email))
            res.redirect('/auth/login')

        }
    } catch (err) {
        console.log(color.bgRed.black(err))
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: "forgot password",
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'something get wrong, try again letter')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await Users.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await tranporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (err) {
        console.log(color.bgRed.black(err))
    }
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await Users.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() }
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
    } catch (e) {
        console.log(e)
    }

})

router.post('/password', async (req, res) => {

    try {
        const user = await Users.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() }
        })
        console.log(user)

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время жизни токена истекло')
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;