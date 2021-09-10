const Admin = require('../models/admin');

const getDb = require('../util/database').getDB; 
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.NODE_MAILER_KEY
        
    }
}))


//POST
exports.adminRegister = (req,res,next)=>{
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;    
    const phone = +req.body.phone;
    const password = req.body.password;
    const token = null;

    let adminID;
    Admin.findAdminByEmail(email)
                .then(userDoc=>{
                    if(userDoc){                        
                        return res.json({status:false, message:'Admin Already Exists(Enter unique email and phone)',admin:userDoc});
                    }
                                       
                    Admin.findAdminByPhone(phone)
                    .then(userDoc=>{
                        if(userDoc){                        
                            return res.json({status:false, message:'Admin Already Exists(Enter unique email and phone)',admin:userDoc});
                        }

                    const db = getDb();     
                    db.collection('adminCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        adminID = newVal;
                        
                        db.collection('adminCounter').insertOne({count:newVal})
                                .then(result=>{
                                                            
                        const admin = new Admin(adminID,firstName,lastName,email,password,phone,token);
                        //saving in database
                    
                        return admin.save()
                        .then(resultData=>{
                            
                            res.json({status:true,message:"Admin Registered",owner:resultData["ops"][0]});
                            
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
        .catch(err=>console.log(err)); ;      
}



//LOGIN
exports.adminLogin=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    Admin.findAdminByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Admin does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, admin:user});
                    }else{
                       
                        res.json({ message:'Password is incorrect',status:false});
                    }
                })
}


exports.getSingleAdmin=(req,res,next)=>{
    const adminId = +req.body.adminId;
    
    Admin.findAdminById(adminId)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Admin does not exist',status:false});
                    }

                    return res.json({status:true,message:"Admin Exists",admin:user});
                })
}

exports.sendToken = (req,res,next)=>{

    const email = req.body.email;

    Admin.findAdminByEmail(email)
        .then(serviceDoc=>{
            if(!serviceDoc)
            {
                return res.json({ message:'Admin does not exist',status:false});
            }
        
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
                from:'finditbookit.es@gmail.com',
                subject:'Hosam App - OTP',
                html:`
                <p> You requested a password reset</p>
                <br>
                6 Digit OTP Token : ${token}`
            })             
           
            serviceDoc.token = token;
        
            const db = getDb();
            db.collection('admins').updateOne({email:email},{$set:serviceDoc})
                        .then(resultData=>{
                            
                            res.json({ message:'Token sent',status:true,email:email,token:token});    
                        })
                        .catch(err=>console.log(err));
        })    

}




exports.adminForgotPassword = (req,res,next)=>{

    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const token = req.body.token;

    Admin.findAdminByEmail(email)
        .then(serviceDoc=>{
            if(!serviceDoc)
            {
                return res.json({ message:'Admin does not exist',status:false});
            }
            if(serviceDoc.token!=token)
            {
                return res.json({ message:'Enter Valid Token',status:false});
            }
           
            serviceDoc.password = newPassword;
            serviceDoc.token = null;
        
            const db = getDb();
            db.collection('admins').updateOne({email:email},{$set:serviceDoc})
                        .then(resultData=>{
                            
                            res.json({ message:'Password Reset Successfully',status:true,admin:serviceDoc});    
                        })
                        .catch(err=>console.log(err));
        })    

}

exports.editAdminDetails = (req,res,next)=>{
    const adminId = +req.body.adminId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const phone = +req.body.phone;

    
    Admin.findAdminById(+adminId)
             .then(adminDoc=>{
                 if(!adminDoc)
                 {
                     return res.json({ message:'Admin does not exist',status:false});
                 }
                 Admin.findAdminByPhone(+phone)
                 .then(admin=>{
                     if(!admin)
                     {
                         Admin.findAdminByEmail(email)
                         .then(adminNew=>{
                             if(!adminNew)
                             {
                                adminDoc.firstName = firstName;
                                adminDoc.lastName = lastName;
                                adminDoc.password = password;
                                adminDoc.phone = phone;
                                adminDoc.email = email;
                                    
                                    const db = getDb();
                                    db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
                                                .then(resultData=>{
                                                    
                                                   return res.json({message:'Details Updated',status:true});
                                                })
                                                .catch(err=>console.log(err));   
                             }
                             else if(adminNew.email == adminDoc.email)
                             {
                                adminDoc.firstName = firstName;
                                adminDoc.lastName = lastName;
                                adminDoc.password = password;
                                adminDoc.phone = phone;
                                    
                                    const db = getDb();
                                    db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
                                                .then(resultData=>{
                                                    
                                                   return res.json({message:'Details Updated',status:true});
                                                })
                                                .catch(err=>console.log(err));   
                             }
                             else if(adminNew.email != adminDoc.email)
                             {
                                 return res.json({status:false, message:"Email Already Exists"});
                             }
                         })
                     }
                     else if(admin.phone == adminDoc.phone)
                     {
                        Admin.findAdminByEmail(email)
                        .then(adminNew1=>{
                            if(!adminNew1)
                            {
                               adminDoc.firstName = firstName;
                               adminDoc.lastName = lastName;
                               adminDoc.password = password;
                               adminDoc.email = email;
                                   
                                   const db = getDb();
                                   db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
                                               .then(resultData=>{
                                                   
                                                  return res.json({message:'Details Updated',status:true});
                                               })
                                               .catch(err=>console.log(err));   
                            }
                            else if(adminNew1.email == adminDoc.email)
                            {
                               adminDoc.firstName = firstName;
                               adminDoc.lastName = lastName;
                               adminDoc.password = password;
                                   
                                   const db = getDb();
                                   db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
                                               .then(resultData=>{
                                                   
                                                  return res.json({message:'Details Updated',status:true});
                                               })
                                               .catch(err=>console.log(err));   
                            }
                            else if(adminNew1.email != adminDoc.email)
                            {
                                return res.json({status:false, message:"Email Already Exists"});
                            }
                        })
                     }
                     else if(admin.phone != adminDoc.phone)
                     {
                        return res.json({status:false, message:"Phone Already Exists"});
                     }
                 })

                })

    // Admin.findAdminById(+adminId)
    //          .then(adminDoc=>{
    //              if(!adminDoc)
    //              {
    //                  return res.json({ message:'Admin does not exist',status:false});
    //              }
    //              Admin.findAdminByPhone(+phone)
    //                     .then(admin=>{
    //                         if(admin!=null)
    //                         {
    //                         if(adminDoc.phone == admin.phone)
    //                         {
    //                             if(adminDoc.email==admin.email)
    //                             {
    //                                 adminDoc.firstName = firstName;
    //                                 adminDoc.lastName = lastName;
    //                                 adminDoc.password = password;
                                                                        
    //                                 const db = getDb();
    //                                 db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
    //                                             .then(resultData=>{
                                                    
    //                                                return res.json({message:'Details Updated',status:true});
    //                                             })
    //                                             .catch(err=>console.log(err));
    //                             }
    //                             else{
    //                                 console.log("Else")
    //                                 adminDoc.email = email;
    //                                 const db = getDb();
    //                                 db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
    //                                         .then(resultData=>{
                                                
    //                                          return res.json({message:'Details Updated',status:true});
    //                                         })
    //                                         .catch(err=>console.log(err));
    //                                 }
    //                         }
    //                         else if(adminDoc.email == admin.email)
    //                         {
    //                             adminDoc.firstName = firstName;
    //                             adminDoc.lastName = lastName;
    //                             adminDoc.password = password;
                                    
    //                             const db = getDb();
    //                             db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
    //                                         .then(resultData=>{
                                                
    //                                            return res.json({message:'Details Updated',status:true});
    //                                         })
    //                                         .catch(err=>console.log(err));
    //                         }
    //                         else{                        
    //                             return res.json({status:false, message:'Phone Already Exists'});
    //                         }
    //                     }

    //                         Admin.findAdminByEmail(email)
    //                         .then(admin1=>{
    //                             console.log("admin:",admin1,adminDoc);
    //                             if(admin1!=null)
    //                             {
    //                                 if(adminDoc.email == admin1.email)
    //                                 {
    //                                     adminDoc.firstName = firstName;
    //                                     adminDoc.lastName = lastName;
    //                                     adminDoc.password = password;
    //                                     adminDoc.phone = phone;
                                            
    //                                         const db = getDb();
    //                                         db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
    //                                                     .then(resultData=>{
                                                            
    //                                                        return res.json({message:'Details Updated',status:true});
    //                                                     })
    //                                                     .catch(err=>console.log(err));                                  
    //                                 }     
    //                                 else{
    //                                     console.log("Email else")
    //                                     return res.json({status:false, message:'Email Already Exists'});
    //                                 }                                
                                   
    //                             }                                    
    //                             else{

    //                                 adminDoc.firstName = firstName;
    //                                 adminDoc.lastName = lastName;
    //                                 adminDoc.password = password;
    //                                 adminDoc.phone = phone;
    //                                 adminDoc.email = email;
                            
    //                         const db = getDb();
    //                         db.collection('admins').updateOne({adminId:adminId},{$set:adminDoc})
    //                                     .then(resultData=>{
                                            
    //                                        return res.json({message:'Details Updated',status:true});
    //                                     })
    //                                     .catch(err=>console.log(err));
    //                                 }
    //                     })
    //                         })                           
                
    //          })

}


