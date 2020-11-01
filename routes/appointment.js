const express = require('express');
const router = express.Router();
const appointController = require('../controllers/appointment');


router.get('/all-appointments',appointController.getAllAppointments);

router.get('/all-appointments/:id',appointController.getSingleAppointment);

router.post('/post-appointment',appointController.postAppointment);

router.post('/saloon-appointment',appointController.getAppointBySaloonAndBdate);

router.post('/check-appointment',appointController.getAppointByEmpIdDate);


router.post('/appoint-revenue-day',appointController.getDayRevenuePerSaloon);

router.post('/appoint-revenue-week',appointController.getWeekRevenuePerSaloon);

router.post('/appoint-revenue-month',appointController.getMonthRevenuePerSaloon);

router.post('/appoint-graph-month',appointController.getMonthGraphPerSaloon);


router.post('/emp-appoint-revenue-day',appointController.getDayRevenuePerEmp);

router.post('/emp-appoint-revenue-week',appointController.getWeekRevenuePerEmp);

router.post('/emp-appoint-revenue-month',appointController.getMonthRevenuePerEmp);

router.post('/emp-appoint-graph-month',appointController.getMonthGraphPerEmp);


router.post('/edit-appointment',appointController.editAppointment);

router.get('/del-appointment/:appointId',appointController.delAppointment);



module.exports = router;

