const { response } = require("express")

//App Authentication
exports.errorResponse = function(message = "Bad Request", reason = undefined, from = 0, data) {
    return {success: false, msg: message, reason: reason, from: from}
}

exports.successResponse = function(data = {}, message = "Success") {
    return {success: true, msg: message, data: data}
}