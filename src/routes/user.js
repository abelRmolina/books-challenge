const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/register', userController.register);
router.post('/register', userController.processRegister);
router.get('/login', userController.login);
router.post('/login', userController.processLogin);
router.delete('/logout', userController.logout);

module.exports = router;