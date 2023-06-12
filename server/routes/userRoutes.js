const express=require("express");
const {registerUser,authUser,allUser} =require('../controllers/userController');
const { protect } = require("../middleware/authMiddleware");

const router=express.Router()

router.route('/all')
.get(protect,allUser);

router.route('/signup')
.post(registerUser)

router.route('/login')
.post(authUser)


module.exports=router