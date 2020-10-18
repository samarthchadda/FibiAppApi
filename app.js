const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

const ownerRoutes = require('./routes/owner');
const saloonRoutes = require('./routes/saloon');
const servicesRoutes = require('./routes/services');
const employeeRoutes = require('./routes/employee');
const trainingRoutes = require('./routes/training');
const newsRoutes = require('./routes/news');
const subAdminRoutes = require('./routes/sub-admin');
const appointmentRoutes = require('./routes/appointment');
const adminRoutes = require('./routes/admin');




app.use('/uploads',express.static('uploads'));
app.use('/uploadCourses',express.static('uploadCourses'));
app.use('/uploadNews',express.static('uploadNews'));
app.use('/uploadFaculty',express.static('uploadFaculty'));



app.use(bodyParser.json());  //for application/json data



//enabling CORS package
app.use((req,res,next)=>{
    //setting header to all responses
    res.setHeader('Access-Control-Allow-Origin','*');  
                                           
                        //specifying which methods are allowed
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');

    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');

    next();  //so that request continues to next middleware
});

app.get('/',(req,res)=>{
    res.json({message:"deploy api"});
});
app.use('/api',ownerRoutes);
app.use('/api',saloonRoutes);
app.use('/api',servicesRoutes);
app.use('/api',employeeRoutes);
app.use('/api',trainingRoutes);
app.use('/api',newsRoutes);
app.use('/api',subAdminRoutes);
app.use('/api',appointmentRoutes);
app.use('/api',adminRoutes);



let port = process.env.PORT || 8080;
//establishing DB connection
mongoConnect(()=>{
     
    //listening to incoming request on this port
   
    app.listen(port);

});

