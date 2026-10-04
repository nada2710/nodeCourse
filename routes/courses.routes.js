const express = require('express');
const {body} =require('express-validator');
const userRoles=require('../utils/userRoles');

const router= express.Router();//instant of the reoutes that i use
const coursesController= require("../controllers/courses.controller");
const { validationSchema } = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verfiyToken');


//route ->resource , reoute handeler (contrroler)
router.route('/')
            .get(coursesController.getAllCourses)
            .post(validationSchema,coursesController.addCourse)

router.route('/:id')
            .get(coursesController.getCoursesId)
            .patch(coursesController.updateCourse)
            .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),coursesController.deleteCourse)//authz

module.exports= router;