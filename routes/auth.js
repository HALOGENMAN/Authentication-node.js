const express = require("express");
const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();
const {body,param} = require("express-validator");

router.get("/",authController.getCreateUser)
router.post("/postCreateUser",[
    body("email")
    .isEmail()
    .withMessage("enter valid email")
    .custom((val,{req})=>{
        return User.findOne({email:val})
        .then(check=>{
            if(check){
                return Promise.reject("Email alreagy exist")
            }
        })
    })
    ,
    body("password","didnot fullfill he critearea")
    .isLength({min:5})
    .isAlphanumeric()
    .trim()
    ,
    body("conformPassword","password didnot matched")
    .custom((val,{req})=>{
        if(val != req.body.password ){
            throw new Error("password did not matched")
        }
        return true;
    })
    .trim()
],authController.postCreateUser)

router.get("/login",authController.getLogin);

router.post("/login",[
    body("email")
    .custom((val,{req})=>{
        return User.findOne({email:val})
        .then(check=>{
            if(!check){
                return Promise.reject("User not exist")
            }
        })
    })
    ,
    body("password")
    .isAlphanumeric()
    .isLength({min:5})
    .trim()
],authController.postLogin);

router.post("/logout",authController.postLogout)

router.get("/newPassword",authController.getNewPassword)

router.post("/newPassword",[
    body("email")
    .isEmail()
    .withMessage("enter prper email")
    .custom((val,{req})=>{
        return User.findOne({email:val})
        .then(check=>{
            if(!check){
                return Promise.reject("Email does not exist")
            }
        })
    })
],authController.postNewPassword)

router.get("/reset/:token",[
    param("token")
    .custom((val,{req})=>{
        return User.findOne({resetToken:val,resetTokenExpiration:{ $gt: Date.now()}})
        .then(check => {
            if(!check){
                return Promise.reject("link is not valid")
            }
        })
    })
],authController.getSaveNewPassword)

router.post("/new-password",[
    body("id")
    .custom((val,{req})=>{
        return User.findOne({_id:val})
        .then(check=>{
            if(!check){
                return Promise.reject("user not exist")
            }
        })
    })
    ,
    body("password","length must be greater then 5 char")
    .isAlphanumeric()
    .isLength({min:5})
    .trim()
],authController.postNewPassword)

module.exports = router;