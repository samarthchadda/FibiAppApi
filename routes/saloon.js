const express = require('express');
const router = express.Router();
const saloonController = require('../controllers/saloon');
const Saloon = require('../models/saloon');

const multer = require('multer');

var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./newFileUploads');
    },
    filename:function(req,file,cb){
        var newOrignalName = file.originalname.replace(/ /g, "");
        cb(null,newOrignalName)
    }
})

var upload1 = multer({storage:store}).array('saloonPhotos',10);

router.get('/all-saloons',saloonController.getSaloons);

router.get('/all-saloons-month',saloonController.getSaloonsByMonth);

router.get('/all-saloons-limit/:limit/:start',saloonController.getLimitSaloons);

router.post('/saloon-register',saloonController.saloonRegister);


router.get('/all-saloons/:id',saloonController.saloonsByOwner);

router.get('/single-saloon/:id',saloonController.getSingleSaloon);

router.post('/all-near-saloons',saloonController.getDiffSaloon);


router.post('/saloon-verify',saloonController.phoneVerify);

router.post('/edit-saloon',saloonController.editSaloon);

router.get('/all-saloons-address',saloonController.getSaloonsAddress);

router.get('/all-saloons-address/:id',saloonController.getSingleSaloonAddress);

router.post('/del-saloon-photo',saloonController.delSaloonPhoto);

router.get('/del-saloon/:saloonId',saloonController.delSaloon);

router.get('/all-counts',saloonController.getCounts);


const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');



// router.post('/add-saloon-photos',upload.array('saloonPhotos',10),(req,res,next)=>{
router.post('/add-saloon-photos',(req,res,next)=>{

    upload1(req,res,function(err){
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
      
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
        
        const saloonId = +req.body.saloonId;
    
        let saloonImages = [];
    
        // var imagekit = new ImageKit({
        //     publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
        //     privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
        //     urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
        // });
                  
    
        Saloon.findSaloonBySaloonID(saloonId)
                    .then(saloon=>{
                        if(!saloon)
                        {
                            return res.json({ message:'Saloon Does not exist',status:false});
                        }
    
                        req.files.forEach(f => {
                            f.originalname = f.originalname.replace(/ /g, "");
                            f.filename = f.filename.replace(/ /g, "");
                            
                            // var base64Img = f.buffer;
                        // console.log(req.files);
                        
                        // imagekit.upload({
                        //     file : base64Img, //required
                        //     fileName : "saloonImg.jpg"   //required
                           
                        // }, function(error, result) {
                        //     if(error) {console.log(error);}
                        //     else {
                                // console.log(result.url);
                                saloonImages.push("http://160.153.254.97:8000/api/download/"+f.filename);
                                console.log(saloonImages);
                                saloon.saloonPhotos.push("http://160.153.254.97:8000/api/download/"+f.filename);
    
                                const db = getDb();
                                 db.collection('saloons').updateOne({saloonId:saloonId},{$set:saloon})
                                    .then(resultData=>{
                                        
                                    //  res.json({ message:'Photos Added',status:true, saloon:saloon});
                                        Saloon.findSaloonBySaloonID(saloonId)
                                        .then(saloon=>{
                                            if(!saloon)
                                            {
                                                return res.json({ message:'Saloon Does not exist',status:false});
                                            }
                                            
                                            
                                            res.json({ message:'Photos Added',status:true,imageUrl:saloon.saloonPhotos.slice(-1)[0]});
                                        })
                                    })
                                    .catch(err=>console.log(err));                           
                        //       }
                        //    }) 
                        })                  
                        
                    })
                    .catch(err=>console.log(err));             
                   
    })
   
});





module.exports = router;

