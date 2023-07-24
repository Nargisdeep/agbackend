const mongoose=require("mongoose")

const TokenSchema=new mongoose.Schema({
     token:{
        type:"string",
        unique:"true"
     }
})

const Token=mongoose.model("Token",TokenSchema)

module.exports=Token