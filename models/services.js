const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;


class Services
{
   
    constructor(serviceId,saloonId,name,cost,time,description)
    {
        this.serviceId = serviceId;
        this.saloonId = saloonId;        
        this.serviceName = name;
        this.cost = cost;
        this.time = time;
        this.description = description;
        
    }

    
    save()
    {
        const db = getDb();
        return db.collection('services').insertOne(this);
                              
    }

    static fetchAllServices()
    {
        const db = getDb();
        return db.collection('services').find().toArray()
                            .then(services=>{
                               
                                return services;
                            })
                            .catch(err=>console.log(err));
    }

    static findServicesBySaloonID(id)
    {
        const db = getDb();
                            
        return db.collection('services').find({ saloonId:id}).toArray()
                                            .then(saloonData=>{
                                                                                                
                                                return saloonData;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findServiceByServiceID(id)
    {
        const db = getDb();
                            
        return db.collection('services').findOne({ serviceId:id })
                                            .then(service=>{
                                                                                                
                                                return service;  
                                            })
                                            .catch(err=>console.log(err));

    }

   

}


module.exports = Services;

