const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');
const Employee = require('../models/employee');
const Saloon = require('../models/saloon');


router.get('/all-employees',employeeController.getAllEmployees);

router.get('/all-employees/:empId',employeeController.getSingleEmployee);

router.get('/all-saloon-employees/:saloonId',employeeController.getSaloonEmployees);

router.get('/del-employee/:empId',employeeController.delEmployee);


const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');


router.post('/post-employee',upload.single('empPhoto'),(req,res,next)=>{
    let empID;
    const saloonId = +req.body.saloonId;
    const empNm = req.body.empNm;
    const empType = req.body.empType;
    const empServices = req.body.empServices;


    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;


    // adding auto-generated id
    let newVal;
    const db = getDb();     
    db.collection('empCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        empID = newVal;
        
        db.collection('empCounter').insertOne({count:newVal})
                .then(result=>{

                Saloon.findSaloonBySaloonID(saloonId)
                .then(saloon=>{
                    if(!saloon){                        
                        return res.json({status:false, message:'Saloon does not exist'});
                    }

                    imagekit.upload({
                        file : base64Img, //required
                        fileName : "empImg.jpg"   //required
                       
                    }, function(error, result) {
                        if(error) {console.log(error);}
                        else {
                            console.log(result.url);
                
                             const db = getDb();
                
                            const employee = new Employee(empID,saloonId,empNm,empType,result.url,empServices);
                            //saving in database
                        
                            employee.save()
                            .then(resultData=>{
                                
                                res.json({status:true,message:"Employee Added",data:resultData["ops"][0]});
                                
                            })
                            .catch(err=>{
                                res.json({status:false,message:"Employee not added"});
                                
                            });                
                        }
                    })
                }).catch(err=>console.log(err));                
                                   
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })
});



router.post('/edit-employee',upload.single('empPhoto'),(req,res,next)=>{
    
    const empId = +req.body.empId;
    const empNm = req.body.empNm;
    const empType = req.body.empType;
    const empServices = req.body.empServices;


    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;
 

    const db = getDb();
    Employee.findEmployeeByEmpID(+empId)
    .then(empDoc=>{
        
        if(!empDoc)
        {
             res.json({ message:'Employee does not exist',status:false});
        }
        else{

        imagekit.upload({
            file : base64Img, //required
            fileName : "empImg.jpg"   //required
            
        }, function(error, result) {
            if(error) {console.log(error);}
            else {
                console.log(result.url);
                    
            
          empDoc.empName = empNm;   
          empDoc.empType = empType;   
          empDoc.empServices = empServices;              
          empDoc.empImg = result.url;            
           
           
           const db = getDb();
           db.collection('employees').updateOne({empId:empId},{$set:empDoc})
                       .then(resultData=>{
                           
                           res.json({message:'Details Updated',status:true});
                       })
                      .catch(err=>console.log(err));
  
                }
            });      

           }
        })      
})






module.exports = router;

