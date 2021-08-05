const { Router } = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id })
            .populate('user.userId')

        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.cars.reduce((total, c) => {
                        return total += c.count * c.car.price
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e)
    }
})


router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.carId')
            .execPopulate()

        const cars = user.cart.items.map(i => ({
            count: i.count,
            car: { ...i.carId._doc }
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            cars: cars
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router