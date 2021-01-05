const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Appointment
{
   
   
    constructor(id,saloonId,empId,serviceId,serviceName,clientName,clientPhone,empName,time,date,day,cost,note)
    {          
        this.appointmentId = id;
        this.saloonId = saloonId;
        this.empId = empId;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.clientName = clientName;
        this.clientPhone = clientPhone;
        this.empName = empName;
        this.bookingTime = time;
        this.bookingDate = date;
        this.bookingDay = day;
        this.totalCost = cost;         
        this.note = note;     
        this.appointDate = new Date();             
        
    }

     
    save()
    {
      
        const db = getDb();      
        return db.collection('appointments').insertOne(this);
                              
    }

    static fetchAllAppointments()
    {
        const db = getDb();
        return db.collection('appointments').find().sort({bookingDate:-1,bookingTime:-1}).toArray()
                            .then(appointData=>{
                               
                                return appointData;
                            })
                            .catch(err=>console.log(err));
    }

    static findAppointByID(appointId)
    {
        const db = getDb();
                            
        return db.collection('appointments').findOne({ appointmentId:appointId })
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAppointsBySaloonId(sid)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ saloonId:sid}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAppointsByEmpId(eid)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ empId:eid }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findCurrentAppointByEmpIdAndDateTime(eid,cDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ empId:eid,bookingDate:{$gte:cDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointsByClientPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ clientPhone:phone }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

  
    static findAppointByEmpIdAndDate(eid,bDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ empId:eid,bookingDate:bDate }).sort({bookingTime:1}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointByEmpIdAndDateTime(eid,bDate,srtTime,endTime)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ empId:eid,bookingDate:bDate,'bookingTime.srtTime':srtTime,'bookingTime.endTime':endTime}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }


    static findAppointBySaloonIdAndDate(sid, bDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ saloonId:sid,bookingDate:bDate }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }


    static findAppointByClientPhoneAndCDate(phone, cDate)
    {
        const db = getDb();
                                                                                                  //ascending order of booking date and booking time
        return db.collection('appointments').find({ clientPhone:phone,bookingDate:{$gte:cDate}  }).sort({bookingDate:1,bookingTime:1}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointByClientPhoneAndPDate(phone, cDate)
    {
        const db = getDb();
                                                                                              //descending order of booking date and booking time
        return db.collection('appointments').find({ clientPhone:phone,bookingDate:{$lt:cDate} }).sort({bookingDate:-1,bookingTime:-1}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

   
    static saloonWeekRevenue(sid, sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ saloonId:sid,bookingDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointsByDates(sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ bookingDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }


    static empWeekRevenue(eid, sDate,eDate)
    {
        const db = getDb();
                                                                                            //array of objects
        return db.collection('appointments').find({ empId:eid,bookingDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }


    static saloonGraphRevenue(sid, dates)
    {
        const db = getDb();
        var allRevenues = [];
        dates.forEach(d=>{
            // console.log(dates.length)
            let startDate = d.srtDate;
            startDate = new Date(startDate).getTime();
            // console.log(d.srtDate);
        
            let endDate = d.endDate;
            endDate = new Date(endDate).getTime();
            // console.log(d.endDate);  
           db.collection('appointments').find({ saloonId:sid,bookingDate:{$gte:startDate,$lte:endDate} }).toArray()
                                            .then(appointDetail=>{
                                                allRevenues.push(appointDetail.length);
                                                // console.log(allRevenues);         
                                                // return allRevenues;  
                                               
                                            })
                                            .catch(err=>console.log(err));
                            
                     
                                            
              })
              setTimeout(()=>{
                console.log(allRevenues);
                // return "1";
            },1000);
           
            return allRevenues;
}



}


module.exports = Appointment;

