const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Owner
{
    constructor(id,name,email,phone,pwd,img,isVerified,date,token,subs)
    {
        this.ownerId = id;
        this.ownerName = name;
        this.email = email;        
        this.phone = phone;
        this.password = pwd;
        this.ownerImg = img;
        this.isVerified = isVerified;
        this.registrationDate = date;
        this.deviceToken = token;
        this.subscription = subs;
        //image -- initially null at create ,   now API for edit image
      
    }


    save()
    {
        const db = getDb();
        return db.collection('owners').insertOne(this);
                              
    }

    static findOwnerByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('owners').findOne({ email:email })
                                            .then(owner=>{                                                
                                                
                                                return owner;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findOwnerByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('owners').findOne({phone:phone })
                                            .then(owner=>{                                               
                                                
                                                return owner;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findOwnerById(id)
    {
        const db = getDb();
                            
        return db.collection('owners').findOne({ ownerId:id })
                                            .then(owner=>{                                                
                                                
                                                return owner;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllOwners()
    {
        const db = getDb();
        return db.collection('owners').find().toArray()
                            .then(ownerData=>{
                               
                                return ownerData;
                            })
                            .catch(err=>console.log(err));
    }


}


module.exports = Owner;

