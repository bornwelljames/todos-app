const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.SECRET_KEY;

const accessAllUsers = async(req, res)=>{
    try {
        res.render('index',{
            title:"Hello Home Page"
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};
//get a signup form
const getSignup = async (req, res)=>{
    res.render('signup');
};


const signupUser = async (req, res)=>{
    const {email, password} = req.body;
    if(password.length < 8){
        res.status(400).json({message:'minimum password length is 8 characters'});
    }
    try {
        const user = await Users.findOne({email:email});
        if(user){
            res.status(401).redirect('./users/login');
            //.json({message:'user already registered'});
        }
        if(!user){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await Users.create({
                email:email,
                password:hashedPassword
            });

            // const token = jwt.sign({email:email}, secret_key,{expiresIn:2*60*60})
            // res.cookie('jwt',token,{
            //     httpOnly:true,
            //     maxAge:2*60*60*1000
            // });
            // console.log(token);
            res.status(201).redirect('/users/login');
            //json({newUser:newUser._id});
        }
    } catch (error) {
        res.status(500).json(error.message);
    };
};
//get login form
const getLogin = async (req, res)=>{
    res.render('login');
};
const userLogin = async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await Users.findOne({email:email});
        if(!user){
            res.status(404).redirect('/users/login');
            //.json({message:'user not found'});
        }
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                //jwt signage
                const token = jwt.sign({email:email}, secret_key,{expiresIn:2*60*60});
                res.cookie('jwt', token,{httpOnly:true,maxAge:2*60*60*1000})
                console.log(token);
                res.status(200).redirect('/users');
                //.json({user:user._id});
            }else{
                res.status(401).json({message:'wrong password'});
            }
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const userLogout = async(req, res)=>{
    res.cookie('jwt','',{
        maxAge:1
    });

    res.redirect('/users');
}
module.exports = {accessAllUsers, signupUser, getSignup, userLogin, getLogin, userLogout};