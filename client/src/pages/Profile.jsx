import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(formData);
  const handleSubmit = () => {};
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
        console.log(filePercentage);
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
  return (
    <>
      <div className={`p-4 max-w-xl mx-auto`}>
        <h1 className={`text-3xl text-center font-bold my-10`}>Profile</h1>

        <form className={`flex flex-col justify-evenly gap-4`}>
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
            placeholder={"username"}
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
  );
};

export default Profile;
