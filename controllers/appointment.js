const Appointment = require('../models/appointment');
const getDb = require('../util/database').getDB; 


exports.postAppointment = (req,res,next)=>{  

    let appointId;
    const saloonId = +req.body.saloonId ;
    const empId = +req.body.empId;   
    const serviceId = req.body.serviceId;
    const clientId = +req.body.clientId;
    const serviceName = req.body.serviceName;
    const clientName = req.body.clientName;
    const clientPhone = req.body.clientPhone;
    const empName = req.body.empName;
    const bookingTime = req.body.bookingTime;
    // console.log("Start Time : ", bookingTime.srtTime,"End Time : ",bookingTime.endTime);
    // console.log(bookingTime.srtTime == bookingTime.endTime)
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
    const bookingDay = req.body.bookingDay;
    const totalCost = +req.body.totalCost;
    const note = req.body.note;

    Appointment.findAppointByEmpIdAndDateTime(empId,bookingDate,bookingTime.srtTime,bookingTime.endTime)
    .then(appointDoc=>{
        if(appointDoc.length!=0){                        
            return res.json({status:false, message:'Appointment Already Exists'});
        }

        let newVal;
        const db = getDb();     
        db.collection('appCounter').find().toArray().then(data=>{
            
            newVal = data[data.length-1].count;
           
            newVal = newVal + 1;
           
            appointId = newVal;
            
            db.collection('appCounter').insertOne({count:newVal})
                    .then(result=>{
                        
                        const appointment = new Appointment(appointId,saloonId,empId,serviceId,serviceName,clientName,clientPhone,empName,bookingTime,bookingDate,bookingDay,totalCost,note,clientId);
                       
                        //saving in database                    
                        return appointment.save()
                        .then(resultData=>{
                            
                            return res.json({status:true,message:"Appointment Created ",data:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,message:"Appointment Creation Failed ",error:err})
                    })                             
        })    
    })
    .then(resultInfo=>{                   
      
    })
    .catch(err=>console.log(err));       
}


exports.getAllAppointments=(req,res,next)=>{
    
    Appointment.fetchAllAppointments()
                .then(appointments=>{
                   
                    res.json({message:"All Data returned",allAppointments:appointments})

                })
                .catch(err=>console.log(err));
}

exports.getAllAppointmentsMonth=(req,res,next)=>{
    var monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    var today = new Date();
    // var today = new Date();
    var d;
    var months = [];
    var d = new Date();
    var month;
    var year = d.getFullYear();
    // console.log(year)

        //for last 6 months(including current month)
    // for(var i = 5; i > -1; i -= 1) {
        var keyData = 1;
        //for last 6 months(excluding current month)
    for(var i = 6; i > 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    //   console.log(d.getFullYear())
   
      months.push({month:monthNames[d.getMonth()],year:d.getFullYear(),key:keyData});
      keyData = keyData+1;
    //   console.log(keyData)
         month = monthNames[d.getMonth()];
         console.log(months)
//   console.log(month,d.getFullYear());
//   year = d.getFullYear();

    //   year = d.getFullYear();
    //   console.log(year)
    //   console.log(month);
    }
    // console.log(months)
    let dates = [];
    months.forEach(m=>{
        
        if(m.month=="january")
        {
            mo = 0;
        }
        if(m.month=="february")
        {
            mo = 1;
        }
        if(m.month=="march")
        {
            mo = 2;
        }
        if(m.month=="april")
        {
            mo = 3;
        }
        if(m.month=="may")
        {
            mo = 4;
        }
        if(m.month=="june")
        {
            mo = 5;
        }
        if(m.month=="july")
        {
            mo = 6;
        }
        if(m.month=="august")
        {
            mo = 7;
        }
        if(m.month=="september")
        {
            mo = 8;
        }
        if(m.month=="october")
        {
            mo = 9;
        }
        if(m.month=="november")
        {
            mo = 10;
        }
        if(m.month=="december")
        {
            mo = 11;
        }
        
        
        const firstDay = new Date(m.year, mo, 1);
        // alert(firstDay.getDate());
        const lastDay = new Date(m.year, mo + 1, 0);
        // alert(lastDay.getDate());
        // console.log(firstDay,lastDay)
        mo = mo+1;
        mo = mo<10?"0"+mo:mo; 
        // console.log(year)  
        dates.push({
                        srtDate: firstDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+firstDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+firstDay.getDate().toString(),
                        endDate: lastDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+lastDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+lastDay.getDate().toString(),
                        month:mo
                    });
  
    })
    // console.log(dates)
    var allData = [];
    dates.forEach(d=>{
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(startDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        console.log(startDate,endDate)
        Appointment.findAppointsByDates(startDate,endDate)
        .then(saloons=>{
            // console.log(saloons.length)
            allData.push({month:d.month.toString(),appoints:saloons.length})
            // console.log(allData)
            if(dates.length == allData.length)
            {   
                allData.sort((a, b) => {
                    return a.key - b.key;
                });
                res.json({message:"All Data returned",allAppoints:allData})
            }

        })
        .catch(err=>console.log(err));
    })
   
}



exports.getSingleAppointment=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Appointment.findAppointByID(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Appointment does not exist',data:null});
                    }

                    res.json({status:true, message:'Appointment exists',data:appoint});
                })

}


exports.getAppointByEmpIdDate=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
  
   
    Appointment.findAppointByEmpIdAndDate(empId,bookingDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',data:appoint});
                    }

                    let timeSlot = [];
                    appoint.forEach(element => {
                        timeSlot.push(element.bookingTime);
                    });

                    console.log(timeSlot);

                    res.json({ message:'Appointment Exists',data:timeSlot});
                })
}



exports.getAppointBySaloonAndBdate=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
  
   
    Appointment.findAppointBySaloonIdAndDate(saloonId,bookingDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',data:appoint});
                    }               

                    res.json({ message:'Appointment Exists',data:appoint});

                })

}



exports.getDayRevenuePerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);

    Appointment.findAppointBySaloonIdAndDate(saloonId,bookingDate)
                .then(appoints=>{
                    Appointment.findAppointsBySaloonId(saloonId)
                    .then(apps=>{
                        if(apps.length==0)
                        {
                            return res.json({ message:'Appointment not exist',revenue:revenueObj});
                        } 
                        var revenueObj1 = {totalApp:0,totalAmt:0,totalServices:0};  
                        apps.forEach(app=>{
                            revenueObj1.totalApp = revenueObj1.totalApp + 1;
                            revenueObj1.totalAmt = revenueObj1.totalAmt + app.totalCost;
                            revenueObj1.totalServices = revenueObj1.totalServices + app.serviceId.length;
                        })
                        revenueObj1.avgRevenue = revenueObj1.totalAmt / revenueObj1.totalApp;
                        revenueObj1.avgAppointments = revenueObj1.totalServices / revenueObj1.totalApp;
                        console.log(revenueObj1);

                        appoints.forEach(app=>{
                            revenueObj.totalApp = revenueObj.totalApp + 1;
                            revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                            revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                        })
    
                                                       
                       return res.json({ message:'Appointment Exists',avgRevenue:revenueObj1.avgRevenue,avgAppointments:revenueObj1.avgAppointments,revenue:revenueObj});
                       
                    })  
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};  

                    if(appoints.length==0)
                    {
                        // return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }               
                                                      
                })
}



exports.getWeekRevenuePerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.saloonWeekRevenue(saloonId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};   

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }               
                                

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}



exports.getMonthRevenuePerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.saloonWeekRevenue(saloonId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0};   

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }                                               

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
                    revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;
                    
                    res.json({ message:'Appointment Exists',revenue:revenueObj});
                })
}



exports.getDayRevenuePerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
     
    Appointment.findAppointByEmpIdAndDate(empId,bookingDate)
                .then(appoints=>{
                    Appointment.findAppointsByEmpId(empId)
                    .then(apps=>{
                        if(apps.length==0)
                        {
                            return res.json({ message:'Appointment not exist',revenue:revenueObj});
                        } 
                        var revenueObj1 = {totalApp:0,totalAmt:0,totalServices:0};  
                        apps.forEach(app=>{
                            revenueObj1.totalApp = revenueObj1.totalApp + 1;
                            revenueObj1.totalAmt = revenueObj1.totalAmt + app.totalCost;
                            revenueObj1.totalServices = revenueObj1.totalServices + app.serviceId.length;
                        })
                        revenueObj1.avgRevenue = revenueObj1.totalAmt / revenueObj1.totalApp;
                        revenueObj1.avgAppointments = revenueObj1.totalServices / revenueObj1.totalApp;
                        // console.log(revenueObj1);

                        appoints.forEach(app=>{
                            revenueObj.totalApp = revenueObj.totalApp + 1;
                            revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                            revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                        })
    
                                                       
                       return res.json({ message:'Appointment Exists',avgRevenue:revenueObj1.avgRevenue,avgAppointments:revenueObj1.avgAppointments,revenue:revenueObj});
                       
                    })  
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};  

                    if(appoints.length==0)
                    {
                        // return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }               
                                                      
                })
}



exports.getWeekRevenuePerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.empWeekRevenue(empId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};    

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }                                               

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}

exports.getMonthRevenuePerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.empWeekRevenue(empId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0};                 

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }               
                    
                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
                    revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}



exports.editAppointment=(req,res,next)=>{
    //parsing data from incoming request
    const appointId = +req.body.appointId;

    const saloonId = +req.body.saloonId ;
    const empId = +req.body.empId;   
    const serviceId = req.body.serviceId;
    const serviceName = req.body.serviceName;
    const clientName = req.body.clientName;
    const clientPhone = req.body.clientPhone;
    const empName = req.body.empName;

    const bookingTime = req.body.bookingTime;
    const bookingDay = req.body.bookingDay;
        
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);  
   
    Appointment.findAppointByID(JSON.parse(appointId))
             .then(appDoc=>{
                 if(!appDoc)
                 {
                     return res.json({ message:'Appointment does not exist',status:false});
                 }
                 
                 appDoc.saloonId = saloonId;
                 appDoc.empId = empId;
                 appDoc.serviceId = serviceId;                 
                 appDoc.serviceName = serviceName;
                 appDoc.clientName = clientName;
                 appDoc.clientPhone = clientPhone;
                 appDoc.empName = empName;
                 
                 appDoc.bookingTime = bookingTime;
                 appDoc.bookingDay = bookingDay;
                 appDoc.bookingDate = bookingDate;
                 
                 const db = getDb();
                 db.collection('appointments').updateOne({appointmentId:appointId},{$set:appDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })
}


exports.delAppointment=(req,res,next)=>{

    const appointId = +req.params.appointId;

    Appointment.findAppointByID(JSON.parse(appointId))
                    .then(appoint=>{
                        if(!appoint)
                        {
                            return res.json({ message:'Appointment does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('appointments').deleteOne({appointmentId:appointId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Appointment Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}



exports.getMonthGraphPerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    const months = req.body.months;
    // console.log(dates);

    //let months = ["february","april","may","june","july","august"];
    // let months = [1,9,10,2];

    let dates = [];
    months.forEach(m=>{

        const firstDay = new Date(m.year, +m.month, 1);
        // alert(firstDay.getDate());
        const lastDay = new Date(m.year, +m.month + 1, 0);
        // alert(lastDay.getDate());
        m.month = m.month+1;
        m.month = m.month<10?"0"+m.month:m.month;
        dates.push({
                        srtDate: firstDay.getDate()<10?m.year.toString()+"-"+m.month.toString()+"-0"+firstDay.getDate().toString():m.year.toString()+"-"+m.month.toString()+"-"+firstDay.getDate().toString(),
                        endDate: lastDay.getDate()<10?m.year.toString()+"-"+m.month.toString()+"-0"+lastDay.getDate().toString():m.year.toString()+"-"+m.month.toString()+"-"+lastDay.getDate().toString(),
                        month:m.month
                    });
  
    })
   
    var revenues = [];
    dates.forEach(d=>{
        let newMonth = -1;
        // console.log(dates.length)
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(d.srtDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        // console.log(d.endDate);  

        Appointment.saloonWeekRevenue(saloonId,startDate,endDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0,month:+d.month,srtDate:d.srtDate,endDate:d.endDate};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
               
                revenues.push(revenueObj);
                
                // return res.json({ message:'Appointment not exist',revenue:revenues});
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
            revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;
    
          
            revenues.push(revenueObj);
            
            // console.log("Revenue :",revenues.length);           
        }
           
        if(dates.length == revenues.length)
        {     
          
             revenues.sort((a, b) => {
                return b.month - a.month;
            });
            res.json({ message:'All data returned',revenues:revenues});
            console.log("month");  
            newMonth = d.month;                   
            revenues = [];
        }
        
        })        
    }) 
   
}


exports.getMonthGraphPerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    const months = req.body.months;
    // console.log(dates);

    //let months = ["february","april","may","june","july","august"];
    // let months = [1,9,10,2];

    let dates = [];
    months.forEach(m=>{

        const firstDay = new Date(m.year, +m.month, 1);
        // alert(firstDay.getDate());
        const lastDay = new Date(m.year, +m.month + 1, 0);
        // alert(lastDay.getDate());
        m.month = m.month+1;
        m.month = m.month<10?"0"+m.month:m.month;
        dates.push({
                        srtDate: firstDay.getDate()<10?m.year.toString()+"-"+m.month.toString()+"-0"+firstDay.getDate().toString():m.year.toString()+"-"+m.month.toString()+"-"+firstDay.getDate().toString(),
                        endDate: lastDay.getDate()<10?m.year.toString()+"-"+m.month.toString()+"-0"+lastDay.getDate().toString():m.year.toString()+"-"+m.month.toString()+"-"+lastDay.getDate().toString(),
                        month:m.month
                    });
  
    })  
   
    // console.log(dates)
 
    var revenues = [];
    dates.forEach(d=>{
        // console.log(dates.length)
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(d.srtDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        // console.log(d.endDate);  

        Appointment.empWeekRevenue(empId,startDate,endDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0,month:+d.month,srtDate:d.srtDate,endDate:d.endDate};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
                revenues.push(revenueObj);               
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
            revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;
    
            revenues.push(revenueObj);           
        }
           
        if(dates.length == revenues.length)
        {            
            revenues.sort((a, b) => {
                return b.month - a.month;
            });
            res.json({ message:'All data returned',revenues:revenues});
            revenues = [];
        }

        })        
    })    
}



exports.getDayGraphPerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    const dates = req.body.dates;
    // console.log(dates);
   
    var revenues = [];
    dates.forEach(date=>{
        // console.log(dates.length)
    let bookingDate = date;
    bookingDate = new Date(bookingDate).getTime();
    // console.log(bookingDate);
     
    Appointment.findAppointBySaloonIdAndDate(saloonId,bookingDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,bookingDate:date};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
                revenues.push(revenueObj);               
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenues.push(revenueObj);           
        }
           
        if(dates.length == revenues.length)
        {            
            res.json({ message:'All data returned',revenues:revenues});
            revenues = [];
        }

        })        
    }) 
   
}



exports.getDayGraphPerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    const dates = req.body.dates;
    // console.log(dates);
   
    var revenues = [];
    dates.forEach(date=>{
        // console.log(dates.length)
    let bookingDate = date;
    bookingDate = new Date(bookingDate).getTime();
    // console.log(bookingDate);
     
    Appointment.findAppointByEmpIdAndDate(empId,bookingDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,bookingDate:date};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
                revenues.push(revenueObj);               
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenues.push(revenueObj);           
        }
           
        if(dates.length == revenues.length)
        {            
            res.json({ message:'All data returned',revenues:revenues});
            revenues = [];
        }

        })        
    }) 
   
}



exports.getWeekGraphPerEmp=(req,res,next)=>{
    let month = 11;
    let year = 2020;
    // const weeks = [];
    // const firstDay = new Date(year, month, 1);
    // console.log(firstDay.getDate());
    // const lastDay = new Date(year, month + 1, 0);
    // console.log(lastDay.getDate());
    // const daysInMonth = lastDay.getDate();
    // let dayOfWeek = firstDay.getDay();
    // // console.log(dayOfWeek);
    // let start;
    // let end;

    // for (let i = 1; i < daysInMonth + 1; i++) {

    //     if (dayOfWeek === 0 || i === 1) {
    //         start = i;
    //     }

    //     if (dayOfWeek === 6 || i === daysInMonth) {

    //         end = i;

    //         if (start !== end) {
    //             let acMonth = month+1;
    //             acMonth = acMonth<10?"0"+acMonth:acMonth; 
    //             weeks.push({
    //                 start: start<10?year.toString()+"-"+acMonth.toString()+"-0"+start.toString():year.toString()+"-"+acMonth.toString()+"-"+start.toString(),
    //                 end: end<10?year.toString()+"-"+acMonth.toString()+"-0"+end.toString():year.toString()+"-"+acMonth.toString()+"-"+end.toString()
    //             });
    //         }
    //     }

    //     dayOfWeek = new Date(year, month, i).getDay();
    //     console.log(dayOfWeek);
    // }     
    const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeks=[];      
    const  lastDate = new Date(year, month + 1, 0); 

    let start=0;
    let end; 

    for (let i = 1; i < lastDate.getDate()+1; i++) {         
    if (daysName[Number(new Date(year, month, i).getDay())] =="Sunday" || i == lastDate.getDate()) {
            end= i;
            let acMonth = month+1;
            acMonth = acMonth<10?"0"+acMonth:acMonth; 
            start = start+1;
            weeks.push({
                start: start<10?year.toString()+"-"+acMonth.toString()+"-0"+start.toString():year.toString()+"-"+acMonth.toString()+"-"+start.toString(),
                end: end<10?year.toString()+"-"+acMonth.toString()+"-0"+end.toString():year.toString()+"-"+acMonth.toString()+"-"+end.toString()
            });
            // weeks.push({
            //     start:start+1,
            //     end:end
            // }); 
            start = i;           
        }
    }  
       console.log(weeks);
       console.log(new Date('2020-2-01').getTime());
}



exports.currentAppoints = (req,res,next)=>{

    const phone = +req.params.phone;

    //current Date
    var currDate = new Date();

    var currMinutes = (''+currDate.getHours()+':'+currDate.getMinutes()).toString();
    currMinutes = currMinutes.split(":");
    currMinutes = Number(currMinutes[0]) * 60 + Number(currMinutes[1]);
    console.log(currMinutes);

    var dd = String(currDate.getDate()).padStart(2, '0');
    var mm = String(currDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = currDate.getFullYear();

    currDate =yyyy + '-' +mm + '-' + dd ;
    // console.log(currDate);
    currDate = new Date(currDate).getTime();
    // console.log(currDate.getMinutes());
    // console.log(newDt.getMinutes(),newDt.getHours())
     
    var currApps = [];

    Appointment.findAppointByClientPhoneAndCDate(phone,currDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',data:appoint});
                    }           
                    appoint.forEach(app=>{       
                        var a = new Date(app.bookingDate);
                        // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];                    
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();
                        // var time = year + ' ' + month + ' ' + date + ' ' + hour + ':' + min + ':' + sec ;
                        var time = year + '-' + month + '-' + date;                    
                        // console.log(time)
                        app.bookingDate = time;
                        var timePartsStart = app.bookingTime.srtTime.split(":");
                        timePartsStart = Number(timePartsStart[0]) * 60 + Number(timePartsStart[1]);
                        console.log(timePartsStart);
                        if(timePartsStart>=currMinutes)
                        {
                            currApps.push(app);
                        }

                        });    
                        setTimeout(()=>{
                            res.json({ message:'Appointment Exists',data:currApps});
                        },500)
                    
                })
}


exports.previousAppoints = (req,res,next)=>{

    const phone = +req.params.phone;

    //current Date
    var currDate = new Date();
    var dd = String(currDate.getDate()).padStart(2, '0');
    var mm = String(currDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = currDate.getFullYear();

    currDate =yyyy + '-' +mm + '-' + dd ;
    // console.log(currDate);
    currDate = new Date(currDate).getTime();
    // console.log(currDate);
     
    Appointment.findAppointByClientPhoneAndPDate(phone,currDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',data:appoint});
                    }        
                    appoint.forEach(app=>{       
                    var a = new Date(app.bookingDate);
                    // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];                    
                    var year = a.getFullYear();
                    var month = months[a.getMonth()];
                    var date = a.getDate();
                    var hour = a.getHours();
                    var min = a.getMinutes();
                    var sec = a.getSeconds();
                    // var time = year + ' ' + month + ' ' + date + ' ' + hour + ':' + min + ':' + sec ;
                    var time = year + '-' + month + '-' + date;                    
                    // console.log(time)
                    app.bookingDate = time;
                    // console.log(app)
                    });

                    res.json({ message:'Appointment Exists',data:appoint});
                })
}
