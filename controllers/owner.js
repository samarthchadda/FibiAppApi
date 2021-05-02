
const Owner = require('../models/owner');

const getDb = require('../util/database').getDB; 

const Employee = require('../models/employee');

const Saloon = require('../models/saloon')
const axios = require('axios');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.NODE_MAILER_KEY
        
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



exports.getProducts=async (req,res,next)=>{
  
  
    // stripe.products.list(function(err,products){
    //       if(err){
    //         //   console.log("Error Occured : ",err);
    //         res.json({status:false,message:"Error Occured",error:err})
    //     }
    //       if(products)
    //       {
    //           var newArr = [];
              
    //         products.data.forEach(prod=>{
    //             // var newData = {...prod}
    //             // console.log(prod.description)
             
    //         })
    //         //   console.log("Customer : ",customer)
    //         res.json({status:true,products:products})
    //       }
    //       else{
    //           console.log("Something Wrong");
    //       }
    //   })
      
    
const prices = await stripe.prices.list();
const products = await stripe.products.list();

var newProds = [];
var newPrices = [];

const products1 = [{id:1,name:'samarth'},{id:2,name:'sam'},{id:3,name:'manu'}]
const prices1 = [{id:1,age:20,product:1},{id:2,age:20,product:1},{id:3,age:20,product:2},{id:4,age:20,product:4}]

for(i=0;i<products.data.length;i++)
{
    newPrices = [];
    for(j=0;j<prices.data.length;j++)
    {
        if(products.data[i].id==prices.data[j].product)
        {
            newPrices.push(prices.data[j])
        }
        
        // newPrices = [];
    }
    
    newProds.push({...products.data[i],prices:newPrices})
}

// for(i=0;i<products1.length;i++)
// {
//     newPrices = [];
//     for(j=0;j<prices1.length;j++)
//     {
//         if(products1[i].id==prices1[j].product)
//         {
//             newPrices.push(prices1[j])
//         }
        
//         // newPrices = [];
//     }
    
//     newProds.push({...products1[i],prices:newPrices})
// }

await res.json({status:true,products:newProds})


}

exports.getPaymentLogs = (req,res,next)=>{
    
    const customerId = req.body.customerId;
    var allCharges = [];
    
    stripe.invoices.list(function(err,charges){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
        }
          if(charges)
          {
            
            charges.data.forEach(charge=>{

                if(charge.customer==customerId)
                {
                    console.log(charge.customer)
                    allCharges.push(charge);
                    // console.log(allCharges.length)
                    // console.log(charges.data.length)
                    // if(charges.data.length==allCharges.length)
                    // {
                    //     res.json({status:true,charges:charges})
                    // }
                }

               
            })

            setTimeout(()=>{
                console.log(allCharges.length)
                res.json({status:true,charges:allCharges})
            },2000)

            
          }
          else{
              console.log("Something Wrong");
          }
      })
      
}


exports.getPaymentIntent = async (req,res,next)=>{
    const payIntentId = req.body.payIntentId;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(
        payIntentId
    );

    res.json({status:true,paymentIntent:paymentIntent })

}


exports.createProduct=(req,res,next)=>{
  
    // const customer =  stripe.customers.create({
    //   description: 'My First Test Customer (created for API docs)',
    // });

    var param = {};
     
      param.name = req.body.name;
      param.unit_label = req.body.unit_label;  ///no. of employees
      param.description = req.body.description;

      var param1 = {};
      //for price
      param1.product = '';
      param1.unit_amount = +req.body.unit_amount;
      param1.currency = 'eur';
      param1.recurring =  {interval: req.body.recurring};   
      
      stripe.products.create(param,function(err,product){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
          }
          if(product)
          {
            param1.product = product.id;
            console.log(product.id)
            //   console.log("Product Created : ",product);
            // res.json({status:true,message:"Product Created Successfully",product:product})

            stripe.prices.create(param1,function(err,price){
                if(err){
                  //   console.log("Error Occured : ",err);
                  res.json({status:false,message:"Error Occured",error:err})
                }
                if(price)
                {
                  //   console.log("Price Created : ",price);
                  res.json({status:true,message:"Price and Product Added Successfully",price:price,product:product})
                }
                else{
                    console.log("Something Wrong")
                }
            })

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


exports.createSubscription=async (req,res,next)=>{
   
    const customerId = req.body.customerId;
    const priceId = req.body.priceId;
    const card = req.body.card;
    const empCount = req.body.empCount;
    const status = +req.body.status;
   
    const price = await stripe.prices.retrieve(
        priceId
      );

    console.log("Price :", price.unit_amount);

    if(status == 2)
    {
        stripe.paymentMethods.create({
            type: 'card',
            card: card,
          },function(err,payment){
              if(err)
              {
                  console.log(err);
                  res.json({status:false,message:"Error Occured",error:err})
              }
              if(payment)
              {
                  console.log(payment.id);
                  stripe.paymentMethods.attach(
                    payment.id,
                    {customer: customerId},function(err,payMethod){
                        if(err)
                        {
                            console.log(err);
                            res.json({status:false,message:"Error Occured",error:err})
                        }
                        if(payMethod)
                        {
                            // console.log(payMethod)
                            stripe.customers.update(
                                customerId,
                                 {
                                    invoice_settings: {
                                        default_payment_method: payment.id
                                      }
                                },function(err,cust){
                                    if(err)
                                    {
                                        console.log(err);
                                        res.json({status:false,message:"Error Occured",error:err})
                                    }
                                    if(cust)
                                    {
                                        var today = new Date();
                                        var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
                                        tomorrow = (tomorrow.getTime()/1000).toFixed(0);
                                        console.log("Tomorrow : ",tomorrow)
                                        console.log(cust.id)

                                        stripe.paymentIntents.create({
                                            amount: price.unit_amount,
                                            currency: 'eur',
                                            payment_method_types: ['card'],
                                            customer:cust.id
                                        },function(err,payIntent){
                                            if(err){
                                              //   console.log("Error Occured : ",err);
                                              res.json({status:false,message:"Error Occured",error:err})
                                            }
                                            if(payIntent)
                                            {
                                                
                                        stripe.subscriptions.create({customer: customerId,
                                            trial_end: 'now',
                                        items: [
                                          {price: priceId,tax_rates:['txr_1ILTM6EEiYQYyt5Loh63cstX']},

                                        ]},function(err,subscription){
                                            if(err){
                                              //   console.log("Error Occured : ",err);
                                              res.json({status:false,message:"Error Occured",error:err})
                                            }
                                            if(subscription)
                                            {
                                                Saloon.findSaloonByCustomerId(customerId)
                                                .then(saloon=>{
                                                    if(!saloon)
                                                    {   
                                                       return res.json({status:false,message:"Saloon Does not exist"})
                                                    }
                                                    console.log("Saloon :",saloon.subscription.subscribedData)
                                                    // subscription = {...subscription,saloonId:saloonId};
                                                    saloon.subscription.subscribedData = subscription;
                                                    saloon.empCount = +empCount;
                                                    const db = getDb();
                                                    db.collection('saloons').updateOne({saloonId:saloon.saloonId},{$set:saloon})
                                                                .then(resultData=>{
                                                               
                                                                    // const paymentIntentConfirm = stripe.paymentIntents.confirm(
                                                                    //     payIntent.id,  
                                                                    //     {payment_method: payment.id,
                                                                    //         use_stripe_sdk:true,
                                                                    //         return_url:'https://www.google.com/',
                                                                    //     payment_method_options : {
                                                                    //         card:{
                                                                    //             request_three_d_secure : 'any'
                                                                    //         }
                                                                    //     }
                                                                    // }
                                                                    // );
                                                                    // console.log(paymentIntentConfirm);

                                                                    // setTimeout(()=>{
                                                                    //     res.json({status:true,message:"Subscription Added Successfully",subscription:subscription});
                                                                    // },2000);
                                                                    stripe.paymentIntents.confirm(
                                                                        payIntent.id,  
                                                                        {payment_method: payment.id,
                                                                            use_stripe_sdk:true,
                                                                            return_url:'https://finditbookit.eu:8000/web/loading-result',
                                                                        payment_method_options : {
                                                                            card:{
                                                                                request_three_d_secure : 'any'
                                                                            }
                                                                        }
                                                                    }
                                                                    ).then(pIResult=>{
                                                                        console.log( pIResult.next_action.use_stripe_sdk.stripe_js);
                                                                        res.json({status:true,message:"Subscription Added Successfully",subscription:subscription, urlHook:pIResult.next_action.use_stripe_sdk.stripe_js});
                                                                      
                                                                        // res.statusCode = 302;
                                                                        // res.setHeader("Location", pIResult.next_action.use_stripe_sdk.stripe_js);
                                                                        // res.end();
                                                                    });

                                                               
                                                                }) 
                                                                .catch(err=>console.log(err));
    
                                                })
                                            
                                            }
                                            else{
                                                console.log("Something Wrong");
                                                res.json({status:false, message:"Something wrong Occured"})
                                            }
                                        })
                                            } else{
                                                console.log("Something Wrong");
                                                return res.json({status:false, message:"Something wrong Occured"})
                                            }
                                        });

                                    }
                                    else
                                    {
                                        console.log("Something Wrong")
                                        return res.json({status:false, message:"Something wrong Occured"})
                                    }
                                }
                              );
                           
                        }   
                        else{
                            console.log("Something Wrong")
                            res.json({status:false, message:"Something wrong Occured"})
                        }
                    }
                  );
    
              }
              else{
                  console.log("Something Wrong");              
                  res.json({status:false, message:"Something wrong Occured"})
            }
          });
    
    }
    else if(status == 0)
    {
        stripe.paymentMethods.create({
            type: 'card',
            card: card,
          },function(err,payment){
              if(err)
              {
                  console.log(err);
                  res.json({status:false,message:"Error Occured",error:err})
              }
              if(payment)
              {
                  console.log(payment.id);
                  stripe.paymentMethods.attach(
                    payment.id,
                    {customer: customerId},function(err,payMethod){
                        if(err)
                        {
                            console.log(err);
                            res.json({status:false,message:"Error Occured",error:err})
                        }
                        if(payMethod)
                        {
                            // console.log(payMethod)
                            stripe.customers.update(
                                customerId,
                                 {
                                    invoice_settings: {
                                        default_payment_method: payment.id
                                      }
                                },function(err,cust){
                                    if(err)
                                    {
                                        console.log(err);
                                        res.json({status:false,message:"Error Occured",error:err})
                                    }
                                    if(cust)
                                    {
                                        console.log(cust.id)

                                        stripe.paymentIntents.create({
                                            // amount: price.unit_amount,
                                            amount: 50,
                                            currency: 'eur',
                                            payment_method_types: ['card'],
                                            customer:cust.id
                                        },function(err,payIntent){
                                            if(err){
                                              //   console.log("Error Occured : ",err);
                                              res.json({status:false,message:"Error Occured",error:err})
                                            }
                                            if(payIntent)
                                            {
                                            
                                        stripe.subscriptions.create({customer: customerId,
                                            trial_period_days:90,
                                        items: [
                                          {price: priceId,tax_rates:['txr_1ILTM6EEiYQYyt5Loh63cstX']},
                                        ]},function(err,subscription){
                                            if(err){
                                              //   console.log("Error Occured : ",err);
                                              res.json({status:false,message:"Error Occured",error:err})
                                            }
                                            if(subscription)
                                            {
                                                Saloon.findSaloonByCustomerId(customerId)
                                                .then(saloon=>{
                                                    if(!saloon)
                                                    {   
                                                       return res.json({status:false,message:"Saloon Does not exist"})
                                                    }
                                                    console.log("Saloon :",saloon.subscription.subscribedData)
                                                    // subscription = {...subscription,saloonId:saloonId};
                                                    saloon.subscription.subscribedData = subscription;
                                                    saloon.empCount = +empCount;
                                                    const db = getDb();
                                                    db.collection('saloons').updateOne({saloonId:saloon.saloonId},{$set:saloon})
                                                                .then(resultData=>{
                                                                    
                                                                    // const paymentIntentConfirm = stripe.paymentIntents.confirm(
                                                                    //     payIntent.id,  
                                                                    //     {payment_method: payment.id,
                                                                    //         use_stripe_sdk:true,
                                                                    //         return_url:'https://www.google.com/',
                                                                    //     payment_method_options : {
                                                                    //         card:{
                                                                    //             request_three_d_secure : 'any'
                                                                    //         }
                                                                    //     }
                                                                    // }
                                                                    // );
                                                                    // console.log(paymentIntentConfirm);

                                                                    // setTimeout(()=>{
                                                                   
                                                                    // res.json({status:true,message:"Subscription Added Successfully",subscription:subscription})
                                                                    // },2000);
                                                                    stripe.paymentIntents.confirm(
                                                                        payIntent.id,  
                                                                        {payment_method: payment.id,
                                                                            use_stripe_sdk:true,
                                                                            return_url:'https://finditbookit.eu:8000/web/loading-result',
                                                                        payment_method_options : {
                                                                            card:{
                                                                                request_three_d_secure : 'any'
                                                                            }
                                                                        }
                                                                    }
                                                                    ).then(pIResult=>{
                                                                        console.log( "URL HOOK : ",pIResult.next_action.use_stripe_sdk.stripe_js);
                                                                        res.json({status:true,message:"Subscription Added Successfully",subscription:subscription, urlHook:pIResult.next_action.use_stripe_sdk.stripe_js});
                                                                        
                                                                        // res.statusCode = 302;
                                                                        // res.setHeader("Location", pIResult.next_action.use_stripe_sdk.stripe_js);
                                                                        // res.end();
                                                                    });
                                                                   
                                                                }) 
                                                                .catch(err=>console.log(err));
    
                                                })
                                             
                                            }
                                            else{
                                                console.log("Something Wrong");
                                                return res.json({status:false, message:"Something wrong Occured"})
                                            }
                                        })
                                        } else{
                                            console.log("Something Wrong");
                                            return res.json({status:false, message:"Something wrong Occured"})
                                        }
                                    });

                                        
                                    }
                                    else
                                    {
                                        console.log("Something Wrong")
                                        res.json({status:false, message:"Something wrong Occured"})
                                    }
                                }
                              );
                           
                        }   
                        else{
                            console.log("Something Wrong")
                            res.json({status:false, message:"Something wrong Occured"})
                        }
                    }
                  );    
              }
              else{
                  console.log("Something Wrong");              
                  res.json({status:false, message:"Something wrong Occured"})
            }
          });
    }
    else{
        stripe.paymentMethods.create({
            type: 'card',
            card: card,
          },function(err,payment){
              if(err)
              {
                  console.log(err);
                  res.json({status:false,message:"Error Occured",error:err})
              }
              if(payment)
              {
                  console.log(payment.id);
                  stripe.paymentMethods.attach(
                    payment.id,
                    {customer: customerId},function(err,payMethod){
                        if(err)
                        {
                            console.log(err);
                            res.json({status:false,message:"Error Occured",error:err})
                        }
                        if(payMethod)
                        {
                            // console.log(payMethod)
                            stripe.customers.update(
                                customerId,
                                 {
                                    invoice_settings: {
                                        default_payment_method: payment.id
                                      }
                                },function(err,cust){
                                    if(err)
                                    {
                                        console.log(err);
                                        res.json({status:false,message:"Error Occured",error:err})
                                    }
                                    if(cust)
                                    {
                                        console.log(cust.id)
                                        stripe.paymentIntents.create({
                                            amount: price.unit_amount,
                                            currency: 'eur',
                                            payment_method_types: ['card'],
                                            customer:cust.id
                                        },function(err,payIntent){
                                            if(err){
                                              //   console.log("Error Occured : ",err);
                                              res.json({status:false,message:"Error Occured",error:err})
                                            }
                                            if(payIntent)
                                            {
                                                stripe.subscriptions.create({customer: customerId,
                                                    items: [
                                                      {price: priceId,tax_rates:['txr_1ILTM6EEiYQYyt5Loh63cstX']},
                                                    ]},function(err,subscription){
                                                        if(err){
                                                          //   console.log("Error Occured : ",err);
                                                          res.json({status:false,message:"Error Occured",error:err})
                                                        }
                                                        if(subscription)
                                                        {
                                                            Saloon.findSaloonByCustomerId(customerId)
                                                            .then(saloon=>{
                                                                if(!saloon)
                                                                {   
                                                                   return res.json({status:false,message:"Saloon Does not exist"})
                                                                }
                                                                console.log("Saloon :",saloon.subscription.subscribedData)
                                                                // subscription = {...subscription,saloonId:saloonId};
                                                                saloon.subscription.subscribedData = subscription;
                                                                saloon.empCount = +empCount;
                                                                const db = getDb();
                                                                db.collection('saloons').updateOne({saloonId:saloon.saloonId},{$set:saloon})
                                                                            .then(resultData=>{
                                                                                
                                                                                // const paymentIntentConfirm = stripe.paymentIntents.confirm(
                                                                                //     payIntent.id,  
                                                                                //     {payment_method: payment.id,
                                                                                //         return_url:'https://www.google.com/',
                                                                                //         use_stripe_sdk:true,
                                                                                //     payment_method_options : {
                                                                                //         card:{
                                                                                //             request_three_d_secure : 'any'
                                                                                //         }
                                                                                //     }
                                                                                // }
                                                                                // );
                                                                                // console.log(paymentIntentConfirm);
            
                                                                                // setTimeout(()=>{
                                                                                //     res.json({status:true,message:"Subscription Added Successfully",subscription:subscription});
                                                                                // },2000);
                                                                                stripe.paymentIntents.confirm(
                                                                                    payIntent.id,  
                                                                                    {payment_method: payment.id,
                                                                                        use_stripe_sdk:true,
                                                                                        return_url:'https://finditbookit.eu:8000/web/loading-result',
                                                                                    payment_method_options : {
                                                                                        card:{
                                                                                            request_three_d_secure : 'any'
                                                                                        }
                                                                                    }
                                                                                }
                                                                                ).then(pIResult=>{
                                                                                    console.log( pIResult.next_action.use_stripe_sdk.stripe_js);
                                                                                    res.json({status:true,message:"Subscription Added Successfully",subscription:subscription, urlHook:pIResult.next_action.use_stripe_sdk.stripe_js});
                                                                                  
                                                                                    // res.statusCode = 302;
                                                                                    // res.setHeader("Location", pIResult.next_action.use_stripe_sdk.stripe_js);
                                                                                    // res.end();
                                                                                   
                                                                                });
                                                                              
                                                                            }) 
                                                                            .catch(err=>console.log(err));
                
                                                            })
                                                          //   console.log("Price Created : ",price);
                                                        
                                                        }
                                                        else{
                                                            console.log("Something Wrong");
                                                            res.json({status:false, message:"Something wrong Occured"})
                                                        }
                                                    })
                                            } else{
                                                console.log("Something Wrong");
                                                return res.json({status:false, message:"Something wrong Occured"})
                                            }
                                        });                                 
                                        
                                    }
                                    else
                                    {
                                        console.log("Something Wrong")
                                        res.json({status:false, message:"Something wrong Occured"})
                                    }
                                }
                              );
                           
                        }   
                        else{
                            console.log("Something Wrong")
                            res.json({status:false, message:"Something wrong Occured"})
                        }
                    }
                  );
    
              }
              else{
                  console.log("Something Wrong");              
                  res.json({status:false, message:"Something wrong Occured"})
            }
          });
    
    }
}


exports.changeSubscription=async (req,res,next)=>{
 
    // const subscriptionId = req.body.subscriptionId;
    const customerId = req.body.customerId;
    const priceId = req.body.priceId;
    const card = req.body.card;
    const empCount = +req.body.empCount;
    const price = await stripe.prices.retrieve(
        priceId
      );

    console.log("Price :", price.unit_amount);

    if(req.body.subscriptionId!=null)
    {
        
        stripe.paymentMethods.create({
            type: 'card',
            card: card,
          },function(err,payment){
              if(err)
              {
                  console.log(err);
                  res.json({status:false,message:"Error Occured",error:err})
              }
              if(payment)
              {
                stripe.subscriptions.del(req.body.subscriptionId,function(err,subscription){
                    if(err){
                      //   console.log("Error Occured : ",err);
                      res.json({status:false,message:"Error Occured",error:err})
                    }
                    if(subscription)
                    {
                      //   console.log("Customer Created : ",customer)
                    //   res.json({status:true,message:"Subscription Deleted Successfully",subscription:subscription})
                    
                  console.log(payment.id);
                  stripe.paymentMethods.attach(
                    payment.id,
                    {customer: customerId},function(err,payMethod){
                        if(err)
                        {
                            console.log(err);
                            res.json({status:false,message:"Error Occured",error:err})
                        }
                        if(payMethod)
                        {
                            stripe.customers.update(
                                customerId,
                                 {
                                    invoice_settings: {
                                        default_payment_method: payment.id
                                      }
                                },function(err,cust){
                                    if(err)
                                    {
                                        console.log(err);
                                        res.json({status:false,message:"Error Occured",error:err})
                                    }
                                    if(cust)
                                    {
                                        var today = new Date();
                                        var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
                                        tomorrow = (tomorrow.getTime()/1000).toFixed(0);
                                        console.log(cust.id)

                                        stripe.paymentIntents.create({
                                            amount: price.unit_amount,
                                            currency: 'eur',
                                            payment_method_types: ['card'],
                                            customer:cust.id
                                        },function(err,payIntent){
                                            if(err){
                                              //   console.log("Error Occured : ",err);
                                              res.json({status:false,message:"Error Occured",error:err})
                                            }
                                            if(payIntent)
                                            {
                                                stripe.subscriptions.create({customer: customerId,
                                                    trial_end: 'now',
                                                items: [
                                                  {price: priceId,tax_rates:['txr_1ILTM6EEiYQYyt5Loh63cstX']},
                                                ]},function(err,subscription){
                                                    if(err){
                                                      //   console.log("Error Occured : ",err);
                                                      res.json({status:false,message:"Error Occured",error:err})
                                                    }
                                                    if(subscription)
                                                    {
                                                        Saloon.findSaloonByCustomerId(customerId)
                                                        .then(saloon=>{
                                                            if(!saloon)
                                                            {   
                                                               return res.json({status:false,message:"Saloon Does not exist"})
                                                            }
                                                            console.log("Saloon Data:",saloon)
                                                            // subscription = {...subscription,saloonId:saloonId};
                                                            saloon.subscription.subscribedData = subscription;
                                                            saloon.empCount = +empCount;
                                                            const db = getDb();
                                                            db.collection('saloons').updateOne({saloonId:saloon.saloonId},{$set:saloon})
                                                                        .then(resultData=>{
                                                                            
                                                                            stripe.paymentIntents.confirm(
                                                                                payIntent.id,  
                                                                                {payment_method: payment.id,
                                                                                    use_stripe_sdk:true,
                                                                                    return_url:'https://finditbookit.eu:8000/web/loading-result',
                                                                                payment_method_options : {
                                                                                    card:{
                                                                                        request_three_d_secure : 'any'
                                                                                    }
                                                                                }
                                                                            }
                                                                            ).then(pIResult=>{
                                                                                console.log(pIResult, pIResult.next_action);
                                                                                res.json({status:true,message:"Subscription Changed Successfully",subscription:subscription, urlHook:pIResult.next_action.use_stripe_sdk.stripe_js});

                                                                            });
                                                                            // console.log(paymentIntentConfirm);
        
                                                                            // setTimeout(()=>{
                                                                          
                                                                            //     res.json({status:true,message:"Subscription Changed Successfully",subscription:subscription});
                                                                            // },2000);
                                                                      
                                                                        }) 
                                                                        .catch(err=>console.log(err));
            
                                                        })
                                                   
                                                    }
                                                    else{
                                                        console.log("Something Wrong")
                                                        return res.json({status:false, message:"Something wrong Occured"})
                                                    }
                                                })
                                            } else{
                                                console.log("Something Wrong");
                                                return res.json({status:false, message:"Something wrong Occured"})
                                            }
                                        });
                                        
                                    }
                                    else
                                    {
                                        console.log("Something Wrong")
                                    }
                                }
                              );
                           
                        }   
                        else{
                            console.log("Something Wrong")
                        }
                    }
                  );
    
              }
              else{
                  console.log("Something Wrong");
            }
          });
    
    
            }
            else
            {
                console.log("Something Wrong")
              // res.json({status:false,message:"Error Occured"})
            }
        })
    }
    else
    {
        stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: 'eur',
            payment_method_types: ['card'],
            customer:cust.id
        },function(err,payIntent){
            if(err){
              //   console.log("Error Occured : ",err);
              res.json({status:false,message:"Error Occured",error:err})
            }
            if(payIntent)
            {
                stripe.subscriptions.create({customer: customerId,
                    items: [
                      {price: priceId,tax_rates:['txr_1ILTM6EEiYQYyt5Loh63cstX']},
                    ]},function(err,subscription){
                        if(err){
                          //   console.log("Error Occured : ",err);
                          res.json({status:false,message:"Error Occured",error:err})
                        }
                        if(subscription)
                        {
                            Saloon.findSaloonByCustomerId(customerId)
                            .then(saloon=>{
                                if(!saloon)
                                {   
                                   return res.json({status:false,message:"Saloon Does not exist"})
                                }
                                console.log("Saloon Data:",saloon.subscription.subscribedData)
                                // subscription = {...subscription,saloonId:saloonId};
                                saloon.subscription.subscribedData = subscription;
                                const db = getDb();
                                db.collection('saloons').updateOne({saloonId:saloon.saloonId},{$set:saloon})
                                            .then(resultData=>{
                                                
                                                // const paymentIntentConfirm = stripe.paymentIntents.confirm(
                                                //     payIntent.id,  
                                                //     {payment_method: payment.id,
                                                //         use_stripe_sdk:true,
                                                //     payment_method_options : {
                                                //         card:{
                                                //             request_three_d_secure : 'any'
                                                //         }
                                                //     }
                                                // }
                                                // );
                                                // console.log(paymentIntentConfirm);
        
                                                // setTimeout(()=>{                                      
                                                //     res.json({status:true,message:"Subscription Changed Successfully",subscription:subscription})
                                                // },2000);
                                                stripe.paymentIntents.confirm(
                                                    payIntent.id,  
                                                    {payment_method: payment.id,
                                                        use_stripe_sdk:true,
                                                        return_url:'https://finditbookit.eu:8000/web/loading-result',
                                                    payment_method_options : {
                                                        card:{
                                                            request_three_d_secure : 'any'
                                                        }
                                                    }
                                                }
                                                ).then(pIResult=>{
                                                    console.log(pIResult, pIResult.next_action);
                                                    res.json({status:true,message:"Subscription Changed Successfully",subscription:subscription, urlHook:pIResult.next_action.use_stripe_sdk.stripe_js});

                                                });
                                               
                                            }) 
                                            .catch(err=>console.log(err));
                            })                               
                        }
                        else{
                            console.log("Something Wrong")
                            return res.json({status:false, message:"Something wrong Occured"})
                        }
                    })
            } else{
                console.log("Something Wrong");
                return res.json({status:false, message:"Something wrong Occured"})
            }
        });
       
    }
}

exports.cancelSubscription=(req,res,next)=>{
  
      
     stripe.subscriptions.del(req.body.subscriptionId,function(err,subscription){
          if(err){
            //   console.log("Error Occured : ",err);
            res.json({status:false,message:"Error Occured",error:err})
          }
          if(subscription)
          {
            //   console.log("Customer Created : ",customer)
            Saloon.findSaloonBySubscriptionId(req.body.subscriptionId)
            .then(saloon=>{
                if(!saloon)
                {   
                   return res.json({status:false,message:"Saloon Does not exist"})
                }
                // console.log("Saloon :",saloon.subscription.subscribedData)
                // subscription = {...subscription,saloonId:saloonId};
                saloon.subscription.subscribedData = null;
                saloon.empCount = -1;
                saloon.isVerified = 2;
                const db = getDb();
                db.collection('saloons').updateOne({saloonId:saloon.saloonId},{$set:saloon})
                            .then(resultData=>{
                                
                                // res.json({ message:'Password successfully changed',status:true});
                                res.json({status:true,message:"Subscription Deleted Successfully",subscription:subscription})
                            }) 
                            .catch(err=>console.log(err));

            })
            
          }
          else
          {
              console.log("Something Wrong")
            // res.json({status:false,message:"Error Occured"})
          }
      })
      
}

exports.delProduct=(req,res,next)=>{
  
      
    stripe.products.del(req.body.productId,function(err,product){
         if(err){
           //   console.log("Error Occured : ",err);
           res.json({status:false,message:"Error Occured",error:err})
         }
         if(product)
         {
           //   console.log("Customer Created : ",customer)
           res.json({status:true,message:"Product Deleted Successfully",product:product})
         }
         else
         {
             console.log("Something Wrong")
           // res.json({status:false,message:"Error Occured"})
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

                                                                
                            // param.email = req.body.email;
                            // param.name = req.body.ownerName;
                            
                            // stripe.customers.create(param,function(err,customer){
                            //     if(err){
                            //         //   console.log("Error Occured : ",err);
                            //         res.json({status:false,message:"Error Occured",error:err})
                            //     }
                            //     if(customer)
                            //     {
                            //           console.log("Customer Created : ",customer.id)
                            //           subscription.customerId = customer.id
                                                            
                                    const owner = new Owner(onwerID,ownerName,email,phone,password,ownerImg,isVerified,regDate,deviceToken);
                                    //saving in database
                                
                                    return owner.save()
                                    .then(resultData=>{
                                        
                                        res.json({status:true,message:"Owner Registered",owner:resultData["ops"][0]});
                                        
                                    })
                                    .catch(err=>console.log(err)); 
                                    // res.json({status:true,message:"Customer Created Successfully",customer:customer})
                                // }
                                // else
                                // {
                                //     console.log("Something Wrong")
                                //     // res.json({status:false,message:"Error Occured"})
                                // }
                            // })
                                                                                
                                  
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
    // const isOwner = req.body.isOwner;

    // if(isOwner)
    // {
        Owner.findOwnerByEmail(email)
        .then(user=>{
            if(!user)
            {
                // return res.json({ message:'Enter valid email Id',status:false});
                Employee.findEmployeesByEmail(email)
                .then(user=>{
                    if(user.length==0)
                    {
                        return res.json({ message:'Owner does not exist',status:false});
                    }
        
                    if(user[0].password == password)
                    {                        
                        // console.log(user)
                        // console.log(user[0].saloonId)
                        Saloon.findSaloonBySaloonID(+user[0].saloonId)
                        .then(saloonData=>{
                            // console.log(saloonData.ownerId)
                            Owner.findOwnerById(saloonData.ownerId)
                            .then(ownerData=>{
                                
                       return res.json({ message:'Login Successful',status:true, employee:user[0],owner:ownerData,type:"employee"});
                            })
                            
                        })
                    }else{
                       
                        return res.json({ message:'Enter valid employee credentials',status:false});
                    }
                })
            }
            else{

            if(user.password == password)
            {                        
                res.json({ message:'Login Successful',status:true, owner:user,type:"owner"});
            }else{
               
                res.json({ message:'Enter valid owner credentials',status:false});
            }
        }
        })
    // }
    // else
    // {
       
    // }
      

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
        from:'Finditbookit.es@gmail.com',
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
                    Owner.findOwnerByEmail(email)
                    .then(userDoc=>{
                        if(userDoc){                        
                            return res.json({status:false, message:'Email Already Exists',owner:userDoc});
                        }  
                        ownerDoc.email = email;
                    })  
                  
                   
                 }
                 else if(ownerName!=null)
                 {
                    ownerDoc.ownerName = ownerName;
                 }
                 else if(phone!=null)
                 {
                    Owner.findOwnerByPhone(phone)
                    .then(userDoc=>{
                        if(userDoc){                        
                            return res.json({status:false, message:'Phone Already Exists',owner:userDoc});
                        }  
                    ownerDoc.phone = phone;
                    })
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
   console.log("Owner Email : ",email)

   Owner.findOwnerById(+ownerId)
   .then(adminDoc=>{
       if(!adminDoc)
       {
           return res.json({ message:'Owner does not exist',status:false});
       }
       Owner.findOwnerByPhone(+phone)
       .then(admin=>{
           if(!admin)
           {
               Owner.findOwnerByEmail(email)
               .then(adminNew=>{
                   if(!adminNew)
                   {
                      adminDoc.ownerName = ownerName;
                      adminDoc.phone = phone;
                      adminDoc.email = email;
                          
                          const db = getDb();
                          db.collection('owners').updateOne({ownerId:ownerId},{$set:adminDoc})
                                      .then(resultData=>{
                                          
                                         return res.json({message:'Details Updated',status:true});
                                      })
                                      .catch(err=>console.log(err));   
                   }
                   else if(adminNew.email == adminDoc.email)
                   {
                      adminDoc.ownerName = ownerName;
                      adminDoc.phone = phone;
                          
                          const db = getDb();
                          db.collection('owners').updateOne({ownerId:ownerId},{$set:adminDoc})
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
              Owner.findOwnerByEmail(email)
              .then(adminNew1=>{
                  if(!adminNew1)
                  {
                     adminDoc.ownerName = ownerName;
                     adminDoc.email = email;
                         
                         const db = getDb();
                         db.collection('owners').updateOne({ownerId:ownerId},{$set:adminDoc})
                                     .then(resultData=>{
                                         
                                        return res.json({message:'Details Updated',status:true});
                                     })
                                     .catch(err=>console.log(err));   
                  }
                  else if(adminNew1.email == adminDoc.email)
                  {
                     adminDoc.ownerName = ownerName;
                         
                         const db = getDb();
                         db.collection('owners').updateOne({ownerId:ownerId},{$set:adminDoc})
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



            //  Owner.findOwnerById(+ownerId)
            //  .then(ownerDoc=>{
            //      if(!ownerDoc)
            //      {
            //          return res.json({ message:'Owner does not exist',status:false});
            //      }
            //      Owner.findOwnerByPhone(phone)
            //             .then(owner=>{
            //                 if(owner!=null)
            //                 {
            //                 if(ownerDoc.phone == owner.phone)
            //                 {
            //                     if(ownerDoc.email==owner.email)
            //                     {
            //                         ownerDoc.ownerName = ownerName;
                                    
            //                         const db = getDb();
            //                         db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
            //                                     .then(resultData=>{
                                                    
            //                                        return res.json({message:'Details Updated',status:true});
            //                                     })
            //                                     .catch(err=>console.log(err));
            //                     }
            //                     else{
            //                         console.log("Else")
            //                         ownerDoc.email = email;
            //                         const db = getDb();
            //                         db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
            //                                 .then(resultData=>{
                                                
            //                                  return res.json({message:'Details Updated',status:true});
            //                                 })
            //                                 .catch(err=>console.log(err));
            //                         }
            //                 }
            //                 else if(ownerDoc.email == owner.email)
            //                 {
            //                     ownerDoc.ownerName = ownerName;
                                    
            //                     const db = getDb();
            //                     db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
            //                                 .then(resultData=>{
                                                
            //                                    return res.json({message:'Details Updated',status:true});
            //                                 })
            //                                 .catch(err=>console.log(err));
            //                 }
            //                 else{                        
            //                     return res.json({status:false, message:'Phone Already Exists'});
            //                 }
            //             }

            //                 Owner.findOwnerByEmail(email)
            //                 .then(owner=>{
            //                     if(owner)
            //                     {
            //                         if(ownerDoc.email == owner.email)
            //                         {
            //                             ownerDoc.ownerName = ownerName;
            //                             ownerDoc.phone = phone;
                                            
            //                                 const db = getDb();
            //                                 db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
            //                                             .then(resultData=>{
                                                            
            //                                                return res.json({message:'Details Updated',status:true});
            //                                             })
            //                                             .catch(err=>console.log(err));                                  
            //                         }     
            //                         else{
            //                             return res.json({status:false, message:'Email Already Exists'});
            //                         }
                                 
                                   
            //                     }
                                    
            //                     else{

            //                         ownerDoc.ownerName = ownerName;
            //                         ownerDoc.phone = phone;
            //                         ownerDoc.email = email;
                            
            //                 const db = getDb();
            //                 db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
            //                             .then(resultData=>{
                                            
            //                                 res.json({message:'Details Updated',status:true});
            //                             })
            //                             .catch(err=>console.log(err));
            //                         }
            //             })
            //                 })                           
                
            //  })
}



exports.delOwnerPhoto=(req,res,next)=>{
    //parsing data from incoming request
    const ownerId = +req.params.ownerId;
    console.log(ownerId);
    Owner.findOwnerById(+ownerId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Owner does not exist',status:false});
                 }
          
                    ownerDoc.ownerImg = null;
               
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