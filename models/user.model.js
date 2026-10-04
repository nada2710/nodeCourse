const mongoose=require('mongoose');
const validator=require('validator');
const userRoles=require('../utils/userRoles');



const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },  
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,//is a helper to make sure that the email is unique in the database
        validate:[validator.isEmail,'Please provide a valid email']
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    role:{
        type:String,
        enum:[userRoles.USER,userRoles.ADMIN,userRoles.MANAGER], 
        default:userRoles.USER
    },
    avatar:{
        type:String,
        default:'uploads/profile.jpg'
    }
});



module.exports=mongoose.model('User',userSchema);
