const express = require('express');
const router = express.Router();

const serverName = "https://fibiapp.herokuapp.com/api/download/";

const LegalPolicies = require('../models/legalPolicies');
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

var upload2 = multer({storage:store}).single('policyName');

// var upload3 = multer({storage:store}).single('policyName');

// var upload4 = multer({storage:store}).single('policyName');

// var upload5 = multer({storage:store}).single('policyName');

// var upload6 = multer({storage:store}).single('policyName');

// var upload7 = multer({storage:store}).single('policyName');

// var upload8 = multer({storage:store}).single('policyName');

// var upload9 = multer({storage:store}).single('policyName');

// var upload10 = multer({storage:store}).single('policyName');

// var upload11 = multer({storage:store}).single('policyName');


router.post('/file-test-upload',function(req,res,next){
    upload1(req,res,function(err){
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // req.file.originalname = req.file.originalname.replace(/ /g, "");
        req.file.filename = req.file.filename.replace(/ /g, "");
        
        res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:serverName+req.file.filename })
    })
})


router.get('/download/:filename', function(req,res,next){
    // console.log(req.body.filename)
    filepath = path.join(__dirname,'../newFileUploads') +'/'+ req.params.filename;
    // res.json({path:filepath});
    // res.sendFile(filepath)
    res.download(filepath, req.params.filename);    
});


router.get('/post-policies',(req,res,next)=>{
    const db = getDb();     
                                                            
    const legalPolicies = new LegalPolicies(1,null,null,null,null,null,null,null,null,null,null,null,null);
    //saving in database

    return legalPolicies.save()
    .then(resultData=>{
        
        res.json({status:true,message:"Policies Registered",owner:resultData["ops"][0]});
        
    })
    .catch(err=>console.log(err));   

})

router.get('/get-all-policies',(req,res,next)=>{
    LegalPolicies.fetchAllPolicies()
    .then(legalData=>{
        res.json({status:true,policies:legalData})
    })
})


router.post('/edit-privacyPolicyClientOwnerEng',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.privacyPolicyClientOwnerEng = {policyName:"Privacy Policy Client & Business Side-English",filename:newClientImg,filepath:serverName+newClientImg};            
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



router.post('/edit-privacyPolicyClientOwnerEs',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.privacyPolicyClientOwnerEs =  {policyName:"Privacy Policy Client & Business Side-Spanish",filename:newClientImg,filepath:serverName+newClientImg};               
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



router.post('/edit-legalNoticeClientOwnerEng',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.legalNoticeClientOwnerEng =  {policyName:"Legal Notice Client & Business Side-English",filename:newClientImg,filepath:serverName+newClientImg};               
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



router.post('/edit-legalNoticeClientOwnerEs',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.legalNoticeClientOwnerEs =  {policyName:"Legal Notice Client & Business Side-Spanish",filename:newClientImg,filepath:serverName+newClientImg};               
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})


router.post('/edit-tcClientEng',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.tcClientEng =  {policyName:"Terms & Condition client side - English",filename:newClientImg,filepath:serverName+newClientImg};                 
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})


router.post('/edit-tcOwnerEng',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.tcOwnerEng =  {policyName:"Terms & Condition business side - English",filename:newClientImg,filepath:serverName+newClientImg};              
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



router.post('/edit-tcClientEs',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.tcClientEs =  {policyName:"Terms & Condition client side - Spanish",filename:newClientImg,filepath:serverName+newClientImg};               
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



router.post('/edit-tcOwnerEs',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.tcOwnerEs =  {policyName:"Terms & Condition business side - Spanish",filename:newClientImg,filepath:serverName+newClientImg};           
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



router.post('/edit-cookieClientOwnerEng',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.cookieClientOwnerEng =  {policyName:"Cookies Policy Client & Business Side-English",filename:newClientImg,filepath:serverName+newClientImg};           
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



router.post('/edit-cookieClientOwnerEs',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.cookieClientOwnerEs =  {policyName:"Cookies Policy Client & Business Side-Spanish",filename:newClientImg,filepath:serverName+newClientImg};           
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})


router.post('/edit-infoClientOwnerEng',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.infoClientOwnerEng =  {policyName:"Info Client & Business side - English",filename:newClientImg,filepath:serverName+newClientImg};           
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})


router.post('/edit-infoClientOwnerEs',(req,res,next)=>{
    // console.log(req)
 
    upload2(req,res,function(err){
           req.file.originalname = req.file.originalname.replace(/ /g, "");
    req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"https://fibiapp.herokuapp.com/api/download/"+req.file.filename })
        const id = +req.body.id;
        const newClientImg = req.file.filename;
      
        const db = getDb();
        LegalPolicies.findlegalPolicyById(+id)
        .then(legalDoc=>{        
            if(!legalDoc)
            {
                 res.json({ message:'Policy does not exist',status:false});
            }
            else{
    
                        
                legalDoc.infoClientOwnerEs =  {policyName:"Info Client & Business side - Spanish",filename:newClientImg,filepath:serverName+newClientImg};           
                          
               const db = getDb();
               db.collection('legalPolicies').updateOne({id:id},{$set:legalDoc})
                           .then(resultData=>{
                               
                               res.json({message:'Details Updated',status:true,legalPolicies:legalDoc});
                           })
                          .catch(err=>console.log(err));                                     
    
               }
            })          
    })
})



module.exports = router;

