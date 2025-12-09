import mongoose from "mongoose";

const connectionString = "mongodb+srv://samyogkhadka247:samyog@cluster0.hq1mq.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"

async function connectToDatabase(){
   await mongoose.connect(connectionString)
    console.log("connected to mongoDB!")
}

export default connectToDatabase