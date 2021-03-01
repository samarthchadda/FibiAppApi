const Training = require('../models/training');
const getDb = require('../util/database').getDB; 


exports.postTrainingData = (req,res,next)=>{
  
    //parsing data from incoming request
    let code ;
    const title = req.body.title;
    const category = req.body.category;    
    const description = req.body.description;
    const method = req.body.method
    const fees = req.body.fees;
    const faculty = req.body.faculty;
    
    const schedule = req.body.schedule;
      
    let newVal;
    const db = getDb();     
    db.collection('trainingCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        code = newVal;
        
        db.collection('trainingCounter').insertOne({count:newVal})
                .then(result=>{

                    
                    const training = new Training(code,title,category,description,method,fees,faculty,schedule);
                    //saving in database
                   
                    return training.save()
                    .then(resultData=>{
                        
                        return res.json({status:true,message:"Training/Course Enrolled",data:resultData["ops"][0]});
                        
                    })
                    .catch(err=>console.log(err));

                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })
       
}


exports.getAllTrainings=(req,res,next)=>{
    const email = req.body.email;
    const pwd = req.body.pwd;
    Training.fetchAllTrainings()
                .then(trainings=>{
                   
                    res.json({message:"All Data returned",AllTrainings:trainings})

                })
                .catch(err=>console.log(err));

}


exports.getSingleTraining=(req,res,next)=>{
  
    const code = req.params.code;
   
    Training.findTrainingByCode(JSON.parse(code))
    .then(trainingDoc=>{
        // console.log(trainingDoc);
        if(trainingDoc){
           
             res.json({status:true, Data:trainingDoc});
        }
        else{
            res.json({status:false,Message:"No such training exist"});

        }
       
     

    })
    
}






exports.postTrainingCourse = (req,res,next)=>{
  
    //parsing data from incoming request
   
    const trainingID = req.body.trainingID;
    const name = req.body.name;    
    const description = req.body.description;
    const method = req.body.method
    const fees = req.body.fees;
    const facultyName = req.body.facultyName;    
    const schedule = req.body.schedule;
    const meetingID = null;
    let code;
      
    let newVal;
    const db = getDb();     

    Training.findTrainingByCode(JSON.parse(trainingID))
    .then(training=>{
        if(!training)
        {
            return res.json({status:false,message:"training does not exist"});
        }

            db.collection('tcCounter').find().toArray().then(data=>{
                
                newVal = data[data.length-1].count;
            
                newVal = newVal + 1;
                console.log(newVal);
            
                code = newVal;
                
                db.collection('tcCounter').insertOne({count:newVal})
                        .then(result=>{          
            
                        
                        Training.trainingcourse(trainingID,code,name,description,method,fees,facultyName,schedule,meetingID)
                        .then(courseData=>{
                           
                            res.status(200).json({status:true,Data:courseData["ops"][0]});
           
                        })
                        .catch(err=>console.log(err));

                    })              
                 
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })
       
}


exports.getCourseTrainings=(req,res,next)=>{
  
    Training.fetchCourseTrainings()
                .then(trainings=>{
                   
                    res.json({message:"All Data returned",courses:trainings})

                })
                .catch(err=>console.log(err));

}


exports.getSingleCourseTraining=(req,res,next)=>{
  
    const id = req.params.id;
   
    Training.findTrainingCourseByTrID(JSON.parse(id))
    .then(trainingDoc=>{
        // console.log(trainingDoc);
        if(trainingDoc){
           
             res.json({status:true, courses:trainingDoc});
        }
        else{
            res.json({status:false,Message:"No such course exist"});
        }          
    })    
}

exports.getSingleCourseByTraining=(req,res,next)=>{
  
    const id = req.params.id;
   
    Training.findTrainingCourseByCrID(JSON.parse(id))
    .then(trainingDoc=>{
        // console.log(trainingDoc);
        if(trainingDoc){
           
             res.json({status:true, course:trainingDoc});
        }
        else{
            res.json({status:false,Message:"No such course exist"});
        }          
    })    
}


exports.getTrCourseByFacNm=(req,res,next)=>{
  
    const fac_name=req.body.fac_name;
   
    Training.findTrCourseByFacNm(fac_name)
    .then(trainingDoc=>{
       
         res.json({courses:trainingDoc});
               
    })    
}


exports.courseInTraining=(req,res,next)=>{
  
    const trainingId = req.body.trainingId;
    const courseId = req.body.courseId;

   
    Training.findCourseInTraining(+courseId,+trainingId)
    .then(trainingDoc=>{
        // console.log(trainingDoc);
        if(trainingDoc){
           
             res.json({status:true, course:trainingDoc});
        }
        else{
            res.json({status:false,Message:"No such course exist"});
        }          
    })    
}




exports.enrollTraining=(req,res,next)=>{

    console.log(req.file);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const dob = req.body.dob;
   
    const trainingCode = req.body.trainingCode;

    const db = getDb();

    Training.findEnrollmentByPhone(phone,trainingCode)
    .then(user=>{
        if(user)
        {
            return res.json({ status:false,Message:'Already Enrolled'});
        }

        db.collection('trainings').findOne({ Code:trainingCode })
        .then(trainingDetail=>{
                                                            
            //  if(!trainingDetail){
            //     return res.json({Enrolled:false, Message:"Enter Valid Training CODE"});
            //  }  

             Training.trainingEnroll(firstName,lastName,phone,email,dob,trainingCode)
             .then(enrollData=>{
                
                 res.status(200).json({Status:true,Data:enrollData["ops"][0]});

             })
             .catch(err=>console.log(err));

        })
        .catch(err=>console.log(err));
    })

}


exports.getAllEnrollment=(req,res,next)=>{
  
    Training.fetchAllEnrollments()
                .then(enrollments=>{                   
                    res.json({message:"All Data returned",Enrollments:enrollments})

                })
                .catch(err=>console.log(err));

}


exports.getSingleEnrollment=(req,res,next)=>{
  
    const phone = req.body.phone;
   
    Training.findEnrollByPhone(phone)
                .then(enrollments=>{
                   
                  

                    res.json({ enrollments:enrollments});
                })          

    
}





exports.editCourseTraining=(req,res,next)=>{
       //parsing data from incoming request
       const code = req.body.code;
       const trainingID = req.body.trainingID;
       const name = req.body.name;      
       const description = req.body.description;      
       const method = req.body.method
       const fees = req.body.fees;
       const faculty = req.body.faculty;        
       const schedule = req.body.schedule;

    Training.findTrainingCourseByCrID(code)
                .then(training=>{
                    if(!training)
                    {
                        return res.json({ message:'COurse Does not exist',status:false});
                    }

                    training.trainingId = trainingID
                    training.name = name;
                    training.description = description;
                    training.method = method;
                    training.fees = fees;
                    training.facultyName = faculty;
                    training.schedule = schedule;
                   
                   
                    const db = getDb();
                    db.collection('trainingsCourse').updateOne({courseCode:code},{$set:training})
                                .then(resultData=>{
                                    
                                    res.json({message:'Details Updated',status:true});
                                })
                                .catch(err=>console.log(err));


                })

}





exports.postMeetingId=(req,res,next)=>{
        
    const trainingId = req.body.trainingId;
    const courseId = req.body.courseId;        
    const meetingId = req.body.meetingId;

  Training.findCourseInTraining(+courseId,+trainingId)
             .then(training=>{
                 if(!training)
                 {
                     return res.json({ message:'Course Does not exist',status:false});
                 }

                 
                 training.meetingId = meetingId;
                
                
                 const db = getDb();
                 db.collection('trainingsCourse').updateOne({courseCode:courseId},{$set:training})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));


             })

}




exports.postTrCategory = (req,res,next)=>{

    let code ;
    const category_name = req.body.category_name;    
       
    let newVal;
    const db = getDb();     
    db.collection('trainingCategoryCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        code = newVal;
        
        db.collection('trainingCategoryCounter').insertOne({count:newVal})
                .then(result=>{
                            
                    
                    Training.trainingCategory(code,category_name)
                    .then(categoryData=>{
                       
                        res.status(200).json({status:true,data:categoryData["ops"][0]});
       
                    })
                    .catch(err=>console.log(err));                    

                
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })
   

}

exports.getAllTrCategories=(req,res,next)=>{
  
    Training.fetchAllTrCategories()
                .then(enrollments=>{                   
                    res.json({message:"All Data returned",categories:enrollments})

                })
                .catch(err=>console.log(err));

}



