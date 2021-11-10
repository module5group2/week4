const User = require("../models/user.model");
const createError = require('http-errors');
const jwt = require("jsonwebtoken")

module.exports.loadUser = (req, res, next) => {

    //Metodo cookie.................
    // if (req.session.userId) {

    //     User.findById(req.session.userId)
    //         .then(user => {
    //             if (user) {
    //                 req.user = user;
    //             }
    //             next()
    //         })
    //         .catch(next)
    // } else {
    //     next();
    // }


    // Metodo JWT por authorization header
    if (req.headers.authorization) {

        const token = req.headers.authorization.replace("Bearer ", "")

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {

            if (error) {
                next(createError(400, `Token error: ${error}`))
            } else {

                User.findById(decoded.sub)
                    .then(user => {
                        user ? req.user = user : next()
                        next()

                    }).catch(next)
            }
        })
    } else { next() }

}

module.exports.isAuthenticated = (req, res, next) => {

    req.user ? next() : next(createError(401, "Unauthorized"))

}