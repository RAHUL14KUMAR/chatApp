const asyncHandler=require("express-async-handler");
const User=require('../modals/userModel');
const generateToken=require("../config/generateToken")

const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body;

    if(!name||!email||!password){
        res.status(400);
        throw new Error("please enter all the details")
    }

    const userExists=await User.findOne({email:email})
    if(userExists){
        res.status(400);
        throw new Error("user already exists");
    }

    const users=await User.create({
        name:name,
        email:email,
        password:password,
        pic:pic
    })
    if(users){
        res.status(200).json({
            _id:users._id,
            name:users.name,
            email:users.email,
            pic:users.pic,
            token:generateToken(users._id)
        })
        console.log(generateToken(users._id));
    }else{
        res.status(400);
        throw new Error("failed to create the users");
    }
});

const authUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;

    const users=await User.findOne({email:email});
    if(users&&(await users.matchPassword(password))){
        res.status(200).json({
            _id:users._id,
            name:users.name,
            email:users.email,
            pic:users.pic,
            token:generateToken(users._id)
        })
        console.log(generateToken(users._id));
    }else{
        res.status(401);
        throw new Error("invalid email or password");
    }
})

// /api/user?search=rahul
// const allUser=asyncHandler(async(req,res)=>{
//     // const keyWord=req.query;
//     // console.log(keyWord);
//     console.log(req.user);
//     const keyWords=req.query.search?{
//         $or:[
//             {name:{$regex:req.query.search,$options:"i"}},
//             {email:{$regex:req.query.search,$options:"i"}}
//         ]
//     }:{}
//     console.log(keyWords);

//     const users=(await User.find(keyWords)).find({_id:{$ne:req.user._id}});
//     res.send(users);
// })
const allUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });

module.exports={registerUser,authUser,allUser};