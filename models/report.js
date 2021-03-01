const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Report
{
    constructor(name,email,phone,description,screenShot,date)
    {        
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.description = description;  
        this.screenShot = screenShot;
        this.reportDate = date;
      
    }


    save()
    {
        const db = getDb();
        return db.collection('reports').insertOne(this);
                              
    }

    static findReportByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('reports').findOne({ email:email })
                                            .then(report=>{                                                
                                                
                                                return report;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findReportByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('reports').findOne({ phone:phone })
                                            .then(report=>{                                                
                                                
                                                return report;  
                                            })
                                            .catch(err=>console.log(err));

    }

  
    static fetchAllReports()
    {
        const db = getDb();
        return db.collection('reports').find().sort({reportDate:-1}).toArray()
                            .then(reportData=>{
                               
                                return reportData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Report;

