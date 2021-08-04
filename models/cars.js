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
    },
    description: String,
    yearsModel: String,
    productionModel: String
})

CarsSell.method('toClient', function () {
    const car = this.toObject()

    car.id = car._id
    delete car._id

    return car
})

module.exports = model('Cars', CarsSell)