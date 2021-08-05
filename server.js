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
//MONGO-SESSION
const MongoStore = require('connect-mongodb-session')(session)
//MIDDLEWARE
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user')

const app = express(); //express
app.use(bodyParser.urlencoded({ extended: false })) //bodyParser
app.use(express.static(path.resolve(__dirname, 'public'))) //static

const dataPass = 'WO3sm2Hl7eXTMN0Y'; //mongoose
const MONGODB_URI = `mongodb+srv://KaKa:${dataPass}@cluster0.mfqlq.mongodb.net/shop`;

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.use(session({ //session
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

//Middleware
app.use(varMiddleware)
app.use(userMiddleware)

//EJS
app.set('view engine', 'ejs') //connecting ejs
console.log(app.get('view engine'))
app.set('views', path.resolve(__dirname, 'ejs'))

//Connecting to data
start();

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false
        }, () => {
            console.log(color.bgGreen.black(`DATA CONNECTED`))
        })
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
app.use('/auth', authRoute);

//LISTENING
try {
    app.listen(PORT, () => {
        console.log(color.bgBlue.black(`Server listen on`, color.bgBlue.white(`http://localhost:${PORT}`)))
    })
} catch (err) {
    console.log(color.bgRed.black(err))
}
