const { Schema, model } = require('mongoose')

const CarsSell = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
})

module.exports = model('Cars', CarsSell)