const { Router } = require('express')
const Cars = require('../models/cars')
const router = Router();

router.get('/', (req, res) => {
    res.render('cars/add', {
        title: "Add car",
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    console.log(req.body)
    const car = new Cars({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    });

    try {
        await car.save();
        res.redirect('/cars/cars') //sending user after button send to course page

    } catch (err) {
        console.log(color.bgRed.white(err))
    }
})

module.exports = router;