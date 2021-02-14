const Service = require('../models/services');
const Saloon = require('../models/saloon');
const Employee = require('../models/employee');
const getDb = require('../util/database').getDB; 


exports.postServiceData = (req,res,next)=>{

    // const services = req.body.services;

    // services.forEach(service=>{

    // })
      
    let serviceId;
    //parsing data from incoming request
    let saloonId = +req.body.saloonId;   
    let serviceNm = req.body.serviceNm; 
    let description = req.body.description;
    let cost = +req.body.cost;    
    let time = req.body.time;    

    let newVal;
    const db = getDb();     
    db.collection('serviceCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        serviceId = newVal;
        
        db.collection('serviceCounter').insertOne({count:newVal})
                .then(result=>{

                    Saloon.findSaloonBySaloonID(saloonId)
                    .then(saloon=>{
                        if(!saloon){                        
                            return res.json({status:false, message:'Saloon does not exist'});
                        }

                        const service = new Service(serviceId,saloonId,serviceNm,cost,time,description);
                        //saving in database
                       
                        return service.save()
                        .then(resultData=>{
                            
                            res.json({status:true,message:"Service Added",service:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));     

                    }).catch(err=>console.log(err));

                                 
                  
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })   

     
   
}


exports.getAllServices=(req,res,next)=>{
    
    Service.fetchAllServices()
                .then(services=>{
                   
                    res.json({message:"All Data returned",services:services})

                })
                .catch(err=>console.log(err));

}




exports.getSingleService=(req,res,next)=>{
  
    const serviceId = req.params.serviceId;
   
    Service.findServiceByServiceID(JSON.parse(serviceId))
    .then(serviceDoc=>{
       
        if(serviceDoc){
           
             res.json({status:true, data:serviceDoc});
        }
        else{
            res.json({status:false,message:"No such service exist"});
        }          

    })    
}



exports.getSaloonServices=(req,res,next)=>{

    const saloonId = req.params.saloonId;

    Service.findServicesBySaloonID(JSON.parse(saloonId))
                    .then(services=>{
                        if(services.length==0)
                        {
                            return res.json({ message:'Service does not exist',data:services});
                        }

                        res.json({message:"All Services returned",data:services});
                    })

}



exports.editService=(req,res,next)=>{
    //parsing data from incoming request
    const serviceId = +req.body.serviceId;
    const name = req.body.name;
    const description = req.body.description;
    const cost = req.body.cost;    
    const time = req.body.time;       
   
    Service.findServiceByServiceID(serviceId)
             .then(serviceDoc=>{
                 if(!serviceDoc)
                 {
                     return res.json({ message:'Service does not exist',status:false});
                 }
                
                 serviceDoc.serviceName = name;
                 serviceDoc.description = description;
                 serviceDoc.cost = cost;
                 serviceDoc.time = time;
                 
                 const db = getDb();
                 db.collection('services').updateOne({serviceId:serviceId},{$set:serviceDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true,service:serviceDoc});
                             })
                             .catch(err=>console.log(err));
             })
}


exports.delService=(req,res,next)=>{

    const serviceId = +req.params.serviceId;

    Service.findServiceByServiceID(JSON.parse(serviceId))
                    .then(service=>{
                        if(!service)
                        {
                            return res.json({ message:'Service does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('services').deleteOne({serviceId:serviceId})
                                    .then(resultData=>{
                                        Employee.fetchAllEmployees()
                                        .then(empData=>{
                                            if(empData.length >= 0)
                                            {
                                                empData.forEach(emp=>{
                                                    // console.log(emp.empName)
                                                    emp.empServices.forEach(empServ=>{
                                                        // console.log(empServ)
                                                        if(empServ.toString() == serviceId.toString())
                                                        {
                                                            console.log("Service Exist", emp.empId);
                                                            const index = emp.empServices.indexOf(empServ);
                                                            if(index > -1)
                                                            {
                                                                emp.empServices.splice(index,1);
                                                            }
                                                            console.log(emp.empServices);
                                                            //updating employee
                                                             const db = getDb();
                                                             db.collection('employees').updateOne({empId:emp.empId},{$set:emp})
                                                                         .then(resultData=>{
                                                                             console.log("Employee Updated")
                                                                         })

                                                        }
                                                    })
                                                })
                                            }
                                        })
                                        setTimeout(()=>{
                                            res.json({message:'Service Deleted',status:true});
                                        },1500)
                                        
                                    })
                                    .catch(err=>console.log(err));
                    })
}

