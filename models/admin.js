const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Admin
{
    constructor(fname,lname,email,password,phone,token)
    {
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;        
        this.password = password;
        this.phone = phone;
        this.token = token;
      
    }


    save()
    {
        const db = getDb();
        return db.collection('admins').insertOne(this);
                              
    }

    static findAdminByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('admins').findOne({ email:email })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAdminByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('admins').findOne({ phone:phone })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static fetchAllAdmins()
    {
        const db = getDb();
        return db.collection('admins').find().toArray()
                            .then(ownerData=>{
                               
                                return ownerData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Admin;

