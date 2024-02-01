import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispach = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispach(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispach(signInFailure(data.message));

        return;
      }
      dispach(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispach(signInFailure(error.message));
    }
  };
  return (
    <>
      <div className={`p-4 max-w-xl mx-auto`}>
        <h1 className={`text-3xl text-center font-bold my-10`}>Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col justify-evenly gap-4`}
        >
          <input
            type="email"
            placeholder="email"
            className={`border p-4 rounded-lg`}
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className={`border p-4 rounded-lg`}
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className={`bg-slate-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className={`flex flex-row my-4 py-2 gap-2`}>
          <p>Create an account?</p>
          <Link to="/sign-up">
            <span className={`text-blue-700`}>Sign Up</span>
          </Link>
        </div>
        {error && <p className={`text-red-600 mt-5`}>{error}</p>}
      </div>
    </>
  );
};

export default SignIn;
