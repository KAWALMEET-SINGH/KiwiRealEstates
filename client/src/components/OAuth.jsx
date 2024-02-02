import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispach = useDispatch();
  const navigate = useNavigate();
  const handleGoogleBtn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          password: result.user.uid,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispach(signInSuccess(data));
      navigate("/");

    } catch (error) {
      console.log("Google Error", error);
    }
  };
  return (
    <button
      onClick={handleGoogleBtn}
      type="button"
      className={`bg-red-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
    >
      Continue With Google
    </button>
  );
};

export default OAuth;
