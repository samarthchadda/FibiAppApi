const Report = require('../models/report');
const getDb = require('../util/database').getDB; 


exports.getAllReports=(req,res,next)=>{
  
    Report.fetchAllReports()
                .then(owners=>{
                   
                    res.json({message:"All Data returned",allReports:owners})

                })
                .catch(err=>console.log(err));
}

exports.postReportData = (req,res,next)=>{
   
    let name = req.body.name; 
    let email = req.body.email; 
    let phone = +req.body.phone;
    let description = req.body.description;    
    let screenShot = req.body.screenShot;
    let reporterType = req.body.reporterType;    
    const reportDate = new Date().getTime();

    const db = getDb();     
    
    const report = new Report(name,email,phone,description,screenShot,reportDate,reporterType);
    //saving in database
    
    report.save()
    .then(resultData=>{
        
        res.json({status:true,message:"Report submitted",service:resultData["ops"][0]});
        
    })
    .catch(err=>console.log(err));                          
                   
}
