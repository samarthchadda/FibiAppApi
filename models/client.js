const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Client
{
    constructor(id,name,phone,email,pwd,img,token,date)
    {
        this.clientId = id;
        this.clientName = name;
        this.phone = phone;
        this.email = email;        
        this.password = pwd;
        this.clientImg = img;
        this.favourites = [];
        this.deviceToken = token;
        this.registrationDate = date;
      
    }


    save()
    {
        const db = getDb();
        return db.collection('clients').insertOne(this);
                              
    }

    static findClientByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('clients').findOne({ email:email })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findClientByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('clients').findOne({ phone:phone })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static findClientByDates(sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('clients').find({ registrationDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                            //    console.log(appointDetail)                                                 
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findClientByClientId(id)
    {
        const db = getDb();
                            
        return db.collection('clients').findOne({ clientId:id })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static fetchAllClients()
    {
        const db = getDb();
        return db.collection('clients').find().toArray()
                            .then(ownerData=>{
                               
                                return ownerData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Client;

