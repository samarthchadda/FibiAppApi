const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner');
const Owner = require('../models/owner');
const getDb = require('../util/database').getDB; 
const multer = require('multer');
const upload = multer();
const path = require('path')

var ImageKit = require("imagekit");
var fs = require('fs');

var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./newFileUploads');
    },
    filename:function(req,file,cb){
        var newOrignalName = file.originalname.replace(/ /g, "");
        cb(null,newOrignalName)
    }
})

var upload1 = multer({storage:store}).single('ownerPhoto');


router.post('/owner-login',ownerController.ownerLogin);

router.post('/owner-register',ownerController.ownerRegister);

router.get('/all-owners',ownerController.getOwners);

router.post('/create-customer-stripe',ownerController.createCustomer);

router.post('/create-product-stripe',ownerController.createProduct);

router.post('/create-price-stripe',ownerController.createPrice);

router.post('/create-subscription-stripe',ownerController.createSubscription);

router.post('/change-subscription-stripe',ownerController.changeSubscription);

router.post('/get-customers-stripe',ownerController.getCustomers);

router.get('/get-products-stripe',ownerController.getProducts);

router.post('/get-paymentLogs-stripe',ownerController.getPaymentLogs);

router.post('/cancel-subscription-stripe',ownerController.cancelSubscription);

router.post('/delete-product-stripe',ownerController.delProduct);


router.post('/check-owner',ownerController.ownerCheckPhone);

router.post('/check-owner-email',ownerController.ownerCheckEmail);

router.get('/get-owner/:ownerId',ownerController.ownerById);

router.post('/reset-owner-pwd',ownerController.ownerResetPwd);

router.post('/send-token',ownerController.sendToken);

router.post('/edit-owner',ownerController.editOwner);

router.get('/del-owner-pic/:ownerId',ownerController.delOwnerPhoto);

router.post('/edit-admin-owner',ownerController.editAdminOwner);

router.post('/edit-owner-token',ownerController.editOwnerToken);

router.get('/del-owner/:ownerId',ownerController.delOwner);

router.post('/owner-verify',ownerController.ownerVerify);


router.post('/edit-owner-photo',(req,res,next)=>{

    upload1(req,res,function(err){
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        req.file.originalname = req.file.originalname.replace(/ /g, "");
        req.file.filename = req.file.filename.replace(/ /g, "");
        
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
    
        const ownerId = +req.body.ownerId;

        // var imagekit = new ImageKit({
        //     publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
        //     privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
        //     urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
        // });
        
        // var base64Img = req.file.buffer;
     
    
        const db = getDb();
        Owner.findOwnerById(+ownerId)
        .then(empDoc=>{
            
            if(!empDoc)
            {
                 res.json({ message:'Owner does not exist',status:false});
            }
            else{              
                
              empDoc.ownerImg ="http://160.153.254.97:8000/api/download/"+req.file.filename;             
               
               const db = getDb();
               db.collection('owners').updateOne({ownerId:ownerId},{$set:empDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,imageUrl:"http://160.153.254.97:8000/api/download/"+req.file.filename});
                           })
                          .catch(err=>console.log(err));
        
    
               }
            })      
    
    
    })
    
   })



module.exports = router;

