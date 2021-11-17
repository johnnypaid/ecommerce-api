const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    console.log(api);
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            {url: `/${api}/products`, methods: ['GET', 'OPTIONS']},
            `/${api}/users/login`
        ]
    })
}

module.exports = authJwt;