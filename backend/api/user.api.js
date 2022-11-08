const userController = require('../controllers/user.controller');
const responses = require('../shared/http.responses');

exports.createUser = function () {
    return async function(req, res) {
        console.log("Creating User")
        userController.createUser(req.body).then((user) => {
            return exports.login(req, res);
        }).catch(err => {
            res.status(400).json(responses.errorResponse("User Controller error", err));
        });
    }
}

exports.login = function () {
    return async function(req, res) {
        userController.login(req.body.email, req.body.password).then(resp => {
            return res.status(200).json(responses.successResponse(resp));
        }).catch(err => {
            console.log(err);
            return res.status(401).json(responses.errorResponse("Log in error", err));
        })
    }
}