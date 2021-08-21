const { Router } = require('express')
const Cars = require('../models/cars')
const auth = require('../middleware/auth')
const router = Router();

function isOwner(car, req) {
    return car.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
    try {
        const cars = await Cars.find() //getAll cars
        // .populate('userId', 'email name') //show information about user, in second req we can get the fields that we want from users
        // .select('title') //show only fields that we want

        console.log(cars)

        res.render('cars/cars', {
            title: "Cars",
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            cars
        })
    } catch (err) {
        console.log(color.bgRed.white(err))
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const car = await Cars.findById(req.params.id)//getById(req.params.id)
        if (isOwner(car, req)) {
            return res.redirect('/cars')
        }

        res.render('cars/car-edit', {
            title: `Edit ${car.title}`,
            car
        })
    } catch (err) {
        console.log(color.bgRed.white(err))
    }
})

router.post('/edit', auth, async (req, res) => {
    const { id } = req.body
    delete req.body.id
    await Cars.findByIdAndUpdate(id, req.body) //id of car & where update
    res.redirect('/cars/cars')
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Cars.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/cars')
    } catch (err) {
        console.log(color.bgRed.white(err))
    }
})

router.get('/:id', async (req, res) => {
    try {
        const car = await Cars.findById(req.params.id)
        res.render('cars/car', {
            layout: 'empty',
            title: `Car ${car.title}`,
            car
        })
    } catch (err) {
        console.log(color.bgRed.white(err))
    }

})

module.exports = router;