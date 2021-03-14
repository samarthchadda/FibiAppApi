const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Version
{
    constructor(vName)
    {
        this.versionName = vName;
        // this.versionDate = new Date();
    }

    // save()
    // {
    //     const db = getDb();
    //     return db.collection('version').insertOne(this);
                              
    // }

    static fetchAppVersion()
    {
        const db = getDb();
        return db.collection('version').find().toArray()
                            .then(ownerData=>{
                               
                                return ownerData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Version;

