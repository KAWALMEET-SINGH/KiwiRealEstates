import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className={`bg-slate-300 shadow-md`}>
      <div
        className={`flex justify-between items-center  max-w-6xl mx-auto p-4 `}
      >
        <section className={`flex justify-evenly items-center gap-2`}>
          {" "}
          <Logo />{" "}
          <h1 className={`font-bold text-sm sm:text-xl flex flex-wrap`}>
            <span className={`text-slate-500`}>Kiwi</span>
            <span className={`text-slate-800`}>Estates</span>
          </h1>
        </section>
        <form
          className={`bg-slate-100 p-2 rounded-lg flex justify-center items-center`}
        >
          <input
            type="text"
            placeholder="Search..."
            className={`bg-transparent focus:outline-none w-24 sm:w-64 md:w-41`}
          />
          <FaSearch className={`color-slate-500`} />
        </form>
        <ul className={`flex gap-3 `}>
          <Link to="/">
            <li
              className={`hidden sm:inline text-slate-700 hover:underline transition-colors duration-300`}
            >
              Home
            </li>
          </Link>
          <Link to="/about">
            <li
              className={`hidden sm:inline text-slate-700 hover:underline transition-colors duration-300`}
            >
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <img
                className={`relative inline-block h-7 w-7 !rounded-full  object-cover object-center border-gray-900 `}
                src={currentUser.avatar}
                alt="profile"
              />
            </Link>
          ) : (
            <Link to="/sign-in">
              <li
                className={`sm:inline text-slate-700 hover:underline transition-colors duration-300`}
              >
                Sign In
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
