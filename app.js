const express = require('express');
require('dotenv').config();
const userRouter = require('./routes/router');
const colors = require('colors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const dburi = process.env.DBURI;

//db initialization

mongoose.connect(dburi).then(()=>{
    console.log(colors.rainbow('database fired successfully...'));
    app.listen(port, ()=>{
        console.log(colors.italic('listening to reqs in port: ',port));
    });
}).catch((err)=>{
    console.log(err.message);
});

//middleware inits
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/users', userRouter);
app.use(morgan('combined'));