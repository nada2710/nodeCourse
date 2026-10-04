const appError=require('../utils/appError');

module.exports=(...roles)=>{
//...=>convert the roles to an array of roles
    return (req,res,next)=>{
    if(!roles.includes(req.currentUser.role)){
        const error=appError.create("you are not allowed to access this route",403);
        return next(error);
    }   
        next();
    }
}