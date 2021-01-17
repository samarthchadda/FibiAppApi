const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report');
const Report = require('../models/report');

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');

// router.post('/post-report',reportController.postReportData);

router.get('/get-reports',reportController.getAllReports)


router.post('/post-report',upload.single('reportPhoto'),(req,res,next)=>{
    
    let name = req.body.name; 
    let email = req.body.email; 
    let phone = +req.body.phone;
    let description = req.body.description;  
    const reportDate = new Date().getTime();
   
    var imagekit = new ImageKit({
        publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
        privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer; 
    // console.log(req.file.mimetype);

    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file!=null) {
        imagekit.upload({
            file : base64Img, //required
            fileName : "reportImg.jpg"   //required
            
        }, function(error, result) {
            if(error) {console.log(error);}
            else {
                console.log(result.url);
                const db = getDb();     
    
                const report = new Report(name,email,phone,description,result.url,reportDate);
                //saving in database
                
                report.save()
                .then(resultData=>{
                    
                    res.json({status:true,message:"Report submitted",report:resultData["ops"][0]});
                    
                })
                .catch(err=>console.log(err));
                
                // res.json({message:'Image uploaded',status:true,imgUrl:result.url});          
  
                }
            });  
    }
    else{
        res.json({message:'Only JPEG/PNG images can be uploaded',status:false});         
    }

            

           
           
})



module.exports = router;
