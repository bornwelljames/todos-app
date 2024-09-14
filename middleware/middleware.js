const Users = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.SECRET_KEY;
//login auth middleware
const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt;

    //check token existence && verify
    if(token){
        jwt.verify(token,secret_key,(err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/users/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/users/login');
    }
};

//check current user
const checkUser = (req, res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,secret_key, async(err, decodedToken)=>{
            if(err){
                res.locals.user = null;
                next();
            }else{
                let user = await Users.findOne({email:decodedToken.email});
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user =null;
        next();
    }
};

module.exports = {requireAuth, checkUser};