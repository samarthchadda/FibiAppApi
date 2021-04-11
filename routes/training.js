const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training');
const Training = require('../models/training');
const getDb = require('../util/database').getDB; 

const multer = require('multer');

var ImageKit = require("imagekit");
var fs = require('fs');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const now = new Date().toISOString(); const date = now.replace(/:/g, '-'); cb(null, date + file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
     cb(null,false);
    }
   
}

const upload = multer({storage:storage, limits:{fileSize:1024*1024*5},fileFilter:fileFilter});


router.get('/alltrainings',trainingController.getAllTrainings);

router.get('/all-training-courses',trainingController.getCourseTrainings);

router.get('/all-training-courses/:id',trainingController.getSingleCourseTraining);

router.get('/all-trainingCourse/:id',trainingController.getSingleCourseByTraining);

router.post('/courseInTraining',trainingController.courseInTraining);

router.post('/post-course-training',trainingController.postTrainingCourse);

router.post('/add-meetingId',trainingController.postMeetingId);


// https://prajhaapp.herokuapp.com/api/single-training/120
router.get('/single-training/:code',trainingController.getSingleTraining);



// https://prajhaapp.herokuapp.com/api/edit-course-training
router.post('/edit-course-training',trainingController.editCourseTraining);



// https://prajhaapp.herokuapp.com/api/enrollments
router.get('/enrollments',trainingController.getAllEnrollment);

router.post('/training-enrollment',trainingController.getSingleEnrollment);

router.post('/training-course-faculty',trainingController.getTrCourseByFacNm);

router.post('/post-training-category',trainingController.postTrCategory);

router.get('/get-training-categories',trainingController.getAllTrCategories);



const upload2 = multer();


// https://prajhaapp.herokuapp.com/api/enroll-training

router.post('/enroll-training' , upload2.single('userImage'),(req,res,next)=>{

    // console.log(req.file);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const dob = req.body.dob;   
    const trainingCode = req.body.trainingCode;
    const trainingName = req.body.trainingName;
    const courseCode = req.body.courseCode;


    var imagekit = new ImageKit({
        publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
        privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });

      var base64Img = req.file.buffer;



    const db = getDb();

    Training.findEnrollmentByPhone(phone,trainingCode,courseCode)
    .then(user=>{
        console.log(user);
        if(user)
        {
            return res.json({ status:false,message:'Already Enrolled'});
        }

        db.collection('trainings').findOne({ trainingId:JSON.parse(trainingCode) })
        .then(trainingDetail=>{
                                                            
             if(!trainingDetail){
                return res.json({status:false, message:"Enter Valid Training CODE"});
             }  

             imagekit.upload({
                file : base64Img, //required
                fileName : "enrollImg.jpg"   //required
               
            }, function(error, result) {
                if(error) {console.log(error);}
                else {
                    console.log(result.url);
        
                    Training.trainingEnroll(firstName,lastName,phone,email,dob,trainingCode,trainingName,courseCode,result.url)
                    .then(enrollData=>{
                       
                        res.status(200).json({status:true,data:enrollData["ops"][0]});
       
                    })
                    .catch(err=>console.log(err));
       
        
                }
            });
                     
        })
        .catch(err=>console.log(err));

    })


});





const upload1 = multer();

// SDK initialization



router.post('/post-training',upload1.single('trainingImage'),(req,res,next)=>{
  
    //parsing data from incoming request
    let code ;
   
    const trainingCategory = req.body.trainingCategory;    
    const description = req.body.description;


    var imagekit = new ImageKit({
        publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
        privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });

      var base64Img = req.file.buffer;

   
    let newVal;
    const db = getDb();     
    db.collection('trainingCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        code = newVal;
        
        db.collection('trainingCounter').insertOne({count:newVal})
                .then(result=>{

                    imagekit.upload({
                        file : base64Img, //required
                        fileName : "trainingImg.jpg"   //required
                       
                    }, function(error, result) {
                        if(error) {console.log(error);}
                        else {
                            console.log(result.url);
                
                             const db = getDb();
                  
                             const training = new Training(code,trainingCategory,description,result.url);
                             //saving in database
                            
                             training.save()
                             .then(resultData=>{
                                 
                                 return res.json({status:true,message:"Training/Course Enrolled",data:resultData["ops"][0]});
                                 
                             })
                             .catch(err=>console.log(err));
                           
                
                        }
                    });
                    


                
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })
       
}
);









module.exports = router;

