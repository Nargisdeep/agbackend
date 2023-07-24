var express = require('express');
const userModel=require('../model/users.js')
const otpModel=require('../model/otp.js')
const tokenModel=require('../model/token.js')
const  ObjectID = require('mongodb').ObjectId;
var jwt=require('jsonwebtoken');
const nodemailer = require('nodemailer');
var fs=require('fs')
var Hogan=require('hogan.js')
var template=fs.readFileSync('./views/index.hjs','utf-8')
var comtemplate=Hogan.compile(template)

let mailTransporter = nodemailer.createTransport({
	service: 'gmail',
	method:'secure',
	auth: {
		user: 'nargisdeepkaur@gmail.com',
		pass: 'ipxazitgalyjxatp'
	}
});
mailTransporter.verify(function(error, success) {
	if (error) {
		  console.log(error);
	} else {
		  console.log('Server is ready to take our messages');
	}
});
exports.userPost=async(request,response) =>{
    const users=await userModel.find({})
    if(users.find((e)=>e.myemail==request.body.myemail)){
      return response.status(306).json({"message":"Email Already Existed"})
    }
    else if(users.find((e)=>e.mobile== request.body.mobile)){
      return response.status(306).json({"message":"Mobile Number Already Existed"})
    }
    const user=new userModel(request.body)
    let mailOptions = {
      from:'nargisdeepkaur@gmail.com',
      to: request.body.myemail,
      subject:`Welcome to AgileStory ${request.body.name}`,
      html:comtemplate.render({name:request.body.name})
    }
    mailTransporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error Occurs');
      } else {
        console.log('Email sent successfully');
      }
    })
    try{
      
        await user.save()
        response.status(200).send({status:true,user:user})
    }
    catch(error){
        await(error)
         response.status(500).send(error)
        
    }
  }
exports.emailsignin=async(request,response)=>{
    const email=request.body.email
    try{
      const user=await otpModel.findOne({"email":email})
      console.log(user)
      const otp=Math.ceil(Math.random()*(999999 - 100001) + 100001)
      console.log(otp)
      const otp2=JSON.stringify(otp)
      if(!user){
        const otp1=new otpModel({email:email,otp:otp2})
        otp1.save()   
      }
      else{
          console.log("heello")
          const user1=await otpModel.updateOne({email:email},{$set:{"otp":otp2}}) 
      }
      
    
      let mailOptions = {
          from:'nargisdeepkaur@gmail.com',
          to: email,
          subject: 'Verifying Your Mail',
          text:otp2
        };
      mailTransporter.sendMail(mailOptions, function(err, data) {
          if(err) {
            console.log('Error Occurs');
          } else {
            console.log('Email sent successfully');
          }
      })

      return response.status(200).send({status:true})
   }
   catch(error){
     return response.status(500).json(error)
   }  
}
exports.otpVerify=async(request,response)=>{

    const otp2=request.body.otp
    try{
      const otp1= await otpModel.findOne({"otp":otp2})
      console.log(otp1)
      
      if(!otp1){
       return response.status(422).json({"message":"OTP is not valid"})
      }
      else{
        console.log("Doneeeee")
        return response.status(200).send({status:true})
      }
    }
    catch(error){
      console.log(error)
      return response.status(500).json(error)
        
    }
}
exports.SignIn=async(request,response)=>{
    const email=request.body.email
    const password=request.body.password
     
    try{        
     const logger=await userModel.findOne({"email":email})
     if(!logger){
        return response.status(422).send({"message":"Either Email or Password is invalid"})
     }
     if(logger){
        if(logger.password==password){
            var token=jwt.sign({id:logger._id},"hyhbjmkiloferacsvvgw",{
               expiresIn:86400 
            })
            var to_ken=new tokenModel({token})
            await to_ken.save()
            return response.status(200).send({status:true,
                                             "_id":logger._id,
                                              "name":logger.name,
                                              "email":logger.myemail,
                                              "token":token})
        }
     }
    else{
       return response.status(422).send({"message":"Either Email or Passwod in Invalid"}) 
    }

    }
    catch(error){
         console.log(error)
         return response.status(500).json(error)
    }
}
