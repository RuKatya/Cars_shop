const { Router } = require('express')
const Cars = require('../models/cars')
const router = Router();

router.get('/', async (req, res) => {
    res.json({ test: true })
})

router.post('/add', async (req, res) => {
    const car = await Cars.findById(req.body.id)
    await req.user.addToCart(car)
    res.redirect('/cart')
})

module.exports = router;

