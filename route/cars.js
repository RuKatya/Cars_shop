const { Router } = require('express')
const Cars = require('../models/cars')
const router = Router();

router.get('/', async (req, res) => {
    const cars = await Cars.find() //getAll cars
        .populate('userId') //show information about user
        .select('title') //show only fields that we want

    console.log(cars)

    res.render('cars', {
        title: "Cars",
        isCourses: true,
        cars
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const car = await Cars.findById(req.params.id)//getById(req.params.id)

    res.render('car-edit', {
        title: `Edit ${car.title}`,
        car
    })
})

router.post('/edit', async (req, res) => {
    const { id } = req.body
    delete req.body.id
    await Cars.findByIdAndUpdate(id, req.body) //id of car & where update
    res.redirect('/cars')
})

router.post('/remove', async (req, res) => {
    try {
        await Cars.deleteOne({
            _id: req.body.id
        })
        res.redirect('/cars')
    } catch (err) {
        console.log(color.bgRed.white(err))
    }
})

router.get('/:id', async (req, res) => {
    const car = await Cars.findById(req.params.id)
    res.render('car', {
        layout: 'empty',
        title: `Car ${car.title}`,
        car
    })
})

module.exports = router;