import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";


const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

 const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });
  
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

 
const User = new mongoose.model("User", userSchema);
 
app.get("/",(req,res)=>{
    res.render("home.ejs");
  });
app.get("/login",(req,res)=>{
    res.render("login.ejs");
  });
app.get("/register",(req,res)=>{
    res.render("register.ejs");
  });
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
app.post("/register",(req,res)=>{
    const user= new User({
        email: req.body.username,
password: req.body.password
        
      });
    
      user.save();
      console.log("saved");
      res.render("secrets.ejs");
    

});
app.post("/login",(req,res)=>{
    const id = req.body.username;
    const pwd = req.body.password;
    User.findOne({email:id},{password:pwd})
    .then(function(founduser){
        if (!founduser) return res.redirect("/register");
        res.render("secrets.ejs");
    })
    .catch(function(err){});
 
});
    
