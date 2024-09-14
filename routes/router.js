const router = require('express').Router();
const controller = require('../controllers/controller');
const jwt = require('jsonwebtoken');
const {requireAuth, checkUser} = require('../middleware/middleware');


//check user in get routes
router.get('*', checkUser);
//access all users in database
router.get('/', requireAuth,controller.accessAllUsers);

//signup a user
router.post('/signup', controller.signupUser);

//get a signup form
router.get('/signup', controller.getSignup);

//login user
router.post('/login',controller.userLogin);

//get a login form
router.get('/login', controller.getLogin);

//logout user
router.get('/logout', controller.userLogout);

module.exports = router;