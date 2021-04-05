const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;

const fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('./sslcert/c3b1fabb5b44ce7a.pem');
var certificate = fs.readFileSync('./sslcert/c3b1fabb5b44ce7a.crt');

var credentials = {key: privateKey, cert: certificate};

// var options = {
//   key: fs.readFileSync('./key.pem', 'utf8'),
//   cert: fs.readFileSync('./server.crt', 'utf8')
// };



require('dotenv').config({path: __dirname + '/.env'})
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
const legalRoutes = require('./routes/legalPolicies');
const notificationRoutes = require('./routes/notifications');
const versionRoutes = require('./routes/version');
const paymentRoutes = require('./routes/payment');



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

// serve static folder (admin-panel)
app.use(express.static("dist/FibiAppAdmin"));
app.use(express.static("dist1/PaymentIntegration"));


// show admin panel (built react app)
app.get("/admin*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "FibiAppAdmin", "index.html"));
});

// show payment
app.get("/web*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist1", "PaymentIntegration", "index.html"));
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
app.use('/api',legalRoutes);
app.use('/api',notificationRoutes);
app.use('/api',versionRoutes);
app.use('/api',paymentRoutes);


var httpsServer = https.createServer(credentials, app);

let port = process.env.PORT || 443;
//establishing DB connection
mongoConnect(()=>{
     
    //listening to incoming request on this port
   
    // app.listen(port);
    httpsServer.listen(port);

});
// httpsServer.listen(PORT, logger.info(`Server listening on port: ${PORT}`));