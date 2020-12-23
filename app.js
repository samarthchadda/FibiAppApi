const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

const ownerRoutes = require('./routes/owner');
const saloonRoutes = require('./routes/saloon');
const servicesRoutes = require('./routes/services');
const employeeRoutes = require('./routes/employee');
const availRoutes = require('./routes/availability');
const clientRoutes = require('./routes/client');
const trainingRoutes = require('./routes/training');
const adminRoutes = require('./routes/admin');
const appointmentRoutes = require('./routes/appointment');
const reportRoutes = require('./routes/report');




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
app.use('/api',availRoutes);
app.use('/api',clientRoutes);
app.use('/api',trainingRoutes);
app.use('/api',adminRoutes);
app.use('/api',appointmentRoutes);
app.use('/api',reportRoutes);


let port = process.env.PORT || 8080;
//establishing DB connection
mongoConnect(()=>{
     
    //listening to incoming request on this port
   
    app.listen(port);

});

