const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');


router.get('/all-services',servicesController.getAllServices);

router.get('/all-services/:serviceId',servicesController.getSingleService);

router.get('/all-saloon-services/:saloonId',servicesController.getSaloonServices);

router.post('/post-service',servicesController.postServiceData);

router.post('/edit-service',servicesController.editService);

router.get('/del-service/:serviceId',servicesController.delService);



module.exports = router;

