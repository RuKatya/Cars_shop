const { Router } = require('express')
const Cars = require('../models/cars')
const router = Router();

router.get('/', async (req, res) => {
    const cars = await Cars.find()
    res.render('index', {
        title: 'Main page',
        isHome: true,
        cars

    })
})

module.exports = router;