const { Schema, model } = require('mongoose')

const UsersSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    require: true,
                    default: 1
                },
                carId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Cars',
                    require: true
                }
            }
        ]
    }
})

UsersSchema.methods.addToCart = function (car) {
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.carId.toString() === car._id.toString() //to compare same type
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            carId: car._id,
            count: 1
        })
    }

    // const newCart = { items: items }
    // this.cart = newCart;

    this.cart = { items }

    return this.save();
}

module.exports = model('Users', UsersSchema)