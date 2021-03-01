const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Employee
{
    constructor(empId,saloonId,empName,type,img,services,email,password)
    {
        this.empId = empId;
        this.saloonId = saloonId;        
        this.empName = empName;
        this.empType = type;
        this.empImg = img;
        this.empServices = services;
        this.email = email;
        this.password = password;
        
    }
 

    save()
    {
        const db = getDb();
        return db.collection('employees').insertOne(this);
                              
    }
   

    static fetchAllEmployees()
    {
        const db = getDb();
        return db.collection('employees').find().toArray()
                            .then(employees=>{
                               
                                return employees;
                            })
                            .catch(err=>console.log(err));
    }


    static findEmployeesBySaloonID(id)
    {
        const db = getDb();
                            
        return db.collection('employees').find({ saloonId:id}).toArray()
                                            .then(employeeData=>{
                                                                                                
                                                return employeeData;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findEmployeesByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('employees').find({ email:email}).toArray()
                                            .then(employeeData=>{
                                                                                                
                                                return employeeData;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static findEmployeeByEmpID(id)
    {
        const db = getDb();
                            
        return db.collection('employees').findOne({ empId:id })
                                            .then(employee=>{
                                                                                                
                                                return employee;  
                                            })
                                            .catch(err=>console.log(err));

    }
   

}


module.exports = Employee;

