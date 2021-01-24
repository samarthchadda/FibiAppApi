const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Notifications
{
    constructor(id,sid,cid,message,date)
    {
        this.notificationId = id;
        this.saloonId = sid;
        this.clientId = cid;
        this.message = message;
        this.date = date;             
    }


    save()
    {
        const db = getDb();
        return db.collection('notifications').insertOne(this);                              
    }

    static findNotificationByNotificationId(id)
    {
        const db = getDb();
                            
        return db.collection('notifications').findOne({ notificationId:id })
                                            .then(avail=>{
                                                                                                                                               
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }
    
    static findNotificationByClientId(cid)
    {
        const db = getDb();
                            
        return db.collection('notifications').find({ clientId:cid }).toArray()
                                            .then(avail=>{
                                                                                                                                               
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }
        
    static findNotificationBySaloonId(sid)
    {
        const db = getDb();
                            
        return db.collection('notifications').find({ saloonId:sid }).toArray()
                                            .then(avail=>{
                                                                                                                                               
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    
    static findAvailByEmpIdAndSingleDate(id,sDate)
    {
        const db = getDb();
                            
        return db.collection('notifications').findOne({ empId:id ,startDate:{$lte:sDate},endDate:{$gte:sDate}})
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

   
    static fetchAllClientNotifications()
    {
        const db = getDb();
        return db.collection('notifications').find({saloonId:null}).toArray()
                            .then(avails=>{
                               
                                return avails;
                            })
                            .catch(err=>console.log(err));
    }

    static fetchAllSaloonNotifications()
    {
        const db = getDb();
        return db.collection('notifications').find({clientId:null}).toArray()
                            .then(avails=>{
                               
                                return avails;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Notifications;

