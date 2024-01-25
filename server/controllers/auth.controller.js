import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async(req,res) =>{
    const {username,email,password} = req.body;
    const passwordLock =  bcryptjs.hashSync(password,12);
    const newUser = new User({username,email,password:passwordLock});
    try{
         await newUser.save();
    res.status(201).json({"message" : "user created"});
}catch(e){
res.status(500).json(e.message);
}
    }
   