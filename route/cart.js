const { Router } = require('express')
const Cars = require('../models/cars')
const router = Router();

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.carId._doc,
        id: c.carId.id,
        count: c.count
    }))
}

function computePrice(cars) {
    return cars.reduce((total, car) => {
        return total += car.price * car.count
    }, 0)
}

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.carId')
        .execPopulate()

    const cars = mapCartItems(user.cart)

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        cars: cars,
        price: computePrice(cars)
    })
})

router.post('/add', async (req, res) => {
    const car = await Cars.findById(req.body.id)
    await req.user.addToCart(car)
    res.redirect('/cart')
})

router.delete('/remove/:id', async (req, res) => {
    console.log('remove?')
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.carId').execPopulate()
    const cars = mapCartItems(user.cart)
    const cart = {
        cars, price: computePrice(cars)
    }

    res.status(200).json(cart)
})

module.exports = router;

