const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const accessAllUsers = async(req, res)=>{
    try {
        const users = await Users.find({});
        if(users){
            res.status(200).json(users);
        }
        if(!users){
            res.status(404).json({message:'there are no users'})
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = async(id)=>{
    return jwt.sign({id}, 'prime_secret',{
        expiresIn:maxAge
    });
};

const signupUser = async (req, res)=>{
    const {email, password} = req.body;
    if(password.length < 8){
        res.status(400).json({message:'minimum password length is 8 characters'});
    }
    try {
        const user = await Users.findOne({email:email});
        if(user){
            res.status(401).json({message:'user already registered'});
        }
        if(!user){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await Users.create({
                email:email,
                password:hashedPassword
            });

            const token =createToken(user._id);
            res.cookie('jwt',token,{
                httpOnly:true,
                maxAge:maxAge * 1000
            });
            res.status(201).json({newUser:newUser._id});
        }
    } catch (error) {
        res.status(500).json(error.message);
    };
};

const userLogin = async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await Users.findOne({email:email});
        if(!user){
            res.status(404).json({message:'user not found'});
        }
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                res.status(200).json({message:"login successful"});
            }else{
                res.status(401).json({message:'wrong password'});
            }
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {accessAllUsers, signupUser, userLogin};