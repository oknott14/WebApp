const { response } = require("express")

//App Authentication
exports.errorResponse = function(message = "Bad Request", reason = undefined, from = 0) {
    return {success: false, msg: message, reason: reason, from: from}
}

exports.successResponse = function(data = "Ok", message = "Success") {
    return {success: true, msg: message, data: data}
}

exports.spotifyErrorResponse = function(message = "Spotify request failed", reason = undefined, authUrl = '', from = 1) {
    let resp = exports.errorResponse(message, reason, from)
    resp.authUrl = authUrl;
    return resp;
}