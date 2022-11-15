const express = require('express');
const auth = require('../api/auth.api');
const userApi = require('../api/user.api'); 
const router = express.Router();



router.use(auth.verifyToken());
module.exports = router;