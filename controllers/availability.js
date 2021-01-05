
const Availability = require('../models/availability');

const Appointment = require('../models/appointment');

const Employee = require('../models/employee');

const getDb = require('../util/database').getDB; 


exports.getAllEmpAvailData=(req,res,next)=>{
  
    Availability.fetchAllEmpAvails()
                .then(avails=>{                   
                    res.json({message:"All employee data returned",avails:avails})

                })
                .catch(err=>console.log(err));
}

exports.getAllSaloonAvailData=(req,res,next)=>{
  
    Availability.fetchAllSaloonAvails()
                .then(avails=>{                   
                    res.json({message:"All saloon sata returned",avails:avails})

                })
                .catch(err=>console.log(err));
}


exports.getSingleEmpAvailData=(req,res,next)=>{
  
    const empId = +req.params.empId;
   
    Availability.findAvailByEmpId(JSON.parse(empId))
    .then(availDoc=>{
      
        if(availDoc){
           
            res.json({status:true, data:availDoc});
            
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}

exports.getSingleSaloonAvailData=(req,res,next)=>{
  
    const saloonId = +req.params.saloonId;
   
    Availability.findAvailBySaloonId(JSON.parse(saloonId))
    .then(availDoc=>{
       
        if(availDoc){
           
             res.json({status:true, data:availDoc});
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}


exports.getSingleEmpAvailDataByDate=(req,res,next)=>{
  
    const empId = +req.body.empId;

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);
   
    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
    .then(availDoc=>{
       
        if(availDoc){
           
            // console.log(new Date(availDoc.startDate))
            //  res.json({status:true, data:availDoc});
             Employee.findEmployeeByEmpID(empId)
            .then(emp=>{
                // console.log(emp.saloonId);
                if(emp)
                {
                    Availability.findAvailBySaloonIdAndDate(emp.saloonId,startDate,endDate)
                    .then(availSaloon=>{
                        // console.log(availSaloon);
                        
                 res.json({status:true, data:availDoc,saloonData : availSaloon});
                    })
                }
                else
                {
                    res.json({status:true,data:[]});
                }             
                
            })
        }
        else{
            
            Employee.findEmployeeByEmpID(empId)
            .then(emp=>{
                // console.log(emp.saloonId);
                if(emp)
                {
                    Availability.findAvailBySaloonIdAndDate(emp.saloonId,startDate,endDate)
                    .then(availSaloon=>{
                        // console.log(availSaloon);
                        if(availSaloon==null){
                            res.json({status:false,message:"No such availability exist",saloonData:[]});
                        }
                        else{
                        res.json({status:false,message:"No such availability exist",saloonData:availSaloon});
                        }
                    })
                }
                else
                {
                    res.json({status:true,data:[]});
                }             
                
            })
        }          

    })    
}



exports.getSingleEmpAvailDataBySingleDate=(req,res,next)=>{
  
    const empId = +req.body.empId;
    let day = req.body.day;
    let oneDate = req.body.oneDate;    

    oneDate = new Date(oneDate).getTime();
    console.log(oneDate);

    if(day.toLowerCase() == "monday")
    {
        statusKey = 0;
    }
    if(day.toLowerCase() == "tuesday")
    {
        statusKey = 1;
    }
    if(day.toLowerCase() == "wednesday")
    {
        statusKey = 2;
    }
    if(day.toLowerCase() == "thursday")
    {
        statusKey = 3;
    }
    if(day.toLowerCase() == "friday")
    {
        statusKey = 4;
    }
    if(day.toLowerCase() == "saturday")
    {
        statusKey = 5;
    }
    if(day.toLowerCase() == "sunday")
    {
        statusKey = 6;
    }
   
   
    Availability.findAvailByEmpIdAndSingleDate(empId,oneDate)
    .then(availDoc=>{
       
        if(availDoc){

            let availArr = [];
            availDoc.timeslot[statusKey].forEach(avail=>{
                var timePartsStart = avail.srtTime.split(":");
                timePartsStart = Number(timePartsStart[0]) * 60 + Number(timePartsStart[1]);
                // avail.srtTime = timePartsStart;
                // console.log(timePartsStart);

                var timePartsEnd = avail.endTime.split(":");
                timePartsEnd = Number(timePartsEnd[0]) * 60 + Number(timePartsEnd[1]);
                // avail.endTime = timePartsEnd;
                // console.log(timePartsEnd);
                
                availArr.push(avail);
            })
            if(availDoc.timeslot[statusKey].length == availArr.length)
            {

            Appointment.findAppointByEmpIdAndDate(availDoc.empId,oneDate)
                    .then(appoint=>{
                        if(appoint.length!=0)
                        {
                            let appointArr = [];
                            appoint.forEach(app=>{
                                var timePartsStart = app.bookingTime.srtTime.split(":");
                                timePartsStart = Number(timePartsStart[0]) * 60 + Number(timePartsStart[1]);
                                // app.bookingTime.srtTime = timePartsStart;
                                // console.log(timePartsStart);

                                var timePartsEnd = app.bookingTime.endTime.split(":");
                                timePartsEnd = Number(timePartsEnd[0]) * 60 + Number(timePartsEnd[1]);
                                // app.bookingTime.endTime = timePartsEnd;
                                // console.log(timePartsEnd);
                                

                                appointArr.push(app.bookingTime);
                            })

                            if(availDoc.availStatus[statusKey]==1)
                            {
                            if(appoint.length==appointArr.length)
                            {
                                // console.log(availDoc.availStatus[statusKey])
                                let newTime = [];
                                appointArr.forEach(app=>{
                                    availArr.forEach(avl=>{
                                        if(app.srtTime>=avl.srtTime&&app.srtTime<avl.endTime&&app.endTime>=avl.srtTime&&app.endTime<=avl.endTime)
                                        {
                                            let time1 = avl.srtTime;
                                            let time2 = app.srtTime;
                                           
                                            if(time1!=time2)
                                            {
                                                let srHR1 = Math.floor(time1/60);
                                                let srMI1 = time1%60;
                                                if(srMI1==0 || srMI1==1 || srMI1==2 || srMI1==3 || srMI1==4 || srMI1==5 || srMI1==6 || srMI1==7 ||srMI1==8 ||srMI1==9   )
                                                {
                                                    srMI1 = "0"+srMI1;
                                                }
                                                let finalTime1 = srHR1+":"+srMI1

                                                let srHR2 = Math.floor(time2/60);
                                                let srMI2 = time2%60;
                                                if(srMI2==0 || srMI2==1 || srMI2==2 || srMI2==3 || srMI2==4 || srMI2==5 || srMI2==6 || srMI2==7 ||srMI2==8 ||srMI2==9 )
                                                {
                                                    srMI2 = "0"+srMI2;
                                                }
                                                let finalTime2 = srHR2+":"+srMI2
                                                newTime.push({srtTime:finalTime1,endTime:finalTime2});
                                                // newTime.push({srtTime:time1,endTime:time2});
                                            }
                                            
                                            let time3 = app.endTime;
                                            let time4 = avl.endTime;
                                            if(time3!=time4)
                                            {
                                                let srHR3 = Math.floor(time3/60);
                                                let srMI3 = time3%60;
                                                if(srMI3==0)
                                                {
                                                    srMI3 = "0"+srMI3;
                                                }
                                                let finalTime3 = srHR3+":"+srMI3;

                                                let srHR4 = Math.floor(time4/60);
                                                let srMI4 = time4%60;
                                                if(srMI4==0)
                                                {
                                                    srMI4 = "0"+srMI4;
                                                }
                                                let finalTime4 = srHR4+":"+srMI4
                                                newTime.push({srtTime:finalTime3,endTime:finalTime4});
                                                // newTime.push({srtTime:time3,endTime:time4});
                                            }
                                           
                                        }
                                    })
                                })
                                // console.log(newTime);
                               
                                res.json({status:true, availData:availArr,appointData:appointArr});
                            }
                        }else{
                            res.json({status:false,message:"Employee not available"});
                        }
                           
                        }
                        else{
                            res.json({status:true, availData:availArr,appointData:[]});
                        }          
                
                    })         
                } 
            
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}


exports.getSingleSaloonAvailDataByDate=(req,res,next)=>{
  
    const saloonId = +req.body.saloonId;

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);
   
    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
    .then(availDoc=>{
       
        if(availDoc){
           
            // console.log(new Date(availDoc.startDate))
             res.json({status:true, data:availDoc});
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}



//POST
exports.availEmpRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const empId = +req.body.empId;
    const saloonId = null;    
    const availStatus = req.body.availStatus;    
    const timeslot = req.body.timeslot;
    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
            .then(availData=>{
                if(availData){
                    
                    availData.availStatus = availStatus;
                    availData.timeslot = timeslot;
                    const db = getDb();
                    return db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availData})
                                .then(resultData=>{
                                    
                                   return res.json({message:'Details Updated',status:true});
                                })
                                .catch(err=>console.log(err));
                    // return res.json({status:false, message:'Availability already registered for this week'});
                }
                
                    //saving in database
                    const availability = new Availability(empId,saloonId,availStatus,timeslot,startDate,endDate);

                    return availability.save()
                    .then(resultData=>{
                        
                        res.json({status:true,message:"Availability Registered",availability:resultData["ops"][0]});
                        
                    })
                    .catch(err=>console.log(err));                      
            })
        .then(resultInfo=>{                   
            
        })
        .catch(err=>console.log(err));      

}



exports.availSaloonRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const empId = null;
    const saloonId = +req.body.saloonId;    
    const availStatus = req.body.availStatus;    
    const timeslot = req.body.timeslot;
    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);

    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
            .then(availData=>{
                if(availData){
                    availData.availStatus = availStatus;
                    availData.timeslot = timeslot;
                    const db = getDb();
                    return db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availData})
                                .then(resultData=>{
                                    
                                   return res.json({message:'Details Updated',status:true});
                                })
                                .catch(err=>console.log(err));
                    // return res.json({status:false, message:'Availability already registered for this week'});
                }
                
                    //saving in database
                    const availability = new Availability(empId,saloonId,availStatus,timeslot,startDate,endDate);

                    return availability.save()
                    .then(resultData=>{
                        
                        res.json({status:true,message:"Availability Registered",availability:resultData["ops"][0]});
                        
                    })
                    .catch(err=>console.log(err));                      
            })
        .then(resultInfo=>{                   
            
        })
        .catch(err=>console.log(err));      
}



exports.availEmpEdit = (req,res,next)=>{
  
    //parsing data from incoming request
    const empId = +req.body.empId;
    const availStatus = req.body.availStatus;    
    const timeslot = req.body.timeslot;
    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);

    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
    .then(availDoc=>{                
        if(!availDoc)
        {
            return res.json({ message:'Availability does not exist',status:false});
        }
        
        availDoc.availStatus = availStatus;
        availDoc.timeslot = timeslot;
                
        const db = getDb();
        db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availDoc})
                    .then(resultData=>{
                        
                        res.json({message:'Details Updated',status:true});
                    })
                    .catch(err=>console.log(err));
    }) 

}



exports.availSaloonEdit = (req,res,next)=>{
  
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const availStatus = req.body.availStatus;    
    const timeslot = req.body.timeslot;
    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);

    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
    .then(availDoc=>{                
        if(!availDoc)
        {
            return res.json({ message:'Availability does not exist',status:false});
        }
        
        availDoc.availStatus = availStatus;
        availDoc.timeslot = timeslot;
                
        const db = getDb();
        db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availDoc})
                    .then(resultData=>{
                        
                        res.json({message:'Details Updated',status:true});
                    })
                    .catch(err=>console.log(err));
    }) 
}



exports.editEmpAvailStatus=(req,res,next)=>{
    //parsing data from incoming request
    const empId = +req.body.empId;
    const day = req.body.day;
    const newStatus = +req.body.newStatus;  

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    let statusKey;
    if(day.toLowerCase() == "monday")
    {
        statusKey = 0;
    }
    if(day.toLowerCase() == "tuesday")
    {
        statusKey = 1;
    }
    if(day.toLowerCase() == "wednesday")
    {
        statusKey = 2;
    }
    if(day.toLowerCase() == "thursday")
    {
        statusKey = 3;
    }
    if(day.toLowerCase() == "friday")
    {
        statusKey = 4;
    }
    if(day.toLowerCase() == "saturday")
    {
        statusKey = 5;
    }
    if(day.toLowerCase() == "sunday")
    {
        statusKey = 6;
    }
    
   
    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
             .then(availDoc=>{                
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability does not exist',status:false});
                 }
                 
                 availDoc.availStatus[statusKey] = newStatus;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })

}



exports.editSaloonAvailStatus=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const day = req.body.day;
    const newStatus = +req.body.newStatus;  

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    let statusKey;
    if(day.toLowerCase() == "monday")
    {
        statusKey = 0;
    }
    if(day.toLowerCase() == "tuesday")
    {
        statusKey = 1;
    }
    if(day.toLowerCase() == "wednesday")
    {
        statusKey = 2;
    }
    if(day.toLowerCase() == "thursday")
    {
        statusKey = 3;
    }
    if(day.toLowerCase() == "friday")
    {
        statusKey = 4;
    }
    if(day.toLowerCase() == "saturday")
    {
        statusKey = 5;
    }
    if(day.toLowerCase() == "sunday")
    {
        statusKey = 6;
    }
    
   
    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
             .then(availDoc=>{                
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability does not exist',status:false});
                 }
                 
                 availDoc.availStatus[statusKey] = newStatus;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })

}



exports.editEmpAvailTimeslot=(req,res,next)=>{
    //parsing data from incoming request
    const empId = +req.body.empId;
    const day = req.body.day;
    const newTimeSlot = req.body.newTimeSlot;  

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    let statusKey;
    if(day.toLowerCase() == "monday")
    {
        statusKey = 0;
    }
    if(day.toLowerCase() == "tuesday")
    {
        statusKey = 1;
    }
    if(day.toLowerCase() == "wednesday")
    {
        statusKey = 2;
    }
    if(day.toLowerCase() == "thursday")
    {
        statusKey = 3;
    }
    if(day.toLowerCase() == "friday")
    {
        statusKey = 4;
    }
    if(day.toLowerCase() == "saturday")
    {
        statusKey = 5;
    }
    if(day.toLowerCase() == "sunday")
    {
        statusKey = 6;
    }
    
   
    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
             .then(availDoc=>{               
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability Does not exist',status:false});
                 }
                 
                 availDoc.timeslot[statusKey] = newTimeSlot;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}


exports.editSaloonAvailTimeslot=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const day = req.body.day;
    const newTimeSlot = req.body.newTimeSlot;  

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    let statusKey;
    if(day.toLowerCase() == "monday")
    {
        statusKey = 0;
    }
    if(day.toLowerCase() == "tuesday")
    {
        statusKey = 1;
    }
    if(day.toLowerCase() == "wednesday")
    {
        statusKey = 2;
    }
    if(day.toLowerCase() == "thursday")
    {
        statusKey = 3;
    }
    if(day.toLowerCase() == "friday")
    {
        statusKey = 4;
    }
    if(day.toLowerCase() == "saturday")
    {
        statusKey = 5;
    }
    if(day.toLowerCase() == "sunday")
    {
        statusKey = 6;
    }
    
   
    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
             .then(availDoc=>{               
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability Does not exist',status:false});
                 }
                 
                 availDoc.timeslot[statusKey] = newTimeSlot;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}




