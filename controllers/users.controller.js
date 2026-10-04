const asyncWrapper=require('../middlewares/asyncWrapper');
const users=require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bycrypt=require('bcryptjs');
const generateJWT=require('../utils/generateJWT');


const getAllUsers=asyncWrapper(async(req,res)=>{
        const query=req.query;
        const limit=parseInt(query.limit) || 10;
        const page=parseInt(query.page) || 1;
        const skip=(page-1)*limit;
        const user=await users.find({},{"__v":false,'password':false}).limit(limit).skip(skip);
        res.json({status:httpStatusText.SUCCESS, data:{user}})
})

const register= asyncWrapper(async(req,res,next)=>{
    const{firstName,lastName,email,password,role} = req.body;

    const existingUser = await users.findOne({email:email});
    if(existingUser){
        const error = appError.create("email already exists",400,httpStatusText.FAIL);
        return next(error)
    }
    //password hashing can be done here before saving the user to the database for security purposes.
    const hashedPassword =await bycrypt.hash(password,10);

    const user = new users
    ({firstName,
        lastName,
        email,password:hashedPassword,
        role,
        avatar:req.file.fileName});
    //generate a token for the user(access token)
    const token = await generateJWT({email:user.email,id:user._id,role:user.role});
    user.token=token;
    await user.save();
    res.status(201).json({status:httpStatusText.SUCCESS, data:{user}})

})

const login=asyncWrapper(async(req,res,next)=>{  
    const {email,password} = req.body;
    if(!email || !password){
        const error = appError.create("email and password are required",400,httpStatusText.FAIL);
        return next(error);
    }
    const user=await users.findOne({email:email});
    if(!user){
        const error = appError.create("invalid email or password",401,httpStatusText.FAIL);
        return next(error);
    }
    const isMatch=await bycrypt.compare(password,user.password);
    if(!isMatch){
        const error = appError.create("invalid email or password",401,httpStatusText.FAIL);
        return next(error);
    }
    const token = await generateJWT({email:user.email,id:user._id,role:user.role});
    res.status(200).json({status:httpStatusText.SUCCESS, data:{token}});
})



module.exports={
    getAllUsers,
    register,
    login
}