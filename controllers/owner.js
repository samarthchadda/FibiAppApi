
const Owner = require('../models/owner');

const getDb = require('../util/database').getDB; 

const Employee = require('../models/employee');

const Saloon = require('../models/saloon')

const stripe = require('stripe')('sk_test_51I4o2BEEiYQYyt5L1v76GKo0DFSGfDhXIXIKyZa2zppPybs02wdkQOF2vXp6xTsiHdCmWGBsQlOxlqE0s7PHNOiR00b98mLMmG');

// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//         user: 'samarthchadda@zohomail.com',
//         pass: 'q6v2Li0L8CAn'
//     }
// });

// var mailOptions = {
//     from: '"Our Code World " <samarthchadda@gmail.com>', // sender address (who sends)
//     to: 'samarthchadda@gmail.com', // list of receivers (who receives)
//     subject: 'Hello', // Subject line
//     text: 'Hello world ', // plaintext body
//     html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
// };

// // send mail with defined transport object
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }

//     console.log('Message sent: ' + info.response);
 // });


// client Id = 1000.S1B7TJAEGYE7WP33H9WHUR9Y5K8U3W
// client secret = 485c422708fe85a5a85dcf75cc5f25a6d43c2c113a


const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
        
    }
}))


exports.getOwners=(req,res,next)=>{
  
    Owner.fetchAllOwners()
                .then(owners=>{
                   
                    res.json({message:"All Data returned",allOwners:owners})

                })
                .catch(err=>console.log(err));
}

exports.createCustomer=(req,res,next)=>{
  
    // const customer =  stripe.customers.create({
    //   description: 'My First Test Customer (created for API docs)',
    // });

    var param = {};
    //   param.email = "sam@gmail.com";
    //   param.name = "Mike";
    param.email = req.body.email;
    param.name = req.body.name;
      
      stripe.customers.create(param,function(err,customer){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
          }
          if(customer)
          {
            //   console.log("Customer Created : ",customer)
            res.json({status:true,message:"Customer Created Successfully",customer:customer})
          }
          else
          {
              console.log("Something Wrong")
            // res.json({status:false,message:"Error Occured"})
          }
      })
      
}


exports.getCustomers=(req,res,next)=>{
  
    // var param = {};
    //   param.email = "sam@gmail.com";
    //   param.name = "Mike";
    const customerId = req.body.customerId;
      //'cus_IhbWWO3RBDXpDc'
      stripe.customers.retrieve(customerId,function(err,customer){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
        }
          if(customer)
          {
            //   console.log("Customer : ",customer)
            res.json({status:true,customer:customer})
          }
          else{
              console.log("Something Wrong")
          }
      })
      
}



exports.getProducts=(req,res,next)=>{
  
  
    stripe.products.list(function(err,products){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
        }
          if(products)
          {
              var newArr = [];
              
            products.data.forEach(prod=>{
                var newData = {...prod}
                console.log(prod.description)
            })
            //   console.log("Customer : ",customer)
            res.json({status:true,products:products})
          }
          else{
              console.log("Something Wrong")
          }
      })
      
}


exports.createProduct=(req,res,next)=>{
  
    // const customer =  stripe.customers.create({
    //   description: 'My First Test Customer (created for API docs)',
    // });

    var param = {};
     
      param.name = req.body.name;
      param.description = req.body.description;
      
      stripe.products.create(param,function(err,product){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
          }
          if(product)
          {
            //   console.log("Product Created : ",product);
            res.json({status:true,message:"Product Created Successfully",product:product})
          }
          else{
              console.log("Something Wrong")
          }
      })
      
}


exports.createPrice=(req,res,next)=>{
  
    // const customer =  stripe.customers.create({
    //   description: 'My First Test Customer (created for API docs)',
    // });

    var param = {};
    //"prod_IfWWt8XiUpit3V"
    
      param.product = req.body.product;
      param.unit_amount = +req.body.unit_amount;
      param.currency = 'eur';
    //   param.currency = req.body.name
    //   param.recurring =  {interval: 'month'};
      param.recurring =  {interval: req.body.recurring};     

      
      stripe.prices.create(param,function(err,price){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
          }
          if(price)
          {
            //   console.log("Price Created : ",price);
            res.json({status:true,message:"Price Added Successfully",price:price})
          }
          else{
              console.log("Something Wrong")
          }
      })
      
}


exports.createSubscription=(req,res,next)=>{
  
    var param = {};
    //"prod_IfWWt8XiUpit3V"
    
      param.customer = req.body.customer;
    //   param.items = req.body.items;
    //   console.log(param.items)
    param.items = [
        {price: 'price_1I6GyJEEiYQYyt5LpuZZMDJo'},
      ]

      stripe.subscriptions.create(param,function(err,subscription){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
          }
          if(subscription)
          {
            //   console.log("Price Created : ",price);
            res.json({status:true,message:"Subscription Added Successfully",subscription:subscription})
          }
          else{
              console.log("Something Wrong")
          }
      })
      
}

//POST
exports.ownerRegister = (req,res,next)=>{
  
    let onwerID;
    //parsing data from incoming request
    const ownerName = req.body.ownerName;
    const email = req.body.email;    
    const phone = +req.body.phone;
    const password = req.body.password;
    const ownerImg = null;
    const isVerified = false;
    const regDate = new Date().getTime();
    const deviceToken = req.body.deviceToken;

    Owner.findOwnerByEmail(email)
                .then(userDoc=>{
                    if(userDoc){                        
                        return res.json({status:false, message:'Onwer Already Exists(Enter unique email and phone)',owner:userDoc});
                    }
                   
                    
                    Owner.findOwnerByPhone(phone)
                    .then(userDoc=>{
                        if(userDoc){                        
                            return res.json({status:false, message:'Onwer Already Exists(Enter unique email and phone)',owner:userDoc});
                        }

                    const db = getDb();     
                    db.collection('ownerCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        onwerID = newVal;
                        
                        db.collection('ownerCounter').insertOne({count:newVal})
                                .then(result=>{
                                              
                            const owner = new Owner(onwerID,ownerName,email,phone,password,ownerImg,isVerified,regDate,deviceToken);
                            //saving in database
                        
                            return owner.save()
                            .then(resultData=>{
                                
                                res.json({status:true,message:"Owner Registered",owner:resultData["ops"][0]});
                                
                            })
                            .catch(err=>console.log(err));                                                    
                                  
                                })
                                .then(resultData=>{
                                   
                                })
                                .catch(err=>{
                                    res.json({status:false,error:err})
                                })             
                     })   
                     
                    })
                })
                .then(resultInfo=>{                   
                  
                })
                .catch(err=>console.log(err));      
}


//LOGIN
exports.ownerLogin=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const isOwner = req.body.isOwner;

    if(isOwner)
    {
        Owner.findOwnerByEmail(email)
        .then(user=>{
            if(!user)
            {
                return res.json({ message:'Enter valid email Id',status:false});
            }

            if(user.password == password)
            {                        
                res.json({ message:'Login Successful',status:true, owner:user});
            }else{
               
                res.json({ message:'Enter valid credentials',status:false});
            }
        })
    }
    else
    {
        Employee.findEmployeesByEmail(email)
        .then(user=>{
            if(user.length==0)
            {
                return res.json({ message:'Enter valid email Id',status:false});
            }

            if(user[0].password == password)
            {                        
                // console.log(user[0].saloonId)
                Saloon.findSaloonBySaloonID(+user[0].saloonId)
                .then(saloonData=>{
                    // console.log(saloonData.ownerId)
                    Owner.findOwnerById(saloonData.ownerId)
                    .then(ownerData=>{
                        
                res.json({ message:'Login Successful',status:true, employee:user[0],owner:ownerData});
                    })
                    
                })
            }else{
               
                res.json({ message:'Enter valid credentials',status:false});
            }
        })
    }
    
   

}



exports.ownerCheckPhone=(req,res,next)=>{
    const phone = +req.body.phone;

    Owner.findOwnerByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.ownerCheckEmail=(req,res,next)=>{
    const email = req.body.email;

    Owner.findOwnerByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}

exports.ownerById=(req,res,next)=>{
    const ownerId = +req.params.ownerId;

    Owner.findOwnerById(ownerId)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.ownerResetPwd=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    Owner.findOwnerByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }

                    user.password = password;
                   
                    const db = getDb();
                    db.collection('owners').updateOne({email:email},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password successfully changed',status:true});
                                })
                                .catch(err=>console.log(err));
                })
}


exports.userData=(req,res,next)=>{
    const phone = req.body.phone;
    console.log(typeof phone);
   
    Parent.findUserByPhone(phone)
                .then(parent=>{
                    // console.log(parent);
                    if(!parent)
                    {
                        return res.json({ message:'User Does not exist',data:null});
                    }

                    res.json({ message:'User Exists',Data:parent});


                })

}



exports.editDeviceToken=(req,res,next)=>{
    const parent_phone = req.body.parent_phone;
    const device_token = req.body.device_token;

    Parent.findUserByPhone(parent_phone)
                .then(parent=>{
                    // console.log(parent);
                    if(!parent)
                    {
                        return res.json({ message:'User Does not exist',data:null});
                    }

                    parent.deviceToken = device_token;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('parents').updateOne({phone:parent_phone},{$set:parent})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Data Changed',status:true});
                                })
                                .catch(err=>console.log(err));

                }) 

}



exports.sendToken = (req,res,next)=>{

    const email = req.body.email;

    var token = "";

    var length = 6,
        // charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        charset = "123456789",        
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    token = retVal;

    transporter.sendMail({
        to:email,
        from:'samarthchadda@gmail.com',
        subject:'Fibi App - OTP',
        html:`
        <p> You requested a password reset</p>
        <br>
        6 Digit OTP Token : ${token}`
    })
    
    res.json({ message:'Token sent',status:true,email:req.body.email,token:+token});       

}



exports.editOwner=(req,res,next)=>{
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const ownerName = req.body.ownerName;
    const email = req.body.email;
    const phone = +req.body.phone;    

    Owner.findOwnerById(+ownerId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Owner does not exist',status:false});
                 }
                
                 if(email!=null)
                 {                   
                    ownerDoc.email = email;
                   
                 }
                 else if(ownerName!=null)
                 {
                    ownerDoc.ownerName = ownerName;
                 }
                 else if(phone!=null)
                 {
                    ownerDoc.phone = phone;
                 }

                 const db = getDb();
                 db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'All Details Updated',status:true,owner:ownerDoc});
                             })
                             .catch(err=>console.log(err));
             })
}




exports.editAdminOwner=(req,res,next)=>{
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const ownerName = req.body.ownerName;
    const email = req.body.email;
    const phone = +req.body.phone;    

    Owner.findOwnerById(+ownerId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Owner does not exist',status:false});
                 }
          
                    ownerDoc.email = email;
                
                    ownerDoc.ownerName = ownerName;
              
                    ownerDoc.phone = phone;
               
                 const db = getDb();
                 db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'All Details Updated',status:true,owner:ownerDoc});
                             })
                             .catch(err=>console.log(err));
             })
}




exports.editOwnerToken=(req,res,next)=>{
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const deviceToken = req.body.deviceToken;    

    Owner.findOwnerById(+ownerId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Owner does not exist',status:false});
                 }
                
                ownerDoc.deviceToken = deviceToken;
                

                 const db = getDb();
                 db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true,owner:ownerDoc});
                             })
                             .catch(err=>console.log(err));
             })
}


exports.delOwner=(req,res,next)=>{

    const ownerId = +req.params.ownerId;

    Owner.findOwnerById(JSON.parse(ownerId))
                    .then(owner=>{
                        if(!owner)
                        {
                            return res.json({ message:'Owner does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('owners').deleteOne({ownerId:ownerId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Owner Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}





exports.ownerVerify=(req,res,next)=>{
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const isVerified = req.body.isVerified;
   
    Owner.findOwnerById(ownerId)
            .then(owner=>{
                if(!owner)
                {
                    return res.json({ message:'Owner does not exist',status:false});
                }
                        
                owner.isVerified = isVerified;
                 
                 const db = getDb();
                 db.collection('owners').updateOne({ownerId:ownerId},{$set:owner})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}