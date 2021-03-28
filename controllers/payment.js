const Payment = require('../models/payment');
const getDb = require('../util/database').getDB; 

exports.postPaymentStatus = (req,res,next)=>{

    let paymentId = req.body.paymentId; 
    // let status = req.body.status;
    let status = 0;

    Payment.findPaymentByPaymentId(paymentId)
    .then(paymentData=>{
        if(paymentData)
        {
            return res.json({status:false,message:"Already Exists",paymentData:paymentData});
        }
        const payment = new Payment(paymentId,status);
        //saving in database
       
        return payment.save()
        .then(resultData=>{
            
            res.json({status:true,message:"Payment Added",paymentData:resultData["ops"][0]});
            
        })
        .catch(err=>console.log(err));    
    })

}


exports.editPaymentStatus = (req,res,next)=>{

    let paymentId = req.body.paymentId; 
    let status = +req.body.status;   
   
    Payment.findPaymentByPaymentId(paymentId)
    .then(paymentData=>{
        if(!paymentData)
            {
                return res.json({status:false, message:'Payment does not exist'});
            }
        
            paymentData.status = status;

            const db = getDb();
            db.collection('payments').updateOne({paymentId:paymentId},{$set:paymentData})
                        .then(resultData=>{
                            
                            res.json({status:true,message:'Details Updated',paymentData:paymentData});
                        })
                        .catch(err=>console.log(err));
        })

}


exports.getAllPayments=(req,res,next)=>{
    
    Payment.fetchAllPayments()
                .then(payments=>{
                   
                    res.json({message:"All Data returned",payments:payments})

                })
                .catch(err=>console.log(err));

}


exports.getSinglePayment=(req,res,next)=>{
  
    const paymentId = req.params.paymentId;
   
    Payment.findPaymentByPaymentId(paymentId)
    .then(serviceDoc=>{
       
        if(serviceDoc){
           
             res.json({status:true, paymentData:serviceDoc});
        }
        else{
            res.json({status:false,message:"No such Payment exist"});
        }          

    })    
}