const jwt=require('jsonwebtoken');
const httpStatusText=require('../utils/httpStatusText');
const appError=require('../utils/appError');
const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['authorization']||req.headers['Authorization'];
    if(!authHeader){
        const error=appError.create("authorization header is missing",401);
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    try{
    const currentUser = jwt.verify(token,process.env.JWT_SECRET_KEY)

    req.currentUser=currentUser;
    next();  
    }
    catch(err){
        const error=appError.create("invalid token",401);
        return next(error);
    }
}
module.exports=verifyToken;