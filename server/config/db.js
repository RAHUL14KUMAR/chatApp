const mongoose=require("mongoose");
const dotenv=require('dotenv');

dotenv.config();
const connectDb=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`mongodb connected:${conn.connection.host}`)
    }catch(error){
        console.log(`error:${error.message}`);
        process.exit();
}}

module.exports=connectDb