const Users = require('../models/users');
const bcrypt = require('bcrypt');
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

            res.status(201).json(newUser);
        }
    } catch (error) {
        res.status(500).json(error.message);
    };
};


module.exports = {accessAllUsers, signupUser};