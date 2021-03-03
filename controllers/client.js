
const Client = require('../models/client');

const Saloon = require('../models/saloon');

const Availability = require('../models/availability');

const getDb = require('../util/database').getDB; 


//POST
// exports.clientRegister = (req,res,next)=>{
  
//     let clientID;
//     //parsing data from incoming request
//     const clientName = req.body.clientName;
//     const phone = +req.body.phone;
//     const email = req.body.email;    
//     const password = req.body.password;
//     const image = null;

//     Client.findClientByEmail(email)
//                 .then(userDoc=>{
//                     if(userDoc){                        
//                         return res.json({status:false, message:'Client Already Exists'});
//                     }
                   
//                     const db = getDb();     
//                     db.collection('clientCounter').find().toArray().then(data=>{
        
//                         newVal = data[data.length-1].count;
                       
//                         newVal = newVal + 1;
//                         console.log(newVal);
                       
//                         clientID = newVal;
                        
//                         db.collection('clientCounter').insertOne({count:newVal})
//                                 .then(result=>{
                                              
//                             const client = new Client(clientID,clientName,phone,email,password,image);
//                             //saving in database
                        
//                             return client.save()
//                             .then(resultData=>{
                                
//                                 res.json({status:true,message:"Client Registered",client:resultData["ops"][0]});
                                
//                             })
//                             .catch(err=>console.log(err));                                                    
                                  
//                                 })
//                                 .then(resultData=>{
                                   
//                                 })
//                                 .catch(err=>{
//                                     res.json({status:false,error:err})
//                                 })             
//                      })   

//                 })
//                 .then(resultInfo=>{                   
                  
//                 })
//                 .catch(err=>console.log(err));      
// }




exports.getClients=(req,res,next)=>{
  
    Client.fetchAllClients()
                .then(owners=>{
                   
                    res.json({message:"All Data returned",allClients:owners})

                })
                .catch(err=>console.log(err));
}

exports.getSingleClient=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Client.findClientByClientId(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Client does not exist',data:null});
                    }

                    res.json({status:true, message:'Client exists',client:appoint});
                })

}


//LOGIN
exports.clientLogin=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    Client.findClientByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Client does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, client:user});
                    }else{
                       
                        res.json({ message:'Login Unsuccessful....Password is incorrect',status:false});
                    }
                })
}


exports.getClientsByMonth=(req,res,next)=>{
    var monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    var today = new Date();
    // var today = new Date();
    var d;
    var months = [];
    var d = new Date();
    var month;
    var year = d.getFullYear();
    // console.log(year)

        //for last 6 months(including current month)
    // for(var i = 5; i > -1; i -= 1) {
        var keyData = 1;
        //for last 6 months(excluding current month)
    for(var i = 6; i > 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    //   console.log(d.getFullYear())
   
      months.push({month:monthNames[d.getMonth()],year:d.getFullYear(),key:keyData});
      keyData = keyData+1;
    //   console.log(keyData)
         month = monthNames[d.getMonth()];
         console.log(months)
//   console.log(month,d.getFullYear());
//   year = d.getFullYear();

    //   year = d.getFullYear();
    //   console.log(year)
    //   console.log(month);
    }
    // console.log(months)
    let dates = [];
    months.forEach(m=>{
        
        if(m.month=="january")
        {
            mo = 0;
        }
        if(m.month=="february")
        {
            mo = 1;
        }
        if(m.month=="march")
        {
            mo = 2;
        }
        if(m.month=="april")
        {
            mo = 3;
        }
        if(m.month=="may")
        {
            mo = 4;
        }
        if(m.month=="june")
        {
            mo = 5;
        }
        if(m.month=="july")
        {
            mo = 6;
        }
        if(m.month=="august")
        {
            mo = 7;
        }
        if(m.month=="september")
        {
            mo = 8;
        }
        if(m.month=="october")
        {
            mo = 9;
        }
        if(m.month=="november")
        {
            mo = 10;
        }
        if(m.month=="december")
        {
            mo = 11;
        }
        
        
        const firstDay = new Date(m.year, mo, 1);
        // alert(firstDay.getDate());
        const lastDay = new Date(m.year, mo + 1, 0);
        // alert(lastDay.getDate());
        // console.log(firstDay,lastDay)
        mo = mo+1;
        mo = mo<10?"0"+mo:mo; 
        // console.log(year)  
        dates.push({
                        srtDate: firstDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+firstDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+firstDay.getDate().toString(),
                        endDate: lastDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+lastDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+lastDay.getDate().toString(),
                        month:mo
                    });
  
    })
    // console.log(dates)
    var allData = [];
    dates.forEach(d=>{
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(startDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        console.log(startDate,endDate)
        Client.findClientByDates(startDate,endDate)
        .then(saloons=>{
            // console.log(saloons.length)
            allData.push({month:d.month.toString(),clients:saloons.length})
            // console.log(allData)
            if(dates.length == allData.length)
            {   
                allData.sort((a, b) => {
                    return a.key - b.key;
                });
                res.json({message:"All Data returned",allClients:allData})
            }

        })
        .catch(err=>console.log(err));
    })
   
}



exports.clientCheckEmail=(req,res,next)=>{
    const email = req.body.email;

    Client.findClientByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.clientCheckPhone=(req,res,next)=>{
    const phone = +req.body.phone;

    Client.findClientByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.clientFavSaloon=(req,res,next)=>{
    const clientId = +req.body.clientId;
    const saloonId = +req.body.saloonId;
   
    Client.findClientByClientId(clientId)
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }
                
                 let index = clientDoc.favourites.indexOf(saloonId)
                 
                 if(index!=-1)
                 {
                    clientDoc.favourites.splice(index,1)
                    const db = getDb();
                    db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                .then(resultData=>{
                                    
                                    res.json({message:'Removed from favourites',status:true,client:clientDoc});
                                })
                                .catch(err=>console.log(err));
                   
                 }
                 else{
                    clientDoc.favourites.push(saloonId);
                 
                    const db = getDb();
                    db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                .then(resultData=>{
                                    
                                    res.json({message:'Add to favourites',status:true,client:clientDoc});
                                })
                                .catch(err=>console.log(err));
                 }

            
             })
}



exports.getFavSaloons=(req,res,next)=>{
    
    const clientId = +req.params.clientId;

    
    var current = new Date();     // get current date    
    var weekstart = current.getUTCDate() - current.getUTCDay() +1;    
    var weekend = weekstart + 6;       // end day is the first day + 6 
    var monday = new Date(current.setDate(weekstart));  
    var sunday = new Date(current.setDate(weekend));
    // console.log(new Date(monday).getTime(),new Date(sunday).getTime())
    // console.log(monday.getFullYear()+"-"+monday.getMonth()+"-"+monday.getDate())
    // console.log(sunday.getFullYear()+"-"+sunday.getMonth()+"-"+sunday.getDate())
    if(monday.getUTCMonth().toString().length==1 && monday.getUTCMonth()!=9)
    {
        var m1 = "0"+(monday.getUTCMonth()+1);
    }
    if(sunday.getUTCMonth().toString().length==1 && sunday.getUTCMonth()!=9)
    {
        var m2 = "0"+(sunday.getUTCMonth()+1);
    }
    if(monday.getUTCMonth()>=9)
    {
        var m1 = (monday.getUTCMonth()+1);
    }
    if(sunday.getUTCMonth()>=9)
    {
        var m2 = (sunday.getUTCMonth()+1);
    }
    var onlyDate1 = '';
    var onlyDate2 = '';
    if(monday.getUTCDate().toString().length == 1)
    {
        onlyDate1 = '0'+monday.getUTCDate().toString(); 
    }
    else{
        onlyDate1 = monday.getUTCDate().toString();
    }

    if(sunday.getUTCDate().toString().length == 1)
    {
        onlyDate2 = '0'+sunday.getUTCDate().toString(); 
    }
    else{
        onlyDate2 = sunday.getUTCDate().toString(); 
    }
    
    
    var date1  = monday.getUTCFullYear()+"-"+m1+"-"+onlyDate1;
    var date2 = sunday.getUTCFullYear()+"-"+m2+"-"+onlyDate2;
    var date1 = new Date(date1).getTime();
    var date2 = new Date(date2).getTime();
    // console.log(new Date(date1).getTime(),new Date(date2).getTime())

   
    Client.findClientByClientId(JSON.parse(clientId))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Client does not exist'});
                    }

                    let saloonDataArr = [];
                    if( appoint.favourites.length>0)
                    {
                    appoint.favourites.forEach(fav=>{
                        Saloon.findSaloonBySaloonID(+fav)
                        .then(saloonData=>{
                            Availability.findAvailBySaloonIdAndDate(saloonData.saloonId,date1,date2)
                            .then(availData=>{
                                // console.log("Avail Data : ",availData)
                                saloonDataArr.push({...saloonData,availability:availData})
                                // console.log(saloonDataArr)
                                if(saloonDataArr.length==appoint.favourites.length)
                                {
                                    res.json({status:true, message:'Client exists',favourites:appoint.favourites,favSaloons:saloonDataArr});
                                }
                            })
                           
                        })                      

                    })
                }else{
                    res.json({status:true, message:'Client exists',favourites:[],favSaloons:[]});
                }
                    

                })

}



exports.editClientDetails=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const clientName = req.body.clientName;
    const email = req.body.email;
    const phone = +req.body.phone;  
   
    Client.findClientByClientId(clientId)
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }
                 Client.findClientByPhone(phone)
                        .then(client=>{
                            console.log("ClientDoc:",clientDoc);
                            console.log("Client : ",client);
                            if(client!=null)
                            {
                            if(clientDoc.phone == client.phone)
                            {
                                if(clientDoc.email==client.email)
                                {
                                    clientDoc.clientName = clientName;
                                    
                                    const db = getDb();
                                    db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                                .then(resultData=>{
                                                    
                                                   return res.json({message:'Details Updated',status:true});
                                                })
                                                .catch(err=>console.log(err));
                                }
                                else{
                                    clientDoc.email = email;
                                    const db = getDb();
                                db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                            .then(resultData=>{
                                                
                                             return res.json({message:'Details Updated',status:true});
                                            })
                                            .catch(err=>console.log(err));
                                    }
                            }
                            else if(clientDoc.email == client.email)
                            {
                                clientDoc.clientName = clientName;
                                    
                                const db = getDb();
                                db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                            .then(resultData=>{
                                                
                                               return res.json({message:'Details Updated',status:true});
                                            })
                                            .catch(err=>console.log(err));
                            }
                            else{                        
                                return res.json({status:false, message:'Phone Already Exists'});
                            }
                        }

                            Client.findClientByEmail(email)
                            .then(client=>{
                                if(client)
                                {
                                    return res.json({status:false, message:'Email Already Exists'});
                                   
                                }
                                                      
                                else if(client){                        
                                    if(clientDoc.email == client.email)
                                    {
                                            clientDoc.clientName = clientName;
                                            clientDoc.phone = phone;
                                            
                                            const db = getDb();
                                            db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                                        .then(resultData=>{
                                                            
                                                           return res.json({message:'Details Updated',status:true});
                                                        })
                                                        .catch(err=>console.log(err));                                  
                                    }     
                                }
                                else{

                            clientDoc.clientName = clientName;
                            clientDoc.email = email;
                            clientDoc.phone = phone;
                            
                            const db = getDb();
                            db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                        .then(resultData=>{
                                            
                                            res.json({message:'Details Updated',status:true});
                                        })
                                        .catch(err=>console.log(err));
                                    }
                        })

                            })

                            
                
             })
}





exports.editClientEmail=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const email = req.body.email;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                 Client.findClientByEmail(email)
                 .then(client=>{
                     if(client)
                     {
                         return res.json({ message:'Email already exists',status:false});
                     }
                     
                     clientDoc.email = email;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    })                
             })
}



exports.editClientPhone=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const phone = +req.body.phone;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                Client.findClientByPhone(phone)
                .then(client=>{
                    if(client){                        
                        return res.json({status:false, message:'Phone Already Exists'});
                    }
                    clientDoc.phone = phone;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                });
                     
                    // })                
             })
}



exports.editClientToken=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const deviceToken = req.body.deviceToken;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                     clientDoc.deviceToken = deviceToken;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                               
             })
}



exports.delClientPhoto=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.params.clientId;
   console.log(clientId);
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                     clientDoc.clientImg = null;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                               
             })
}



exports.editClientName=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const clientName = req.body.clientName;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                     clientDoc.clientName = clientName;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    // })                
             })
}



exports.clientResetPwd=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    Client.findClientByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }

                    user.password = password;
                   
                    const db = getDb();
                    db.collection('clients').updateOne({email:email},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password successfully changed',status:true,user:user});
                                })
                                .catch(err=>console.log(err));
                })
}



exports.delClient=(req,res,next)=>{

    const clientId = +req.params.clientId;

    Client.findClientByClientId(JSON.parse(clientId))
                    .then(client=>{
                        if(!client)
                        {
                            return res.json({ message:'Client does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('clients').deleteOne({clientId:clientId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Client Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}
