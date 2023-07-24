const mongoose=require("mongoose")

const usersSchema= new mongoose.Schema({
  
    name:{
        type:String,
        required:true
    },
    myemail:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const Users = mongoose.model("Users",usersSchema)

module.exports = Users