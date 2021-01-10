const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Saloon
{
    constructor(sid,oid,name,phone,landline,address,photos,isVerified,lat,long,date,subs)
    {
        this.saloonId = sid;   
        this.ownerId = oid;            
        this.saloonName = name; 
        this.phone = phone;
        this.landline = landline;
        this.address = address;
        this.saloonPhotos = [];
        this.isVerified = isVerified;
        this.latitude = lat;
        this.longitude = long;
        this.registrationDate = date;
        this.subscription = subs;
    }

   
    save()
    {
        const db = getDb();
        return db.collection('saloons').insertOne(this);
                              
    }
    

    static findSaloonByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('saloons').findOne({ phone:phone })
                                            .then(saloon=>{
                                                                                                
                                                return saloon;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findSaloonByDates(sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('saloons').find({ registrationDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findSaloonBySaloonID(id)
    {
        const db = getDb();
                            
        return db.collection('saloons').findOne({ saloonId:id })
                                            .then(saloon=>{
                                                                                                
                                                return saloon;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findSaloonByCustomerId(customerId)
    {
        const db = getDb();
                            
        return db.collection('saloons').findOne({'subscription.customerId':customerId })
                                            .then(owner=>{                                               
                                                
                                                return owner;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findSaloonBySaloonNameAddressPhone(phone,name,address)
    {
        const db = getDb();
                            
        return db.collection('saloons').findOne({ phone:phone,saloonName:name,address:address })
                                            .then(saloon=>{
                                                                                                
                                                return saloon;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllSaloons()
    {
        const db = getDb();
        return db.collection('saloons').find().toArray()
                            .then(saloonData=>{
                               
                                return saloonData;
                            })
                            .catch(err=>console.log(err));
    }

    static fetchLimitSaloons(limit,start)
    {
        
        const db = getDb();
        return db.collection('saloons').find({saloonId:{$gte:start}},{limit:limit}).toArray()
                            .then(saloonData=>{
                               
                                return saloonData;
                            })
                            .catch(err=>console.log(err));
    }

    
    static fetchSaloonsByOwnerID(id)
    {
        const db = getDb();
        return db.collection('saloons').find({ownerId:id}).toArray()
                            .then(saloonData=>{
                               
                                return saloonData;
                            })
                            .catch(err=>console.log(err));
    } 

}

module.exports = Saloon;

