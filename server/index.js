import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser  from 'cookie-parser'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from './routes/listing.route.js'

dotenv.config();

mongoose.connect(process.env.DBURI).then(() => {
    console.log('Connected To DB ');
}).catch((e) => {
    console.log(e);
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
app.get('/',(req,res) =>{
    res.json({
        message :'Help World!!',
    })
})

app.use((err,req,res,next)=>{
    const status = err.statusCode || 500 ;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({
        success : false,
        statusCode:status,
        message
    })
})

app.listen(3000,() =>{
console.log("server started");
}
);


