const express = require('express');
const mongoose =require ('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const url= process.env.MONGO_URL;
const httpStatusText = require('./utils/httpStatusText');




mongoose.connect(url)
    .then(() => {
        console.log("mongodb connect success");
    })
    .catch((error) => {
        console.log("mongodb connection failed:", error);
    });
const app = express();
app.use('/uploads',express.static(path.join(__dirname,'uploads')));//to make the uploads folder public

app.use(express.json());

const courseRouter=require('./routes/courses.routes')
const userRouter=require('./routes/user.routes')

app.use('/api/courses',courseRouter);
app.use('/api/users',userRouter);
app.use(cors());


//global middleware for not found route and error handling
app.all('*',(req,res,next)=>{
    res.status(404).json({status:httpStatusText.ERROR, message:"route not found"})
});


//global error handling middleware
app.use((err,req,res,next)=>{
    res.status(err.statusCode || 500).json({status:err.statusText, message:err.message,code:err.statusCode || 500,data:null})
});

app.listen(process.env.PORT || 5000,()=>{
    console.log('Listening on port : 5000')
});
