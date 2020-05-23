const User  = require("../models/user")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator")


exports.getCreateUser = (req,res,next) =>{
    res.render("createUser",{})
}

exports.postCreateUser = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(errors.array())
    }
    bcrypt.hash(req.body.password,12)
    .then(hashPass=>{
        user = new User({
            email:req.body.email,
            password:hashPass
        })
        return user.save()
    })
    .then(()=>{
        res.redirect("/")
    })
    .catch(err=>{
        next(err)
    })
}

exports.getLogin = (req,res,next)=>{
    res.render("login");
}

exports.postLogin = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(errors.array())
    }
    User.findOne({email:req.body.email})
    .then(user=>{
        return bcrypt.compare(req.body.password,user.password)
        .then(check=>{
            if(check){
                req.session.user = user,
                req.session.isLoggedIn = true,
                req.session.save(err=>{
                    if(err){
                        return next(err)
                    }
                    res.redirect("/")
                })
            }
            else{
                return next("password didnot matched")
            }
        })
    })
    
}

exports.postLogout = (req,res,next)=>{
    req.session.destroy(err=>{
        if(err){
            return next(err)
        }
        res.redirect("/")
    })
}