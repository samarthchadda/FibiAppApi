
const Saloon = require('../models/saloon');
const Client = require('../models/client');
const Owner = require('../models/owner');
const Appointment = require('../models/appointment');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const Service = require('../models/services');

const Availability = require('../models/availability');

const getDb = require('../util/database').getDB; 

var NodeGeocoder = require('node-geocoder');
 
var geocoder = NodeGeocoder({
    provider: 'opencage',
    // provider: 'google',
    
  apiKey: process.env.GEOCODER_API_KEY,
   formatter: null // 
});

// (async () => {
//    const res = await geocoder.geocode('29 champs elysée paris');
    
//     console.log(res);
//   })();

var GeoPoint = require('geopoint');

exports.getSaloons=(req,res,next)=>{
  
    Saloon.fetchAllSaloons()
                .then(saloons=>{
                   
                    res.json({message:"All Data returned",allSaloons:saloons})

                })
                .catch(err=>console.log(err));
}

exports.getCounts=(req,res,next)=>{
  
    Saloon.fetchAllSaloons()
                .then(saloons=>{
                   
                    Owner.fetchAllOwners()
                    .then(owners=>{

                        Client.fetchAllClients()
                        .then(clients=>{

                            Appointment.fetchAllAppointments()
                            .then(appoints=>{
                                res.json({totalSaloons:saloons.length,totalOwners:owners.length,totalClients:clients.length,totalBookings:appoints.length})
                            })                          
                        })               
                    })
                  
                })
                .catch(err=>console.log(err));
}


exports.getSaloonsByMonth=(req,res,next)=>{
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
        Saloon.findSaloonByDates(startDate,endDate)
        .then(saloons=>{
            // console.log(saloons.length)
            allData.push({month:d.month.toString(),saloons:saloons.length})
            // console.log(allData)
            if(dates.length == allData.length)
            {   
                allData.sort((a, b) => {
                    return a.key - b.key;
                });
                res.json({message:"All Data returned",allSaloons:allData})
            }

        })
        .catch(err=>console.log(err));
    })
   
}


exports.getSaloonsAddress=(req,res,next)=>{
  
    let addSaloon;
    let address = [];

    Saloon.fetchAllSaloons()
                .then(saloons=>{         
                
                    saloons.forEach(s=>{
                                        //         street no. and name, city,state pincode,country          
                            //example -- 277 Bedford Ave, Brooklyn, NY 11211, USA
                        geocoder.geocode('Inox Pink square,raja park, jaipur')
                        .then((result)=> {
                            // console.log(result[0]);
                            addSaloon = {...s,lat:result[0].latitude,long:result[0].longitude}
                            // console.log(addSaloon);
                            address.push(addSaloon);
                                                   
                           if(saloons.length == address.length)
                           {
                               res.json({message:"All Data returned",allSaloons:address})       
                           }                               
                        })
                        .catch((err)=> {
                            console.log(err);
                         });                    
                    })                                 
                
                })
                .catch(err=>console.log(err));
}


exports.getSingleSaloonAddress=(req,res,next)=>{

    const saloonId = req.params.id;
    // console.log(phone);
    let address;

    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
                    .then(saloon=>{
                        if(!saloon)
                        {
                            return res.json({ message:'Saloon does not exist',data:null});
                        }

                        Service.findServicesBySaloonID(JSON.parse(saloonId))
                        .then(services=>{
                            if(services.length==0)
                            {
                                return res.json({ message:'Service does not exist',data:services});
                            }

                            Availability.findAvailBySaloonId(JSON.parse(saloonId))
                            .then(availDoc=>{
                               
                                if(availDoc){
                                   
                                    geocoder.geocode('Siliguri ,SubhasPally,West Bengal')
                                    .then((result)=> {
                                        // console.log(result)
                                        address = {...saloon,lat:result[0].latitude,long:result[0].longitude,services:services,availability:availDoc};
        
                                        res.json({message:"Saloon exists",data:address});                                            
                                    })
                                .catch((err)=> {
                                    console.log(err);
                                 });    
        
                                }
                                else{
                                    res.json({status:false,message:"No such availability exist"});
                                }          
                        
                            })    
                        })
                                              
                    })
}



exports.getLimitSaloons=(req,res,next)=>{
  
    const limit = +req.params.limit;
    console.log(limit);
    const start = +req.params.start;
    console.log(start);
    

    Saloon.fetchLimitSaloons(JSON.parse(+limit),JSON.parse(+start))
                .then(saloons=>{
                   
                    res.json({message:limit+" Saloons returned",allSaloons:saloons})

                })
                .catch(err=>console.log(err));
}



//POST
exports.saloonRegister = (req,res,next)=>{
  
    let saloonID;
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const saloonName = req.body.saloonName;
    const phone = +req.body.phone;    
    let landline = +req.body.landline;
    landline = landline.toString();
    const address = req.body.address;
    const fullAddressData = req.body.fullAddressData;
    console.log(fullAddressData);
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const deviceToken = req.body.deviceToken;
    const regDate = new Date().getTime();
    const ownerEmail = req.body.ownerEmail;
    var subscription = {customerId:'',subscribedData:null};
        
    var param = {};
    
    const photos = null;
    const isVerified = 0;
    console.log(isVerified, typeof(isVerified));
    
    // console.log(phone);
    if(!phone)
    {
        return res.json({status:false, message:'Enter Valid Phone Number'});
    }
    else{
    Saloon.findSaloonByPhone(phone)
                .then(saloonDoc=>{
                    if(saloonDoc){                        
                        return res.json({status:false, message:'Saloon Already Exists',saloon:saloonDoc});
                    }
                    if(phone==null)
                    {
                        return res.json({status:false, message:'Enter Valid Phone Number'});
                    }
                   
                    const db = getDb();     
                    db.collection('saloonCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        saloonID = newVal;
                        
                        db.collection('saloonCounter').insertOne({count:newVal})
                                .then(result=>{
                                              
                                    param.description = req.body.address;
                                    param.name = req.body.saloonName;
                                    // param.email = saloonID+"@gmail.com"
                                    param.email = saloonName;
                                    param.email = param.email.replace(/ /g, "");
                                    param.email = param.email +saloonID+"@gmail.com";
                                    param.address = {'city':fullAddressData.locality,'line1':req.body.address,'state':fullAddressData.adminArea,'postal_code':fullAddressData.postalCode,'country':fullAddressData.countryName};
                                    param.phone = phone;
                                                                        
                                    stripe.customers.create(param,function(err,customer){
                                        if(err){
                                            //   console.log("Error Occured : ",err);
                                            res.json({status:false,message:"Error Occured",error:err})
                                        }
                                        if(customer)
                                        {
                                              console.log("Customer Created : ",customer.id)
                                              subscription.customerId = customer.id
                                                                    
                                              const saloon = new Saloon(saloonID,ownerId,saloonName,phone,landline,address,photos,isVerified,latitude,longitude,regDate,subscription,-1,deviceToken);
                                              //saving in database
                                          
                                              return saloon.save()
                                              .then(resultData=>{
                                                  
                                                  res.json({status:true,message:"Saloon Registered",saloon:resultData["ops"][0]});
                                                  
                                              })
                                              .catch(err=>console.log(err));     
                                            // res.json({status:true,message:"Customer Created Successfully",customer:customer})
                                        }
                                        else
                                        {
                                            console.log("Something Wrong")
                                            // res.json({status:false,message:"Error Occured"})
                                        }
                                    })
              
                                                                     
                                  
                                })
                                .then(resultData=>{
                                   
                                })
                                .catch(err=>{
                                    res.json({status:false,error:err})
                                })             
                     })   

                })
                .then(resultInfo=>{                   
                  
                })
                .catch(err=>console.log(err));      
            }

}


exports.saloonsByOwner=(req,res,next)=>{

    const ownerId = req.params.id;
    // console.log(phone);

    Saloon.fetchSaloonsByOwnerID(JSON.parse(ownerId))
                    .then(saloons=>{
                        if(saloons.length==0)
                        {
                            return res.json({ message:'Saloon does not exist',data:saloons});
                        }

                        res.json({message:"All Saloons returned",data:saloons});
                    })

}


exports.getSingleSaloon=(req,res,next)=>{

    const saloonId = req.params.id;
    // console.log(phone);

    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
                    .then(saloon=>{
                        if(!saloon)
                        {
                            return res.json({ message:'Saloon does not exist',data:null});
                        }

                        res.json({message:"Saloon exists",data:saloon});
                    })

}


exports.getDiffSaloon=(req,res,next)=>{

    let curr = new Date();
    console.log("Current Date: ",curr,curr.getUTCDate(),curr.getUTCDay())
let week = []
for (let i = 1; i <= 7; i++) {
let first = curr.getUTCDate() -( curr.getUTCDay() || 7) + i 
console.log("First:",first);
let day = new Date(curr.setUTCDate(first)).toISOString().slice(0, 10);
console.log(day)
week.push(day)
}
console.log("Week : ",week);

    const latitude = +req.body.latitude;
    const longitude = +req.body.longitude;
    const range = +req.body.range;
    
    var point1 = new GeoPoint(latitude,longitude);

    let newSaloons = [];
    let checkData = [];

    var current = new Date();     // get current date    
    var weekstart = current.getUTCDate() - current.getUTCDay() +1;    
    console.log(weekstart)
    var weekend = weekstart + 6;       // end day is the first day + 6 
    var monday = new Date(current.setDate(weekstart));  
    // console.log("Monday:",monday)
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
    if(weekstart.toString().length == 1)
    {
        onlyDate1 = '0'+weekstart.toString(); 
    }
    else{
        onlyDate1 = weekstart.toString();
    }

    if(weekend.toString().length == 1)
    {
        onlyDate2 = '0'+weekend.toString(); 
    }
    else{
        onlyDate2 = weekend.toString(); 
    }
    
    
    // var date1  = monday.getUTCFullYear()+"-"+m1+"-"+onlyDate1;
    // var date2 = sunday.getUTCFullYear()+"-"+m2+"-"+onlyDate2;
    // console.log("Date :",date1,date2)
    // var date1 = new Date(date1).getTime();
    // var date2 = new Date(date2).getTime();
    // console.log(new Date(date1).getTime(),new Date(date2).getTime())
    
    var date1 = week[0];
    var date2 = week[6];
    var date1 = new Date(date1).getTime();
    var date2 = new Date(date2).getTime();
    
    Saloon.fetchAllSaloons()
    .then(saloons=>{
        
        saloons.forEach(saloon=>{
        //    console.log(saloon.saloonId)
        console.log(date1,date2);
            Availability.findAvailBySaloonIdAndDate(saloon.saloonId,date1,date2)
            .then(availData=>{
                console.log("saloon Id :"+saloon.saloonId,availData);
                var point2 = new GeoPoint(saloon.latitude,saloon.longitude);
                var distance = point1.distanceTo(point2, true)//output in kilometers
                // console.log(distance);
                console.log(+saloon.isVerified);
                
                    var newSaloon = {...saloon,distance:distance,availability:availData};
                    checkData.push(newSaloon);
                    if(distance<=range)
                    {
                        if(+saloon.isVerified == 1)
                        {
                     newSaloons.push(newSaloon);
                        }
                     console.log(newSaloons.length)
                    }    
                
             
                if(saloons.length == checkData.length)
                {
                     newSaloons.sort((a, b) => {
                         return a.distance - b.distance;
                     });
                     res.json({message:"All Data returned",allSaloons:newSaloons})
                }  
                if(saloons.length == 0)
                {
                    
                     res.json({message:"All Data returned",allSaloons:[]})
                }     

            })

           
            // console.log(newSaloons);
        })
      
    //    if(saloons.length == checkData.length)
    //    {
    //         newSaloons.sort((a, b) => {
    //             return a.distance - b.distance;
    //         });
    //         res.json({message:"All Data returned",allSaloons:newSaloons})
    //    }     
        
    })
    .catch(err=>console.log(err));

    // Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
    //                 .then(saloon=>{
    //                     if(!saloon)
    //                     {
    //                         return res.json({ message:'Saloon does not exist',data:null});
    //                     }
    //                     // distance.get(
    //                     //     {
    //                     //       index: 1,
    //                     //       origin: '37.772886,-122.423771',
    //                     //       destination: '37.871601,-122.269104'
    //                     //     },
    //                     //     function(err, data) {
    //                     //       if (err) return console.log(err);
    //                     //       console.log(data);
    //                     //     });
    //                     // var point1 = new GeoPoint(37.772886,-122.423771);
    //                     // var point2 = new GeoPoint(37.871601,-122.269104);
    //                     // var distance = point1.distanceTo(point2, true)//output in kilometers
    //                     // console.log(distance);
                            
    //                     res.json({message:"Saloon exists",data:saloon,distance:distance});
    //                 })
}



//LOGIN
exports.facultyLogin=(req,res,next)=>{
    const phone = req.body.phone;
    const pwd = req.body.pwd;
    Faculty.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',Status:false});
                    }

                    if(user.Password === pwd)
                    {                        
                        res.json({ message:'Login Successful',status:true,user:user});
                    }else{
                       
                        res.json({ message:'Login UnSuccessful....Password is incorrect',status:false});
                    }
                })

}


exports.phoneVerify=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const isVerified = +req.body.isVerified;
   
    Saloon.findSaloonBySaloonID(saloonId)
            .then(saloon=>{
                if(!saloon)
                {
                    return res.json({ message:'Saloon does not exist',status:false});
                }
                        
                 saloon.isVerified = isVerified;
                 
                 const db = getDb();
                 db.collection('saloons').updateOne({saloonId:saloonId},{$set:saloon})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}


exports.editSaloon=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const saloonName = req.body.saloonName;
    const address = req.body.address;
    const phone = +req.body.phone;
    let landline = +req.body.landline;
    landline = landline.toString();
    
   
    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
             .then(saloonDoc=>{
                 if(!saloonDoc)
                 {
                     return res.json({ message:'Saloon does not exist',status:false});
                 }

                //  Saloon.findSaloonByPhone(phone)
                //  .then(saloonDoc=>{
                //      if(saloonDoc){                        
                //          return res.json({status:false, message:'Phone Already Exists',saloon:saloonDoc});
                //      }
                     
                 saloonDoc.saloonName = saloonName;
                 saloonDoc.address = address;
                 saloonDoc.phone = phone;
                 saloonDoc.landline = landline;
                 
                 
                 const db = getDb();
                 db.collection('saloons').updateOne({saloonId:saloonId},{$set:saloonDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })

                    // })
                

}




exports.delSaloonPhoto=(req,res,next)=>{

    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const imageUrl = req.body.imageUrl;

    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
             .then(saloonDoc=>{
                 if(!saloonDoc)
                 {
                     return res.json({ message:'Saloon does not exist',status:false});
                 }
                
                 let index = saloonDoc.saloonPhotos.indexOf(imageUrl);
                 console.log(index);
                 saloonDoc.saloonPhotos.splice(index,1);
                 
                 const db = getDb();
                 db.collection('saloons').updateOne({saloonId:saloonId},{$set:saloonDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Saloon photo deleted',status:true});
                             })
                             .catch(err=>console.log(err));
             })
}


exports.delSaloon=(req,res,next)=>{

    const saloonId = +req.params.saloonId;

    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
                    .then(saloon=>{
                        if(!saloon)
                        {
                            return res.json({ message:'Saloon does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('saloons').deleteOne({saloonId:saloonId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Saloon Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}
