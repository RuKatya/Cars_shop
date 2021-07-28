const { Schema, model } = require('mongoose')

const OrdersSchema = new Schema({
    cars: [
        {
            car: {
                type: Object,
                require: true
            },
            count: {
                type: Number,
                require: true
            }
        }
    ],
    user: {
        name: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            require: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Orders', OrdersSchema)