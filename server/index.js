import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

mongoose.connect(process.env.DBURI).then(() => {
    console.log('Connected To DB ');
}).catch((e) => {
    console.log(e);
});

const app = express();

app.listen(3000,() =>{
console.log("server started");
}
)
