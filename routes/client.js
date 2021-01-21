const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');

const Client = require('../models/client');
const path = require('path')

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

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

var upload1 = multer({storage:store}).single('file');

var upload2 = multer({storage:store}).single('clientImg');

router.post('/file-test-upload',function(req,res,next){
    upload1(req,res,function(err){
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // req.file.originalname = req.file.originalname.replace(/ /g, "");
        req.file.filename = req.file.filename.replace(/ /g, "");
        
        res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
    })
})

router.post('/add-privacy-policy',function(req,res,next){
    upload1(req,res,function(err){
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // req.file.originalname = req.file.originalname.replace(/ /g, "");
        req.file.filename = req.file.filename.replace(/ /g, "");
        
        res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
    })
})


router.get('/download/:filename', function(req,res,next){
    // console.log(req.body.filename)
    filepath = path.join(__dirname,'../newFileUploads') +'/'+ req.params.filename;
    // res.json({path:filepath});
    // res.sendFile(filepath)
    res.download(filepath, req.params.filename);    
});



router.post('/client-login',clientController.clientLogin);

router.get('/all-clients',clientController.getClients);

router.get('/all-clients-month',clientController.getClientsByMonth);

router.get('/all-clients/:id',clientController.getSingleClient);

router.post('/edit-client-details',clientController.editClientDetails);

router.get('/del-client/:clientId',clientController.delClient);

router.post('/edit-client-email',clientController.editClientEmail);

router.post('/edit-client-name',clientController.editClientName);

router.post('/edit-client-phone',clientController.editClientPhone);

router.post('/edit-client-token',clientController.editClientToken);

router.post('/edit-client-password',clientController.clientResetPwd);

router.post('/check-client-email',clientController.clientCheckEmail);

router.post('/check-client-phone',clientController.clientCheckPhone);

router.post('/client-fav-saloon',clientController.clientFavSaloon);

router.get('/all-fav-saloons/:clientId',clientController.getFavSaloons);


// router.post('/client-register',upload.single('clientImg'),(req,res,next)=>{
router.post('/client-register',function(req,res,next){
    upload2(req,res,function(err){
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        let clientID;
        const clientName = req.body.clientName;
        const phone = +req.body.phone;
        const email = req.body.email;    
        const password = req.body.password;
        const deviceToken = req.body.deviceToken;
        const imgUrl = req.body.imgUrl;
        const regDate = new Date().getTime();
        req.file.originalname = req.file.originalname.replace(/ /g, "");
        req.file.filename = req.file.filename.replace(/ /g, "");
        const imgName = req.file.filename
    // console.log(req.file.filename)
           // adding auto-generated id
           let newVal;
           const db = getDb();   
        if(imgUrl==null|| imgUrl=="")
        {
       
        
       
        db.collection('clientCounter').find().toArray().then(data=>{
            
            newVal = data[data.length-1].count;
           
            newVal = newVal + 1;
            console.log(newVal);
           
            clientID = newVal;
            
            db.collection('clientCounter').insertOne({count:newVal})
                    .then(result=>{
    
                   Client.findClientByEmail(email)
                    .then(client=>{
                        if(client){                        
                            return res.json({status:false, message:'Client already exists(Enter unique email)'});
                        }
    
                        Client.findClientByPhone(phone)
                        .then(client=>{
                            if(client){                        
                                return res.json({status:false, message:'Client already exists(Enter unique phone)'});
                            }
                            
                          
                                    console.log(result.url);
                        
                                    const db = getDb();
                                    console.log(regDate);
                                    // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
                                    
                                    const newclient = new Client(clientID,clientName,phone,email,password,"http://160.153.254.97:8000/api/download/"+imgName,deviceToken,regDate);
    
                                    //saving in database                        
                                    newclient.save()
                                    .then(resultData=>{
                                        
                                        res.json({status:true,message:"Client Added",data:resultData["ops"][0]});
                                        
                                    })
                                    .catch(err=>{
                                        res.json({status:false,message:"Client not added"});
                                        
                                    });                
                                
                            
                        })
    
                    }).catch(err=>console.log("Error Occured"));                
                                       
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,error:err})
                    })             
         })
        }
        else{
            db.collection('clientCounter').find().toArray().then(data=>{
            
                newVal = data[data.length-1].count;
               
                newVal = newVal + 1;
                console.log(newVal);
               
                clientID = newVal;
                
                db.collection('clientCounter').insertOne({count:newVal})
                        .then(result=>{
        
                       Client.findClientByEmail(email)
                        .then(client=>{
                            if(client){                        
                                return res.json({status:false, message:'Client already exists(Enter unique email)'});
                            }
        
                            Client.findClientByPhone(phone)
                            .then(client=>{
                                if(client){                        
                                    return res.json({status:false, message:'Client already exists(Enter unique phone)'});
                                }
                               
                               
                                        // console.log(result.url);
                            
                                        const db = getDb();
                                        console.log(imgUrl);
                                        client = new Client(clientID,clientName,phone,email,password,imgUrl,deviceToken,regDate);
        
                                        //saving in database                        
                                        client.save()
                                        .then(resultData=>{
                                            res.json({status:true,message:"Client Added",data:resultData["ops"][0]});
                                            
                                        })
                                        .catch(err=>{
                                            res.json({status:false,message:"Client not added"});
                                            
                                        });                
                                    
                                
                            })
        
                        }).catch(err=>console.log(err));                
                                           
                        })
                        .then(resultData=>{
                           
                        })
                        .catch(err=>{
                            res.json({status:false,error:err})
                        })             
             }) 
        }
    
    })
  
});


router.post('/edit-client-image',(req,res,next)=>{
    console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
        const clientId = +req.body.clientId;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        Client.findClientByClientId(JSON.parse(+clientId))
        .then(clientDoc=>{        
            if(!clientDoc)
            {
                 res.json({ message:'Client does not exist',status:false});
            }
            else{
    
                        
              clientDoc.clientImg = "http://160.153.254.97:8000/api/download/"+newClientImg;            
                          
               const db = getDb();
               db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,client:clientDoc});
                           })
                          .catch(err=>console.log(err));  
                    
                 
    
               }
            })      
    
    })
   })





module.exports = router;

