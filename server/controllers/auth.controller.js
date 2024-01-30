import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signUp = async(req,res,next) =>{
    const {username,email,password} = req.body;
    const passwordLock =  bcryptjs.hashSync(password,12);
    const newUser = new User({username,email,password:passwordLock});
    try{
         await newUser.save();
    res.status(201).json({"message" : "user created"});
}catch(e){
    next(e);
}
    }

export const signIn = async(req,res,next) =>{
    const {email,password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser){
            return next(errorHandler(404,"User Not Found"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword){
            return next(errorHandler(401,"Invaild Password "))
        }
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        const {password:pord,...rest} = validUser._doc;
        res
        .cookie("access_token",token,{httpOnly: true , expires: new Date(Date.now() + 24*60*60*1000 )})
        .status(200)
        .json(rest);
        
    } catch (error) {
        next(error)
        
    }
}    
   