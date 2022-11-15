const userController = require('../controllers/user.controller');
const responses = require('../shared/http.responses');

exports.createUser = function () {
    const message = (msg) => `Creating user ${msg}`;
    return async function(req, res, next) {
        console.log(message("started"))
        userController.createUser(req.body).then((user) => {
            console.log(message("succeded"))
            next();
        }).catch(err => {
            console.log(message("failed"))
            res.status(400).json(responses.errorResponse("User Controller error", err));
        });
    }
}


exports.login = function() {
    const message = (msg) => `Loggin in ${msg}`
    return async function(req, res, next) {
        console.log(message(''));
        return userController.login(req.body.email, req.body.password).then((resp) => {
            console.log(message('succeded'))
            req.user = resp.user;
            req.token = resp.token;
            next();
        }).catch((err) => {
            console.log(message('failed'));
            return res.status(404).json(responses.errorResponse(message("failed"), err, 0));
        })
    }
}
