const express = require('express');
const userApi = require('../api/user.api');
const { initSpotify } = require('../api/spotify.api');
const responses = require('../shared/http.responses');
const router = express.Router();

router.post('/user/create', userApi.createUser(), userApi.login(), (req, res, next) => {
    res.status(200).json(responses.successResponse({token: req.token, id: req.user._id}, "Account created and logged in"));
});
router.post('/user/login', userApi.login(), initSpotify(), (req, res, next) => {
    console.log("Fully logged in")
    res.status(200).json(responses.successResponse({token: req.token, id: req.user._id}, "Logged in"));
})

module.exports = router;