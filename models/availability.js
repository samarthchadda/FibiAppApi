const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Availability
{
    constructor(id,sid,status,timeslot,startDate,endDate)
    {
        this.empId = id;
        this.saloonId = sid;
        this.availStatus = status;
        this.timeslot = timeslot;
        this.startDate = startDate;
        this.endDate = endDate;                       
    }


    save()
    {
        const db = getDb();
        return db.collection('availabilities').insertOne(this);
                              
    }

    
    static findAvailByEmpId(id)
    {
        const db = getDb();
                            
        return db.collection('availabilities').find({ empId:id }).toArray()
                                            .then(avail=>{
                                                                                                                                               
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }
        
    static findAvailBySaloonId(id)
    {
        const db = getDb();
                            
        return db.collection('availabilities').find({ saloonId:id }).toArray()
                                            .then(avail=>{
                                                                                                                                               
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAvailByEmpIdAndDate(id,sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ empId:id ,startDate:sDate,endDate:eDate})
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    
    static findAvailByEmpIdAndSingleDate(id,sDate)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ empId:id ,startDate:{$lte:sDate},endDate:{$gte:sDate}})
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAvailBySaloonIdAndSingleDate(id,sDate)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ saloonId:id ,startDate:{$lte:sDate},endDate:{$gte:sDate}})
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    
    static findAvailBySaloonIdAndDate(id,sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ saloonId:id ,endDate:eDate})
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

 
    static fetchAllEmpAvails()
    {
        const db = getDb();
        return db.collection('availabilities').find({saloonId:null}).toArray()
                            .then(avails=>{
                               
                                return avails;
                            })
                            .catch(err=>console.log(err));
    }

    static fetchAllSaloonAvails()
    {
        const db = getDb();
        return db.collection('availabilities').find({empId:null}).toArray()
                            .then(avails=>{
                               
                                return avails;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Availability;

