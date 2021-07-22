//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");



app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({
  extended:true
}));
mongoose.connect("mongodb://localhost:27017/Userdb",{ useNewUrlParser: true ,useUnifiedTopology: true });

const UserSchema=new mongoose.Schema({
  userEmail:{
    type:String,
    require:true
  },
  userPassword:{
    type:String,
    require:true
  }
});

UserSchema.plugin(encrypt, { secret:process.env.SECRET , encryptedFields: ["userPassword"]});
const User= new mongoose.model("User",UserSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  const name=req.body.username;
  const password=req.body.password;

  User.findOne({userEmail:name},function(err,founddoc){
    if(!err){
      if(founddoc.userPassword===password){
        res.render('secrets');
      }
    }else{
      res.send(err);
    }
  });
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
  const name=req.body.username;
  const password=req.body.password;
  const newUser=new User({
    userEmail:name,
    userPassword:password
  });
  newUser.save(function(err){
    if(!err)
    res.render('secrets');
    else
    res.send(err);
  });
});

app.listen(3000,function(){
    console.log("server is running");
});
