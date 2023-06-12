const asyncHandler=require("express-async-handler");
const chat=require("../modals/chatModel");
const user=require('../modals/userModel');

const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body;

    if(!userId){
        console.log("userId param not sent with request");
        return res.sendStatus(400);
    }
    var isChat=await chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat=await user.populate(isChat,{
        path: "latestMessage.sender",
        select: "name pic email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.user._id, userId],
        };
    
        try {
          const createdChat = await chat.create(chatData);
          const FullChat = await chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
          );
          res.status(200).json(FullChat);
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
        }
      }
    });
    // doh logo k beech chat kaise create karte h
    // 1-agar login user kisi bhi user ka profile pe click karta h toh humko uska id bhejna hoga taki woh dono ek dusre se baat kare
    //output of the acess chat is-
//     {"_id":"chhatId createdd by mongo",
//         "chatname":"sender",
//          "isgroupchat":"false",
//          "users":[
//              {"_id":req.user._id,
//                  name:johndow,email:"",pic:"",
//                      createadat,updatedat
//              },{"_id":userId,
//                  name:janedow,email:"",pic:"",
//                      createadat,updatedat
//              }
//          ],
//          createadat,updatedat
//      }   


    const fetchChats = asyncHandler(async (req, res) => {
        try {
          chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
              results = await user.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
              });
              res.status(200).send(results);
            });
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
        }
      });
      
      //@description     Create New Group Chat
      //@route           POST /api/chat/group
      //@access          Protected
      const createGroupChat = asyncHandler(async (req, res) => {
        if (!req.body.users || !req.body.name) {
          return res.status(400).send({ message: "Please Fill all the feilds" });
        }
      
        var users = JSON.parse(req.body.users);
      
        if (users.length < 2) {
          return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
        }
      
        users.push(req.user);
      
        try {
          const groupChat = await chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
          });
      
          const fullGroupChat = await chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
      
          res.status(200).send({data:fullGroupChat});
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
          // console.log(error);
        }
      });
      
      // @desc    Rename Group
      // @route   PUT /api/chat/rename
      // @access  Protected
      const renameGroup = asyncHandler(async (req, res) => {
        const { chatId, chatName } = req.body;
      
        const updatedChat = await chat.findByIdAndUpdate(
          chatId,
          {
            chatName: chatName,
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      
        if (!updatedChat) {
          res.status(404);
          throw new Error("Chat Not Found");
        } else {
          res.json(updatedChat);
        }
      });
      
      // @desc    Remove user from Group
      // @route   PUT /api/chat/groupremove
      // @access  Protected
      const removeFromGroup = asyncHandler(async (req, res) => {
        const { chatId, userId } = req.body;
      
        // check if the requester is admin
      
        const removed = await chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      
        if (!removed) {
          res.status(404);
          throw new Error("Chat Not Found");
        } else {
          res.json(removed);
        }
      });
      
      // @desc    Add user to Group / Leave
      // @route   PUT /api/chat/groupadd
      // @access  Protected
      const addToGroup = asyncHandler(async (req, res) => {
        const { chatId, userId } = req.body;
      
        // check if the requester is admin
      
        const added = await chat.findByIdAndUpdate(
          chatId,
          {
            $push: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      
        if (!added) {
          res.status(404);
          throw new Error("Chat Not Found");
        } else {
          res.json(added);
        }
      });
      
      module.exports = {
        accessChat,
        fetchChats,
        createGroupChat,
        renameGroup,
        addToGroup,
        removeFromGroup,
      };