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
import { useNavigate,Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispach = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({});
  const [userListings, setUserListinga] = useState([]);
  console.log(userListings);
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
      dispach(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispach(signOutUserStart());

      const res = await fetch("api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispach(signOutUserFailure(data.message));
        return;
      }
      dispach(signOutUserSuccess(data));
    } catch (error) {
      dispach(signOutUserFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setListingError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setUserListinga(data);
    } catch (error) {
      setListingError(error.message);
    }
  };
  const handleListingDelete = async(listingId) =>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListinga((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
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
            onClick={() => {
              navigate("/create-listing");
            }}
            className={`bg-slate-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
          >
            Create Listing
          </button>
        </form>
        <div className={`flex flex-row justify-between my-3 py-2 gap-2`}>
          <p onClick={handleDeleteUser} className={`text-red-700`}>
            Delete Account
          </p>
          <p onClick={handleSignOut} className={`text-red-700`}>
            Sign Out
          </p>
        </div>
        {error && <p className={`text-red-600 mt-2`}>{error}</p>}
        {update && (
          <p className={`text-green-600 mt-2`}>User Updated Successfully</p>
        )}{" "}
        <div className={`flex flex-col justify-center items-center `}>
          <button
            className={`text-green-600 text-center`}
            onClick={handleShowListings}
          >
            Show Listings
          </button>
          {listingError && (
            <p className={`text-red-600 mt-2`}>{listingError}</p>
          )}
        </div>
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
