const user  = require("../models/user")
const bcrypt = require("bcryptjs");

exports.getCreateUser = (req,res,next) =>{
    res.render("createUser")
}

exports.postCreateUser = (req,res,next) => {
    bcrypt.hash(req.body.password,12)
    .then(hashPass=>{
        User = new user({
            email:req.body.email,
            password:hashPass
        })
        return User.save()
    })
    .then(()=>{
        res.redirect("/")
    })
    .catch(err=>{
        next(err)
    })
}