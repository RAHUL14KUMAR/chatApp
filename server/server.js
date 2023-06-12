const express=require('express');
const cors=require('cors');
const router=require('./routes/userRoutes');
const chatRouter=require("./routes/chatRoutes");
const messageRouter=require("./routes/messageRoutes");
const dotenv=require('dotenv');
const {notfound,errorHandler}=require('./middleware/errorMiddleware');
const connectDb=require("./config/db");
const path=require('path');

dotenv.config();
connectDb();
const app=express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("API IS WORKING SOON")
})
app.use('/api/user',router);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);


// --------------------------------deployment code-------------------
const __dirname1=path.resolve();
if(process.env.NODE_ENV==='production'){

    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    // go to frontend folder and on the terminal type npm run build
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
    })
}else{
    app.get("/",(req,res)=>{
        res.send("API IS RUNNING SUCCESSFULLY");
    })
}
// -------------------------------------------------------------------

 app.use(notfound);
 app.use(errorHandler);

const port=process.env.port||4000;

const server=app.listen(port,()=>{
                console.log(`server is running at port ${port}`)
            });
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    // console.log("connected to socket.io");

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit("connected"); 
    })


    // onclick on any of the chat it will create a room for login user and that user that has been clicked for message
    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("user joined room "+room)
    })
    socket.on("typing", (room) => socket.in(room).emit("typing....."));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageReceived)=>{
        // first check received chat is belong to which room
        var chat=newMessageReceived.chat;

        if(!chat.users){
            return console.log('chat user is not defined')
        }

        chat.users.forEach(user=>{
            if(user._id==newMessageReceived.sender._id){
                return;
            }

            socket.in(user._id).emit("message received",newMessageReceived)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})


