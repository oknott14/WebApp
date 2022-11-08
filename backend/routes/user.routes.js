const express = require('express');
const userApi = require('../api/user.api'); 
const router = express.Router();

router.post('create', userApi.createUser());