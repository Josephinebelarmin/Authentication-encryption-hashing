//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//Secret String Instead of Two Keys

//var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
//userSchema.plugin(encrypt, { secret: secret });
//console.log(process.env.SECRET);
//encrypt only password instead of all database add  encryptedFields field.
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]  });


const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

console.log(md5(12345));

app.post("/register",function(req,res){
const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
});
newUser.save(function(err){
    if(!err){
     res.render("secrets");
    }
    else{
        console.log(err);
    }
})
});


app.post("/login", function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err,foundUSer){
        if(err){
            console.log("err");
        }
        else{
            if(foundUSer)
            {
                if(foundUSer.password === password)
                {
                                    res.render("secrets");

                }
            }
        }
    });
});

app.listen(3000, function(){
    console.log("server is listening in port 3000");
});