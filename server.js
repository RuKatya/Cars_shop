//EXPRESS
const express = require('express');
//BODYPARSER
var bodyParser = require('body-parser')
//PATH
const path = require('path')
//COLORS
const color = require('colors')
//PORT
const PORT = process.env.PORT ?? 5000; //connect to port 5000
//MONGOOSE
const mongoose = require('mongoose')
//USER
const Users = require('./models/user')
//SESSION
const session = require('express-session')

const app = express(); //express
app.use(bodyParser.urlencoded({ extended: false })) //bodyParser
app.use(express.static(path.resolve(__dirname, 'public'))) //static

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false
}))

//EJS
app.set('view engine', 'ejs') //connecting ejs
console.log(app.get('view engine'))
app.set('views', path.resolve(__dirname, 'ejs'))

const dataPass = 'WO3sm2Hl7eXTMN0Y'; //mongoose
const url = `mongodb+srv://KaKa:${dataPass}@cluster0.mfqlq.mongodb.net/shop`;

//user
app.use(async (req, res, next) => {
    try {
        const user = await Users.findById('60fde6f04306ab2288739bb0')
        req.user = user
        next()
    } catch (err) {
        console.log(color.bgRed.white(err))
    }
})

//Connecting to data
start();

async function start() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false
        }, () => {
            console.log(color.bgGreen.black(`DATA CONNECTED`))
        })
        const candidate = await Users.findOne()
        if (!candidate) {
            const user = new Users({
                email: 'katyaru1@gmail.com',
                name: 'Katya',
                cart: { items: [] }
            })
            await user.save()
        }
    } catch (err) {
        console.log(color.bgRed.white(err))
    }
}

//ROUTE
const indexRoute = require('./route/index');
const carsRoute = require('./route/cars');
const addRoute = require('./route/addcar');
const cartRoute = require('./route/cart');
const ordersRoute = require('./route/orders');
const authRoute = require('./route/auth');

app.use('/', indexRoute);
app.use('/cars', carsRoute);
app.use('/addcar', addRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoute);
app.use('/login', authRoute);



//LISTENING
try {
    app.listen(PORT, () => {
        console.log(color.bgBlue.black(`Server listen on`, color.bgBlue.white(`http://localhost:${PORT}`)))
    })
} catch (err) {
    console.log(color.bgRed.black(err))
}
