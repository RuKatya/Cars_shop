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
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Cars',
                    require: true
                }
            }
        ]
    }
})

module.exports = model('Users', UsersSchema)