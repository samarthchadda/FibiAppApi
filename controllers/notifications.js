const Notification = require('../models/notifications');
const getDb = require('../util/database').getDB; 


exports.postClientNotiData = (req,res,next)=>{
    
    let notificationId;
    //parsing data from incoming request
    let saloonId = null;   
    let clientId = +req.body.clientId; 
    let message = req.body.message;
    let date = req.body.date; 
    date = new Date(date).getTime();
    console.log(date);

    let newVal;
    const db = getDb();     
    db.collection('notiCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        notificationId = newVal;
        
        db.collection('notiCounter').insertOne({count:newVal})
                .then(result=>{

                    // Saloon.findSaloonBySaloonID(saloonId)
                    // .then(saloon=>{
                    //     if(!saloon){                        
                    //         return res.json({status:false, message:'Saloon does not exist'});
                    //     }

                        const notification = new Notification(notificationId,saloonId,clientId,message,date);
                        //saving in database
                       
                        return notification.save()
                        .then(resultData=>{
                            
                            res.json({status:true,message:"Notification Added",notification:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));     

                    // }).catch(err=>console.log(err));                                
                  
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })        
   
}


exports.postSaloonNotiData = (req,res,next)=>{
    
    let notificationId;
    //parsing data from incoming request
    let saloonId = +req.body.saloonId;   
    let clientId = null; 
    let message = req.body.message;
    let date = req.body.date; 
    date = new Date(date).getTime();
    console.log(date);

   
    let newVal;
    const db = getDb();     
    db.collection('notiCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        notificationId = newVal;
        
        db.collection('notiCounter').insertOne({count:newVal})
                .then(result=>{

                    // Saloon.findSaloonBySaloonID(saloonId)
                    // .then(saloon=>{
                    //     if(!saloon){                        
                    //         return res.json({status:false, message:'Saloon does not exist'});
                    //     }

                        const notification = new Notification(notificationId,saloonId,clientId,message,date);
                        //saving in database
                       
                        return notification.save()
                        .then(resultData=>{
                            
                            res.json({status:true,message:"Notification Added",notification:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));     

                    // }).catch(err=>console.log(err));                                
                  
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })        
 
}

exports.getAllClientNotications = (req,res,next)=>{

    Notification.fetchAllClientNotifications()
                .then(services=>{
                   
                    res.json({message:"All Data returned",notifications:services})

                })
                .catch(err=>console.log(err));

}


exports.getSingleClientNotifications = (req,res,next)=>{

    const clientId = +req.params.clientId;
   
    Notification.findNotificationByClientId(+clientId)
    .then(serviceDoc=>{
       
        if(serviceDoc.length>0){
           
             res.json({status:true, notifications:serviceDoc});
        }
        else{
            res.json({status:false,message:"No Notifications exist", notifications:serviceDoc});
        }          

    })   

}


exports.getAllSaloonNotications = (req,res,next)=>{

    Notification.fetchAllSaloonNotifications()
                .then(services=>{
                   
                    res.json({message:"All Data returned",notifications:services})

                })
                .catch(err=>console.log(err));

}


exports.getSingleSaloonNotifications = (req,res,next)=>{

    const saloonId = +req.params.saloonId;
   
    Notification.findNotificationBySaloonId(+saloonId)
    .then(serviceDoc=>{
       
        if(serviceDoc.length>0){
           
             res.json({status:true, notifications:serviceDoc});
        }
        else{
            res.json({status:false,message:"No Notifications exist", notifications:serviceDoc});
        }          

    })   

}


exports.delNotification=(req,res,next)=>{

    const notificationId = +req.params.notificationId;

    Notification.findNotificationByNotificationId(+notificationId)
                    .then(service=>{
                        if(!service)
                        {
                            return res.json({ message:'Notification does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('notifications').deleteOne({notificationId:notificationId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Notification Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}



var request = require('request');

exports.sendPushNotification = (req,res,next)=>{
    let content = req.body.content;
    let playerId = req.body.playerId;

    var myJSONObject = {
        "app_id": process.env.ONE_SIGNAL_APP_ID,
        "include_player_ids": [],
        "data": {"foo": "Title101"},
        "contents": {"en": "APPOINTMENT CANCELLED\nEmployee Deleted"}
      };
      myJSONObject["contents"] = {"en":content};
      console.log(myJSONObject["contents"]);
   myJSONObject["include_player_ids"]=[playerId];
   request({
       url: "https://onesignal.com/api/v1/notifications",
       method: "POST",
       json: true,   // <--Very important!!!
       body: myJSONObject,
       headers:{
           'Content-Type': 'application/json',
          'Authorization': process.env.ONE_SIGNAL_AUTHORIZATION
       }
   }, function (error, response, body){
       if(response)
       {
        //    console.log(response);
           return res.json({message:"Notification sent sucessfully",status:true})
       }
     
       if(error)
       {
        //    console.log(error)
           return res.json({message:"Notification not sent", err:error,status:false})
       }
       if(body)
       {
        //    console.log(body)
           return res.json({message:"Notification sent sucessfully",status:true})
       }
      
       
   });
  

}