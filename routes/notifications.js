const express = require('express');
const router = express.Router();
const notiController = require('../controllers/notifications');


router.get('/all-client-notifications',notiController.getAllClientNotications);

router.get('/all-saloon-notifications',notiController.getAllSaloonNotications);

router.get('/all-client-notifications/:clientId',notiController.getSingleClientNotifications);

router.get('/all-saloon-notifications/:saloonId',notiController.getSingleSaloonNotifications);

router.post('/post-client-notification',notiController.postClientNotiData);

router.post('/post-saloon-notification',notiController.postSaloonNotiData);

router.get('/del-notification/:notificationId',notiController.delNotification);

router.post('/send-push-notification',notiController.sendPushNotification);


module.exports = router;

