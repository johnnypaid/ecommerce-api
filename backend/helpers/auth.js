const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;


    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // {url: `/${api}/products`, methods: ['GET', 'OPTIONS']},
            // {url: `/${api}/category`, methods: ['GET', 'OPTIONS']},
            {url: `/\/api\/v1\/products(.*)`, methods: ['GET', 'OPTIONS']},
            {url: `/\/api\/v1\/category(.*)`, methods: ['GET', 'OPTIONS']},
            `/${api}/users/login`
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true);
    }

    done();
}

module.exports = authJwt;