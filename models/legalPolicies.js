const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class LegalPolicies
{
    constructor(id,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12)
    {
        this.id =id;
        this.privacyPolicyClientOwnerEng = p1;
        this.privacyPolicyClientOwnerEs = p2;
        this.legalNoticeClientOwnerEng = p3;
        this.legalNoticeClientOwnerEs = p4;        
        this.tcClientEng = p5;
        this.tcOwnerEng = p6;
        this.tcClientEs = p7;
        this.tcOwnerEs = p8;
        this.cookieClientOwnerEng = p9;
        this.cookieClientOwnerEs = p10;
        this.infoClientOwnerEng = p11;
        this.infoClientOwnerEs = p12;
      
    }


    save()
    {
        const db = getDb();
        return db.collection('legalPolicies').insertOne(this);                              
    }

    static findlegalPolicyById(id)
    {
        const db = getDb();
                            
        return db.collection('legalPolicies').findOne({ id:id })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }

    
    static fetchAllPolicies()
    {
        const db = getDb();
        return db.collection('legalPolicies').find().toArray()
                            .then(ownerData=>{
                               
                                return ownerData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = LegalPolicies;

