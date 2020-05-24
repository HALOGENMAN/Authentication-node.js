const User  = require("../models/user")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator")
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"Shayak.malakar.159@gmail.com",
        pass:"159951sm357753",
    }
})

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
        return transporter.sendMail({
            from:"Shayak.malakar.159@gmail.com",
            to:req.body.email,
            subject:"Accoutnt Created",
            text:"thanks for using our services"
        })
    })
    .then(()=>{
        res.redirect("/login")
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
                    return transporter.sendMail({
                        from:"Shayak.malakar.159@gmail.com",
                        to:req.body.email,
                        subject:"Succesfully loggedIn",
                        text:"thanks for using our services"
                    })
                })
            }
            else{
                return next("password didnot matched")
            }
        })
        .then(()=>{
            res.redirect("/")
        })
    })
    .catch(err=>{
        next(err)
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

exports.getNewPassword = (req,res,next)=>{
    res.render("newPassword")
}

exports.postNewPassword = (req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(error.array())
    }
    console.log(req.body.email)
    res.redirect("/")
}