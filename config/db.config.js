const mongoose=require("mongoose")
require("dotenv").config()

const connectToDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")
    } catch (error) {
        console.log("Error connecting to DB")
    }
}

module.exports=connectToDB