const jwt = require('jsonwebtoken');
const errorResponse = require('../shared/http.responses').errorResponse;
require('dotenv').config()

exports.verifyToken = function () {
    const message = "Invalid Token";
    return async function (req, res, next) {
        try {
            if (!req.headers['x-access-token']) {
                throw Error("No authorization header sent");
            }

            const token = req.headers['x-access-token']

            if (!token) {
                throw Error("Auth token not passed");
            }

        
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            /*if (decoded.exp < new Date().valueOf()) {
                throw Error("Token has expired");
            }*/
            
            next()
        } catch (err) {
            return res.status(401).json(errorResponse(message, err.message, 401));
        }

    }
}