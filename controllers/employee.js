
const Employee = require('../models/employee');

const Service = require('../models/services');

const Appointment = require('../models/appointment');

var request = require('request');

var Client = require('../models/client');

const getDb = require('../util/database').getDB; 


exports.getAllEmployees=(req,res,next)=>{
    
    Employee.fetchAllEmployees()
                .then(employees=>{
                   
                    res.json({message:"All Data returned",employees:employees})

                })
                .catch(err=>console.log(err));

}


exports.getSingleEmployee=(req,res,next)=>{
  
    const empId = req.params.empId;
   
    Employee.findEmployeeByEmpID(JSON.parse(empId))
    .then(empDoc=>{
       
        if(empDoc){
           
             res.json({status:true, data:empDoc});
        }
        else{
            res.json({status:false,message:"No such employee exist"});
        }          

    })    
}


exports.getSaloonEmployees=(req,res,next)=>{

    const saloonId = req.params.saloonId;
    let count = 0;

    Employee.findEmployeesBySaloonID(JSON.parse(saloonId))
                    .then(employees=>{
                        if(employees.length==0)
                        {
                            return res.json({ message:'Employee does not exist',data:employees});
                        }
                        
                        employees.forEach(emp=>{
                            let services = [];
                            count = count+1;
                            emp.empServices.forEach(serId=>{
                                serId = +serId;
                                Service.findServiceByServiceID(+serId)
                                        .then(servData=>{    
                                          services.push(servData);   
                                        //   console.log(services);    
                                        if(services.length==emp.empServices.length)
                                        {   
                                           emp.empServices = services;
                                        //    console.log("Employees :",employees);
                                           return false;
                                           
                                        //   console.log("EMP Service: ",emp.empServices)   
                                        //   res.json({message:"All Employees returned",data:employees});   
                                        }                          
                                                                                 
                                        })                                       
                                        
                            })
                           
                           
                            // console.log(emp.empServices)
                            // emp.empServices = services;
                            
                        // if(count==employees.length)
                        // {
                        //     console.log(count)
                        //     res.json({message:"All Employees returned",data:employees});   
                        // }  
                       
                     
                        })
                        setTimeout(()=>{
                            // console.log(employees);
                            res.json({message:"All Employees returned",data:employees});   
                        },1000)
                        
                        

                    })

}


exports.delEmpPhoto=(req,res,next)=>{
    //parsing data from incoming request
    const empId = +req.params.empId;
   console.log(empId);
    Employee.findEmployeeByEmpID(empId)
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Employee does not exist',status:false});
                 }              

                     clientDoc.empImg = null;
                 
                     const db = getDb();
                     db.collection('employees').updateOne({empId:empId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,employee:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                               
             })
}



exports.delEmployee=(req,res,next)=>{

    const empId = +req.params.empId;
    //current Date
    var currDate = new Date();
    var dd = String(currDate.getDate()).padStart(2, '0');
    var mm = String(currDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = currDate.getFullYear();

    currDate =yyyy + '-' +mm + '-' + dd ;
    // console.log(currDate);
    currDate = new Date(currDate).getTime();

    var myJSONObject = {
        "app_id": process.env.ONE_SIGNAL_APP_ID,
        "include_player_ids": [],
        "data": {"foo": "Title101"},
        "contents": {"en": "APPOINTMENT CANCELLED\nEmployee Deleted"}
      };

    Employee.findEmployeeByEmpID(JSON.parse(empId))
                    .then(employee=>{
                        if(!employee)
                        {
                            return res.json({ message:'Employee does not exist',status:false});
                        }
                        Appointment.findCurrentAppointByEmpIdAndDateTime(+empId,currDate)
                        .then(appoints=>{
                            console.log("Appointments : ",appoints)
                            if(appoints.length>0)
                            {
                                let clientsData = [];
                                appoints.forEach(ap=>{
                                  
                                    Client.findClientByPhone(ap.clientPhone)
                                    .then(cl=>{
                                     
                                        // console.log('The appointment at '+ap.bookingTime.srtTime+'Hours is deleted due to the unavailability of the employee.please create the  new appointment.')
                                        myJSONObject["contents"] = {"en":'The appointment at '+ap.bookingTime.srtTime+' Hours is deleted due to the unavailability of the employee.please create the  new appointment.'};
                                           console.log(myJSONObject["contents"]);
                                        clientsData.push(cl);
                                        myJSONObject["include_player_ids"]=[cl.deviceToken];
                                        request({
                                            url: "https://onesignal.com/api/v1/notifications",
                                            method: "POST",
                                            json: true,   // <--Very important!!!
                                            body: myJSONObject,
                                            headers:{
                                                'Content-Type': 'application/json',
                                               'Authorization': process.env.ONE_SIGNAL_AUTHORIZATION
                                            }
                                        }, function (error, response, body){
                                            if(response)
                                            {
                                                console.log(response);
                                            }
                                          
                                            if(error)
                                            {
                                                console.log(error)
                                            }
                                            if(body)
                                            {
                                                console.log(body)
                                            }
                                           
                                            
                                        });
                                        // console.log(clientsData)
                                        
                                    if(clientsData.length==appoints.length)
                                    {
                                        // console.log(myJSONObject)
                                        // return res.json({message:clientsData,status:true});
                                        
                        const db = getDb();
                        db.collection('employees').deleteOne({empId:empId})
                                    .then(resultData=>{
                                  
                                            // res.json({message:'Employee Deleted',status:true});
                                            db.collection('appointments').deleteMany({empId:empId})
                                            .then(resultData=>{
                                                // var post_req = http.request(post_options, function(res) {
                                                //     res.setEncoding('utf8');
                                                //     res.on('data', function (chunk) {
                                                //         console.log('Response: ' + chunk);
                                                //     })
                                                // });
                                                // 
                                                return res.json({message:'Employee and Appoints Deleted',status:true});
                                              
                                            })

                                        
                                    })

                                    }

                                    })

                                })
                               
                               
                            }
                            else
                            {
                                const db = getDb();
                                db.collection('employees').deleteOne({empId:empId})
                                .then(resultData=>{
                                    return res.json({message:'Employee Deleted',status:false});
                                })
                                
                            }
                                       
                                    })
                                    .catch(err=>console.log(err));
                    })
                    
}


exports.empCredentials = (req,res,next)=>{

      const empId = +req.body.empId;
      const email = req.body.email;
      const password = req.body.password;
      
     
      Employee.findEmployeeByEmpID(+empId)
               .then(clientDoc=>{
                   if(!clientDoc)
                   {
                       return res.json({ message:'Employee does not exist',status:false});
                   }              
                  console.log(email)
                   Employee.findEmployeesByEmail(email)
                   .then(empData=>{
                       if(empData.length>0)
                       {
                        if(empData[0].empId == empId)
                        {
                            clientDoc.email = email;
                            clientDoc.password = password;
                            const db = getDb();
                            db.collection('employees').updateOne({empId:empId},{$set:clientDoc})
                                   .then(resultData=>{
                                       
                                       return res.json({message:'Details Updated',status:true,employee:clientDoc});
                                   })
                                   .catch(err=>console.log(err));
                        }
                        else{
                        return res.json({ message:'Email already exist',status:false});
                        }
                       }
                       else{
                        clientDoc.email = email;
                        clientDoc.password = password;
                    
                        const db = getDb();
                        db.collection('employees').updateOne({empId:empId},{$set:clientDoc})
                                    .then(resultData=>{
                                        
                                        return res.json({message:'Details Updated',status:true,employee:clientDoc});
                                    })
                                    .catch(err=>console.log(err));
                       }
                      
                                          
                      })
       
                   })
         
}



