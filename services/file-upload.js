const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
 
//providing some additional information for our aws service
aws.config.update({
    secretAccessKey:process.env.ACCESS_KEY,
    accessKeyId:process.env.ACCESS_KEY_ID,
    region:'us-east-1'
});


//creating instance of AWS S3
const s3 = new aws.S3();
 

// const fileFilter = (req, file, next) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//    next(null, true);
//   } else {
//    next(new Error('Wrong file type, only upload JPEG, JPG and/or PNG !'), 
//    false);
//   }
//  };



//creating upload object from multer
const upload = multer({
    // fileFilter:fileFilter,
  storage: multerS3({
  
    s3: s3,
    
    bucket: 'manusamarth',
    //access control for the file
    acl:'public-read',   //check all its values options from aws docs

    //metadata having callback(which is called when we are sending our image to aws)
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_META_DATA!'});
    },
    key: function (req, file, cb) {
              //key value is derived from timestamp of current time
      // cb(null, Date.now().toString())
      req.file = Date.now() + file.originalname;
      cb(null, Date.now() + file.originalname);
    }
  })
})

//key's callback is executed first , then metadata's callback
//then , the corresponding singleupload() function in routes/file-upload.js


module.exports = upload;
