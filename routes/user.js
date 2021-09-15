const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController.js');
const auth = require('../middlewares/middlewares');

// create user
router.post('/', userCtrl.createUser);

//login
router.post('/login', userCtrl.login);

module.exports = router;