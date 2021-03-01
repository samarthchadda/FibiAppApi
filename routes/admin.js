const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.post('/admin-login',adminController.adminLogin);

router.post('/admin-register',adminController.adminRegister);

router.post('/admin-send-token',adminController.sendToken);

router.post('/admin-forgot-pwd',adminController.adminForgotPassword);


module.exports = router;

