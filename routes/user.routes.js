const express = require('express');
//const {body} =require('express-validator');

const userController= require("../controllers/users.controller");
const router= express.Router();//instant of the reoutes that i use
const verifyToken=require('../middlewares/verfiyToken');
//const { validationSchema } = require('../middlewares/validationSchema');

//multer configuration for file upload
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType === 'image') {
        return cb(null, true);
    }else{
        return cb(new Error('Only image files are allowed!'), false);
    }
}
const multer=require('multer');
const upload=multer({storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split('/')[1];
        const fileName ='user-${Date.now()}.${fileExtension}' 
        cb(null, fileName); 
    }

}),fileFilter})

//get all user
//register
//login
//route ->resource , reoute handeler (contrroler)
router.route('/')
            .get(verifyToken,userController.getAllUser)

router.route('/register')
            .post(upload.single('avatar'),userController.register)

router.route('/login')
            .post(userController.login)


module.exports= router;