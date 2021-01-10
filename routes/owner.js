const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner');
const Owner = require('../models/owner');
const getDb = require('../util/database').getDB; 
const multer = require('multer');
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');


router.post('/owner-login',ownerController.ownerLogin);

router.post('/owner-register',ownerController.ownerRegister);

router.get('/all-owners',ownerController.getOwners);

router.post('/create-customer-stripe',ownerController.createCustomer);

router.post('/create-product-stripe',ownerController.createProduct);

router.post('/create-price-stripe',ownerController.createPrice);

router.post('/create-subscription-stripe',ownerController.createSubscription);

router.post('/get-customers-stripe',ownerController.getCustomers);

router.get('/get-products-stripe',ownerController.getProducts);

router.post('/get-paymentLogs-stripe',ownerController.getPaymentLogs);


router.post('/check-owner',ownerController.ownerCheckPhone);

router.post('/check-owner-email',ownerController.ownerCheckEmail);

router.get('/get-owner/:ownerId',ownerController.ownerById);

router.post('/reset-owner-pwd',ownerController.ownerResetPwd);

router.post('/send-token',ownerController.sendToken);

router.post('/edit-owner',ownerController.editOwner);

router.post('/edit-admin-owner',ownerController.editAdminOwner);

router.post('/edit-owner-token',ownerController.editOwnerToken);

router.get('/del-owner/:ownerId',ownerController.delOwner);

router.post('/owner-verify',ownerController.ownerVerify);


router.post('/edit-owner-photo',upload.single('ownerPhoto'),(req,res,next)=>{
    
    const ownerId = +req.body.ownerId;

    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;
 

    const db = getDb();
    Owner.findOwnerById(+ownerId)
    .then(empDoc=>{
        
        if(!empDoc)
        {
             res.json({ message:'Owner does not exist',status:false});
        }
        else{

        imagekit.upload({
            file : base64Img, //required
            fileName : "ownerImg.jpg"   //required
            
        }, function(error, result) {
            if(error) {console.log(error);}
            else {
                console.log(result.url);                    
            
          empDoc.ownerImg = result.url;             
           
           const db = getDb();
           db.collection('owners').updateOne({ownerId:ownerId},{$set:empDoc})
                       .then(resultData=>{
                           
                           res.json({message:'Details Updated',status:true,imageUrl:result.url});
                       })
                      .catch(err=>console.log(err));
  
                }
            });      

           }
        })      
})



module.exports = router;

