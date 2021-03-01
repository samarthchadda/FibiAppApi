const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;



class Training
{
   
    constructor(code,category,desc,image)
    {
        this.trainingId = code;      
        this.trainingCategory = category;
        this.description = desc;        
        this.trainingImage = image;
       
        this.PostedDate = new Date();
        
    }

    //Syntax of Schedule
    // schedule = {schedules:[{SessionName:sessionNm,
        //                             TotalSessions:totalSessions,
        //                             WeeklySessions:weeklySessions,
        //                             AvailDay:availDay,
        //                             StartTime:srtTime,
        //                             EndTime:endTime
        //                             }]};

    save()
    {
        const db = getDb();
        return db.collection('trainings').insertOne(this);
                              
    }

    static fetchAllTrainings()
    {
        const db = getDb();
        return db.collection('trainings').find().toArray()
                            .then(trainings=>{
                               
                                return trainings;
                            })
                            .catch(err=>console.log(err));
    }

    static fetchCourseTrainings()
    {
        const db = getDb();
        return db.collection('trainingsCourse').find().toArray()
                            .then(trainings=>{
                               
                                return trainings;
                            })
                            .catch(err=>console.log(err));
    }

    static findCourseByCode(code)
    {
        const db = getDb();
                            
        return db.collection('trainings').findOne({ Code:code })
                                            .then(trainingDetail=>{
                                                                                              
                                                return trainingDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static findTrainingCourseByTrID(id)
    {
        const db = getDb();
                            
        return db.collection('trainingsCourse').find({ trainingId:id }).toArray()
                                            .then(trainingDetail=>{
                                                                                              
                                                return trainingDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findTrainingCourseByCrID(id)
    {
        const db = getDb();
                            
        return db.collection('trainingsCourse').findOne({ courseCode:id })
                                            .then(trainingDetail=>{
                                                                                              
                                                return trainingDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findCourseInTraining(crCode,trId)
    {
        const db = getDb();
                            
        return db.collection('trainingsCourse').findOne({ courseCode:crCode,trainingId:trId })
                                            .then(trainingDetail=>{
                                                                                              
                                                return trainingDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static findTrainingByCode(code)
    {
        const db = getDb();
                            
        return db.collection('trainings').findOne({ trainingId:code })
                                            .then(trainingDetail=>{
                                                                                              
                                                return trainingDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static trainingEnroll(fstName,lstNm,phone,email,dob,trainingID,trainingNm,code,userImg)
    {
        const db = getDb();     
        
                            
        return db.collection('trainingsEnroll').insertOne({FirstName:fstName,
                                                            LastName:lstNm,
                                                            Phone:phone,
                                                            Email:email,
                                                            DOB:dob,                                                            
                                                            TrainingId:trainingID,
                                                            TrainingName:trainingNm,
                                                            CourseCode:code,
                                                            userImage:userImg,
                                                            EnrollDate:new Date()
                                                        });

    }

    static trainingcourse(id,code,nm,desc,method,fees,facultyNm,sch,meetID)
    {
        const db = getDb();     
        
                            
        return db.collection('trainingsCourse').insertOne({trainingId:id,
                                                          courseCode:code,
                                                           name:nm,
                                                           description:desc,
                                                           method:method,
                                                           fees:fees,
                                                           facultyName:facultyNm,
                                                           schedule:sch,
                                                           meetingId:meetID
                                                        });

    }



    static trainingCategory(code,categoryNm)
    {
        const db = getDb();     
                                    
        return db.collection('trainingsCategory').insertOne({
                                                          Code:code,
                                                          CategoryName:categoryNm
                                                        });

    }

    static fetchAllTrCategories()
    {
        const db = getDb();
        return db.collection('trainingsCategory').find().toArray()
                            .then(trainings=>{
                               
                                return trainings;
                            })
                            .catch(err=>console.log(err));
    }



    static findTrCourseByFacNm(nm)
    {
        const db = getDb();
                            
        return db.collection('trainingsCourse').find({ facultyName:nm }).toArray()
                                            .then(trainingDetail=>{
                                                                                              
                                                return trainingDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static fetchAllEnrollments()
    {
        const db = getDb();
        return db.collection('trainingsEnroll').find().toArray()
                            .then(enrollments=>{
                               
                                return enrollments;
                            })
                            .catch(err=>console.log(err));
    }

    static findEnrollByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('trainingsEnroll').find({ Phone:phone}).toArray()
                                            .then(enrollDetail=>{
                                                                                                
                                                return enrollDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static findEnrollmentByPhone(phone,trainingCode,courseCode)
    {
        const db = getDb();
                            
        return db.collection('trainingsEnroll').findOne({ Phone:phone, TrainingId:trainingCode,CourseCode:courseCode})
                                            .then(enrollDetail=>{
                                                                                                
                                                return enrollDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

}


module.exports = Training;

