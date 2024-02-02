import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";


const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);


  const handleSubmit = () =>{

  }
  return (
    <>
      <div className={`p-4 max-w-xl mx-auto`}>
        <h1 className={`text-3xl text-center font-bold my-10`}>Profile</h1>
        
        <form
          className={`flex flex-col justify-evenly gap-4`}
        >
          <img
                className={`h-24 w-24 !rounded-full  object-cover self-center border-gray-900 `}
                src={currentUser.avatar}
                alt="profile"
              />
          <input
            type="text"
            placeholder="username"
            className={`border p-4 rounded-lg`}
            id="username"
          />
          <input
            type="email"
            placeholder="email"
            className={`border p-4 rounded-lg`}
            id="email"
          />
          <input
            type="password"
            placeholder="password"
            className={`border p-4 rounded-lg`}
            id="password"
          />
          <button
            className={`bg-green-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
          >
            Update
          </button>
          <button
            className={`bg-slate-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
          >
            Create Listing
          </button>
        </form>
        <div className={`flex flex-row justify-between my-4 py-2 gap-2`}>
         <p className={`text-red-700`}>Delete Account</p>
         <p className={`text-red-700`}>Sign Out</p>
        </div>
      </div>
    </>
  )
}

export default Profile