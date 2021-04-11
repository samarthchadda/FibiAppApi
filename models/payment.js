const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Payment
{
    constructor(id,status)
    {
        this.paymentId = id;
        this.status = status;
    }


    save()
    {
        const db = getDb();
        return db.collection('payments').insertOne(this);
                              
    }

    static findPaymentByPaymentId(id)
    {
        const db = getDb();
                            
        return db.collection('payments').findOne({ paymentId:id })
                                            .then(payment=>{                                                
                                                
                                                return payment;  
                                            })
                                            .catch(err=>console.log(err));

    }

 
    static fetchAllPayments()
    {
        const db = getDb();
        return db.collection('payments').find().toArray()
                            .then(paymentData=>{
                               
                                return paymentData;
                            })
                            .catch(err=>console.log(err));
    }
    
}


module.exports = Payment;

