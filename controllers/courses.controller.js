const {validationResult} =require('express-validator');
const Course =require('../models/couses');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const asyncWrapper=require('../middlewares/asyncWrapper');

//let courses = require('../data/courses');


const getAllCourses=asyncWrapper(
    async(req,res)=>{
    const query=req.query;
    const limit=parseInt(query.limit) || 10;
    const page=parseInt(query.page) || 1;
    const skip=(page-1)*limit;
    const courses=await Course.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({status:httpStatusText.SUCCESS, data:{courses}})
}
)
const getCoursesId=asyncWrapper(
    async(req,res)=>{
    
        const course =await Course.findById(req.params.courseId);
    if(!course)
    {
        AppError.create("course not found",404,httpStatusText.FAIL);

        return next(error);
        //return res.status(404).json({status:httpStatusText.FAIL, data:{course:"course not found"}})
    }
    res.json({status:httpStatusText.SUCCESS, data:{course}});
    

})

const addCourse=asyncWrapper(
    async(req,res)=>{

    const errors=validationResult(req);
    
    if(!errors.isEmpty())
    {
        return res.status(400).json({status:httpStatusText.FAIL, data:errors.array()});
        
    }

    const newCourse =new Course(req.body);
    await newCourse.save()
    res.status(201).json({status:httpStatusText.SUCCESS, data:{course:newCourse}});//201 created
})

const updateCourse=async(req,res)=>{
    const course =await Course.updateOne({_id:req.params.courseId},{$set:{...req.body}});
    if(!course)
    {
        return res.status(404).json({status:httpStatusText.FAIL, data:{course:"course not found"}})
    }
    return res.status(200).json({status:httpStatusText.SUCCESS, data:{course}});


}

const deleteCourse=async(req,res)=>{
    await Course.deleteOne({_id:req.params.courseId});
    res.status(200).json({status:httpStatusText.SUCCESS, data:null})
}


module.exports={
    getAllCourses,
    getCoursesId,
    addCourse,
    updateCourse,
    deleteCourse
}