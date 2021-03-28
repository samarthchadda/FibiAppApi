const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');


router.get('/all-payments',paymentController.getAllPayments);

router.get('/all-payments/:paymentId',paymentController.getSinglePayment);

router.post('/post-payment-status',paymentController.postPaymentStatus);

router.post('/edit-payment-status',paymentController.editPaymentStatus);



module.exports = router;