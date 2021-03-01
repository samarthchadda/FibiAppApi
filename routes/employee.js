const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');
const Employee = require('../models/employee');
const Saloon = require('../models/saloon');
const Service = require('../models/services');
const path = require('path')

router.get('/all-employees',employeeController.getAllEmployees);

router.get('/all-employees/:empId',employeeController.getSingleEmployee);

router.get('/all-saloon-employees/:saloonId',employeeController.getSaloonEmployees);

router.get('/del-employee/:empId',employeeController.delEmployee);

router.post('/edit-emp-credentials',employeeController.empCredentials);

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

var upload1 = multer({storage:store}).single('empPhoto');



router.post('/post-employee',(req,res,next)=>{
    upload1(req,res,function(err){
        req.file.originalname = req.file.originalname.replace(/ /g, "");
        req.file.filename = req.file.filename.replace(/ /g, "");
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
        let empID;
        const saloonId = +req.body.saloonId;
        const empNm = req.body.empNm;
        const empType = req.body.empType;
        let services = [];
        let empServicesId = req.body.empServicesId;
        empServicesId = empServicesId.split(',');
        empServicesId = empServicesId.map(emp=>emp.trim())
        console.log(empServicesId);
        var newImg = req.file.filename;
      
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
                    
                                 const db = getDb();
                    
                                const employee = new Employee(empID,saloonId,empNm,empType,"http://160.153.254.97:8000/api/download/"+newImg,empServicesId,null,null);
                                //saving in database
                            
                                employee.save()
                                .then(resultData=>{
                                    let services = [];
                                    // console.log(resultData["ops"][0].empServices);
                                    resultData["ops"][0].empServices.forEach(empServ=>{
                                        Service.findServiceByServiceID(+empServ)
                                                    .then(resServData=>{
                                                        if(!resServData)
                                                        {
                                                            return res.json({status:false, message:"Enter valid services"})
                                                        }
                                                        if(resServData){
                                                            services.push(resServData)
                                                            console.log(services);
                                                            console.log(resultData["ops"][0].empServices.length);
                                                            
                                                            
                                                            if(resultData["ops"][0].empServices.length == services.length)
                                                            {
                                                                resultData["ops"][0].empServices = services;
                                                                res.json({status:true,message:"Employee Added",data:resultData["ops"][0]});
                                                            }   
                                                       }
                                                    })
                                                  
                                    })
                                                   
                                    
                                })
                                .catch(err=>{
                                    res.json({status:false,message:"Employee not added"});
                                    
                                });                
                            
                        
                    }).catch(err=>console.log(err));                
                                       
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,error:err})
                    })             
         })
    })

   
});



router.post('/edit-employee',(req,res,next)=>{
    upload1(req,res,function(err){
   
        if(err)
        {
            return res.json({message:"Error Occured",error:err})
        }
        // res.json({orignalName:req.file.originalname,uploadName:req.file.filename,path:"http://160.153.254.97:8000/api/download/"+req.file.filename })
        
        const empId = +req.body.empId;
        const empNm = req.body.empNm;
        const empType = req.body.empType;
        const empUrl = req.body.empUrl;    
        let services = [];
        let empServicesId = req.body.empServicesId;
        empServicesId = empServicesId.split(',');
        empServicesId = empServicesId.map(emp=>emp.trim())
        console.log(empServicesId);
    
        if(empUrl==null||empUrl=="")
        {
            req.file.originalname = req.file.originalname.replace(/ /g, "");
            req.file.filename = req.file.filename.replace(/ /g, "");
                        
        const db = getDb();
        Employee.findEmployeeByEmpID(+empId)
        .then(empDoc=>{
            
            if(!empDoc)
            {
                 res.json({ message:'Employee does not exist',status:false});
            }
            else{    
                
              empDoc.empName = empNm;   
              empDoc.empType = empType;   
              empDoc.empServices = empServicesId;              
              empDoc.empImg = "http://160.153.254.97:8000/api/download/"+req.file.filename;                           
               
               const db = getDb();
               db.collection('employees').updateOne({empId:empId},{$set:empDoc})
                           .then(resultData=>{
                            let services = [];
                            // console.log(resultData["ops"][0].empServices);
                            empDoc.empServices.forEach(empServ=>{
                                Service.findServiceByServiceID(+empServ)
                                            .then(resServData=>{
                                                if(resServData){
                                                    services.push(resServData)
                                                    console.log(services);
                                                    console.log(empDoc.empServices.length)
                                                    
                                                    if(empDoc.empServices.length == services.length)
                                                    {
                                                        empDoc.empServices = services;
                                                        res.json({message:'Details Updated',status:true,employee:empDoc});
                                                    }   
                                               }
                                            })
                                          
                            })
                                    
                               
                              
                           })
                          .catch(err=>console.log(err));
                         
               
    
               }
            })   
        }
        else{
            
       
        const db = getDb();
        Employee.findEmployeeByEmpID(+empId)
        .then(empDoc=>{
            
            if(!empDoc)
            {
                 res.json({ message:'Employee does not exist',status:false});
            }
            else{   
                            
              empDoc.empName = empNm;   
              empDoc.empType = empType;   
              empDoc.empServices = empServicesId;              
              empDoc.empImg = empUrl;            
               
               
               const db = getDb();
               db.collection('employees').updateOne({empId:empId},{$set:empDoc})
                           .then(resultData=>{
                            let services = [];
                            // console.log(resultData["ops"][0].empServices);
                            empDoc.empServices.forEach(empServ=>{
                                Service.findServiceByServiceID(+empServ)
                                            .then(resServData=>{
                                                if(resServData){
                                                    services.push(resServData)
                                                    console.log(services);
                                                    console.log(empDoc.empServices.length)
                                                    
                                                    if(empDoc.empServices.length == services.length)
                                                    {
                                                        empDoc.empServices = services;
                                                        res.json({message:'Details Updated',status:true,employee:empDoc});
                                                    }   
                                               }
                                            })
                                          
                            })
                                 
                              
                              
                           })
                          .catch(err=>console.log(err));        
    
               }
            })   
        }
    
    })
      
})






module.exports = router;

