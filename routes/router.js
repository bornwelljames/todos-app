const router = require('express').Router();
const controller = require('../controllers/controller');

//access all users in database
router.get('/', controller.accessAllUsers);

//signup a user
router.post('/signup', controller.signupUser);

//login user
router.post('/login', controller.userLogin);

//logout user
router.get('/');

module.exports = router;