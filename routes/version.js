const express = require('express');
const router = express.Router();
const Version = require('../models/version');


router.get('/get-app-version',(req,res,next)=>{

    Version.fetchAppVersion()
    .then(versionData=>{

        res.json({status:true,version:versionData});

    })
    .catch(err=>{
        res.json({status:false,err:err});
    })

});

module.exports = router;

