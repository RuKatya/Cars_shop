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
    const clonedItems = [...this.cart.items]
    const idx = clonedItems.findIndex(c => {
        return c.courseId.toString() === car._id.toString()
    })

    if (idx >= 0) {
        clonedItems[idx].count = this.cart.items[idx].count + 1
    } else {
        clonedItems.push({
            carId: cars._id,
            count: 1
        })
    }

    const newCart = { items: clonedItems }

    this.cart = newCart;
}

module.exports = model('Users', UsersSchema)