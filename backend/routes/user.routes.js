const express = require('express');
const auth = require('../api/auth.api');
const userApi = require('../api/user.api'); 
const router = express.Router();

router.post('/login', userApi.login());
router.post('/create', userApi.createUser());

router.use(auth.verifyToken());
module.exports = router;