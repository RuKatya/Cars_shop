const keys = require('../keys')
module.exports = function (mail) {
    return {
        to: mail,
        from: 'nodeshopkatya@gmail.com',
        subject: 'Account created',
        html: `
        <h1>Welcome to our shop</h1>
        <p>You created account with email - ${mail}</p>
        <hr/>
        <a href="${keys.BASE_URL}">Follow to the site</a>
        `
    }
}