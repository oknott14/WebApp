const jwt = require('jsonwebtoken');
const responses = require('../shared/http.responses');
const { getUserById } = require('../controllers/user.controller')
require('dotenv').config()

exports.verifyToken = function () {
    const message = "Invalid Token";
    return async function (req, res, next) {
        try {
            if (!req.headers.authorization) {
                throw Error("No authorization header sent");
            }

            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                throw Error("Auth token not passed");
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await getUserById(decoded.userId)
            /*if (decoded.exp < new Date().valueOf()) {
                throw Error("Token has expired");
            }*/
            
            next()
        } catch (err) {
            return res.status(401).json(responses.errorResponse(message, err.message, 0));
        }

    }
}


