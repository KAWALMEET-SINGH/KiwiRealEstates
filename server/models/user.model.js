import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    avatar:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.m_E2GiWXc8IGEeYAbypLgAHaHa?w=208&h=208&c=7&r=0&o=5&dpr=1.5&pid=1.7"
    }

} , {timestamps: true});

const User = mongoose.model("User",userSchema);

export default User;