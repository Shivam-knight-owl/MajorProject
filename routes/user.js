const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController=require("../controllers/user");


router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",
        {failureRedirect:'/login',
        failureFlash:true}),
        userController.login);

// router.get("/signup",userController.renderSignUpForm);

// router.post("/signup",wrapAsync(userController.signUp));

// router.get("/login",userController.renderLoginForm);

// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local",
//     {failureRedirect:'/login',
//     failureFlash:true}),
//     userController.login);


router.get("/logout",userController.logout);

module.exports=router;