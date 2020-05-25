const User  = require("../models/user")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator")
const nodemailer = require("nodemailer")
const crypto = require("crypto")

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
            password:hashPass,
            resetToken :undefined,
            resetTokenExpiration:undefined
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
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return next(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            user.resetToken = token,
            user.resetTokenExpiration = Date.now()  + 3600000;
            return user.save()
        })
        .then(()=>{
            res.send("<h1>email has been sent Plzz check it and click the link<h1>")
            return transporter.sendMail({
                from:"Shayak.malakar.159@gmail.com",
                to:req.body.email,
                subject:"Change password",
                text:`http://localhost:3000/reset/${token}`
            })
        })
        .catch(err=>{
            next(err)
        })
    })
    
}

exports.getSaveNewPassword = (req,res,next)=>{
    const token = req.params.token;
    const  error = validationResult(req)
    if(!error.isEmpty()){
        return next(error.array())
    }
    User.findOne({resetToken:token})
    .then(user=>{
        res.render("saveNewPassword",{
            userId:user._id.toString()
        })
    })
    .catch(err=>{
        next(err)
    })

}

exports.postSaveNewPassword = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(errors.array())
    }
    User.findOne({_id:req.body.id})
    .then(user=>{
        return bcrypt.hash(req.body.password,12)
        .then(pass=>{
            user.password = pass;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save()
        })
        .then(()=>{
            res.redirect("/")
        })
    })
    .catch(err=>{
        next(err)
    })
}