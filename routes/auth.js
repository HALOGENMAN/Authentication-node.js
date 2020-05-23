const express = require("express");
const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();
const {body} = require("express-validator");

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

module.exports = router;