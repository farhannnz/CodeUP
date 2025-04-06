const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(

    {
        title:{
            type:String,
            required:true
        },
        subTitle:{
            type:String,
        },
        description:{
            type:String,
        },
        category:{
            type:String,
            required:true
        },
        courseLvel:{
            type:String,
            enum:["Medium","Begginer","Advanced"]
        },
        Price:{
            type:Number,
            
        },
        thumbnail:{
            type:String,
        },
        enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
        ],
        lectures:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Lecture"
            }
        ]

        
    } , { timestamps: true }

);

module.exports = mongoose.model("Course", courseSchema);
