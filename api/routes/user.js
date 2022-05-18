const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.post('/register', UserController.apiCreateUser );
router.post('/login', UserController.apiLoginUser );


module.exports = router;