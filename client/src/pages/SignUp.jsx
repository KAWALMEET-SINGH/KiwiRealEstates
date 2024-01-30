import React, { useState } from 'react'
import {Link} from "react-router-dom"

const SignUp = () => {
  const [formData,setFormData] = useState({});
  const handleChange = (e) =>{
    setFormData({...formData, 
    [e.target.id]:e.target.value,
    })
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const res =  await fetch('/api/auth/signup',{
      method: 'POST',
      headers:{
        "Content-Type":'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);
  }
  return (
    <>
    <div className={`p-4 max-w-xl mx-auto`}>
      <h1 className={`text-3xl text-center font-bold my-10`}>Sign Up</h1>
      <form onSubmit={handleSubmit} className={`flex flex-col justify-evenly gap-4`}>
        <input type='text' placeholder='username' className={`border p-4 rounded-lg`} id="username" onChange={handleChange} />
        <input type='email' placeholder='email' className={`border p-4 rounded-lg`} id="email" onChange={handleChange}/>
        <input type='password' placeholder='password' className={`border p-4 rounded-lg`} id="password" onChange={handleChange}/>
      <button className={`bg-slate-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`} >Sign Up</button>
      <button className={`bg-slate-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`} >Continue With Google</button>
      </form>
      <div className={`flex flex-row my-4 py-2 gap-2`}>
        <p>Have an account?</p>
      <Link to="/sign-in"><span className={`text-blue-700`}>Sign In</span></Link>
      </div>
    </div>
    </>
  )
}

export default SignUp
