const mongoose = require('mongoose');
const {isEmail} = require('validator');
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,'email field is required'],
        unique:true,
        validate:[isEmail,'provide valid email address']
    },
    password:{
        type:String,
        reqiured:[true, 'password field is required'],
        minlength:[8,'password must be at least 8 characters']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const User = mongoose.model('Users', userSchema);
module.exports = User;