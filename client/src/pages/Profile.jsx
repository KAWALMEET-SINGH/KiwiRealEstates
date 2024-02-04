import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { app } from "../firebase";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispach = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispach(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispach(updateUserFailure(data.message));

        return;
      }
      dispach(updateUserSuccess(data));
      setUpdate(true);
    } catch (error) {
      dispach(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispach(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",        
      });
      const data = await res.json();
      if (data.success === false) {
        dispach(deleteUserFailure(data.message));
        return;
      }
      dispach(deleteUserSuccess(data));

    } catch (error) {
      dispach(deleteUserFailure(error.message))
    }
  };
  const handleSignOut = async() =>{
    try {
      dispach(signOutUserStart());

      const res = await fetch('api/auth/signout');
      const data = await res.json();
      if (data.success === false){
      dispach(signOutUserFailure(data.message));
        return;
      }
      dispach(signOutUserSuccess(data));
      
    } catch (error) {
      dispach(signOutUserFailure(error.message));
      
    }
  }
  return (
    <>
      <div className={`p-4 max-w-xl mx-auto`}>
        <h1 className={`text-3xl text-center font-bold my-10`}>Profile</h1>

        <form
          onSubmit={handleSubmit}
          className={`flex flex-col justify-evenly gap-3`}
        >
          <input
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            className={`hidden`}
            accept="image/*"
            type="file"
            ref={fileRef}
          />
          <img
            onClick={() => fileRef.current.click()}
            className={`h-24 w-24 !rounded-full  object-cover self-center border-gray-900 `}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
          />
          <p className="text-sm self-center">
            {fileError ? (
              <span className="text-red-700">
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            placeholder={currentUser.username || "username"}
            className={`border p-4 rounded-lg`}
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder={currentUser.email || "email"}
            className={`border p-4 rounded-lg`}
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder={"password"}
            className={`border p-4 rounded-lg`}
            id="password"
            onChange={handleChange}
          />
          <button
            className={`bg-green-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <button
            type="button"
            className={`bg-slate-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
          >
            Create Listing
          </button>
        </form>

        <div className={`flex flex-row justify-between my-3 py-2 gap-2`}>
          <p onClick={handleDeleteUser} className={`text-red-700`}>
            Delete Account
          </p>
          <p onClick={handleSignOut} className={`text-red-700`}>Sign Out</p>
        </div>
        {error && <p className={`text-red-600 mt-2`}>{error}</p>}
        {update && (
          <p className={`text-green-600 mt-2`}>User Updated Successfully</p>
        )}
      </div>
    </>
  );
};

export default Profile;
