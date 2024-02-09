import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateLisitng = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "sale",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false){
        console.log(data.error);
        return
      }
      console.log(data);
      setFormData(data);
    };
    fetchListing();
  }, []);

  const handleSubmitImages = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length < 7) {
      const promises = [];
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image size too large (2mb allowed)");
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError("Add atleast 1 image");
      setUploading(false);
    } else {
      setImageUploadError("Only 6 images allowed");
      setUploading(false);
    }
  };
  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleDataChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "furnished" ||
      e.target.id === "parking" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length === 0) {
        return setFormSubmitError("User must add one picture of the listing");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setFormSubmitError(
          "Dicounted price should be less than regular price"
        );
      }
      setFormSubmitLoader(true);
      setFormSubmitError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setFormSubmitLoader(false);
      if (data.success === false) {
        setFormSubmitError(data.message);
        setFormSubmitLoader(false);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setFormSubmitError(error.message);
      console.log(error);
    }
  };
  return (
    <>
      <main className={`p-2 max-w-4xl mx-auto `}>
        <h1 className={`text-3xl font-semibold text-center my-7`}>
          Update a Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col sm:flex-row gap-3`}
        >
          <div className={`flex flex-col gap-3 flex-1`}>
            <input
              required
              className={`border p-3 rounded-lg`}
              maxLength="64"
              minLength="4"
              type="text"
              placeholder="Name"
              name="name"
              id="name"
              onChange={handleDataChange}
              value={formData.name}
            />
            <textarea
              required
              className={`border p-3 rounded-lg`}
              type="text"
              placeholder="Description"
              name="description"
              id="description"
              onChange={handleDataChange}
              value={formData.description}
            />
            <input
              required
              className={`border p-3 rounded-lg`}
              type="text"
              placeholder="Address"
              name="address"
              id="address"
              onChange={handleDataChange}
              value={formData.address}
            />
            <div className={`flex flex-row  flex-wrap gap-3`}>
              <div className={`flex gap-2`}>
                <input
                  className={`w-5`}
                  type="checkbox"
                  name="sale"
                  id="sale"
                  onChange={handleDataChange}
                  checked={formData.type === "sale"}
                />
                <label htmlFor="sale">Sell</label>
              </div>
              <div className={`flex gap-2`}>
                <input
                  className={`w-5`}
                  type="checkbox"
                  name="rent"
                  id="rent"
                  onChange={handleDataChange}
                  checked={formData.type === "rent"}
                />
                <label htmlFor="rent">Rent</label>
              </div>
              <div className={`flex gap-2`}>
                <input
                  className={`w-5`}
                  type="checkbox"
                  name="parking"
                  id="parking"
                  onChange={handleDataChange}
                  checked={formData.parking}
                />
                <label htmlFor="parking">Parking Spot</label>
              </div>
              <div className={`flex gap-2`}>
                <input
                  className={`w-5`}
                  type="checkbox"
                  name="furnished"
                  id="furnished"
                  onChange={handleDataChange}
                  checked={formData.furnished}
                />
                <label htmlFor="furnished">Furnished</label>
              </div>
              <div className={`flex gap-2`}>
                <input
                  className={`w-5`}
                  type="checkbox"
                  name="offer"
                  id="offer"
                  onChange={handleDataChange}
                  checked={formData.offer}
                />
                <label htmlFor="offer">Offer</label>
              </div>
            </div>
            <div className={`flex flex-wrap flex-row gap-5 `}>
              <div className={`flex items-center gap-2`}>
                <input
                  className={`p-3 border border-gray-300 rounded-lg w-12`}
                  min="1"
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  onChange={handleDataChange}
                  value={formData.bedrooms}
                />
                <label htmlFor="bedrooms">Beds</label>
              </div>
              <div className={`flex items-center gap-2`}>
                <input
                  className={`p-3 border border-gray-300 rounded-lg w-12`}
                  min="1"
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  onChange={handleDataChange}
                  value={formData.bathrooms}
                />
                <label htmlFor="bathrooms">Baths</label>
              </div>
              <div className={`flex items-center gap-2`}>
                <input
                  className={`p-3 border border-gray-300 rounded-lg`}
                  min="1"
                  type="number"
                  name="regularPrice"
                  id="regularPrice"
                  onChange={handleDataChange}
                  value={formData.regularPrice}
                />
                <div className={`flex flex-col items-center `}>
                  <label htmlFor="regularPrice">Regular Price</label>
                  <span className={`text-xs text-center`}>
                    ( &#8377;/month){" "}
                  </span>
                </div>
              </div>
              {formData.offer && (
                <div className={`flex items-center gap-2`}>
                  <input
                    className={`p-3 border border-gray-300 rounded-lg`}
                    min="1"
                    type="number"
                    name="discountPrice"
                    id="discountPrice"
                    onChange={handleDataChange}
                    value={formData.discountPrice}
                  />
                  <div className={`flex flex-col items-center `}>
                    <label htmlFor="discountPrice">Discounted Price</label>
                    <span className={`text-xs    text-center`}>
                      ( &#8377;/month){" "}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`flex flex-col gap-3 flex-1`}>
            <p className={`font-semibold`}>
              Images:
              <span className={`font-normal text-gray-600 ml-1`}>
                First image is cover (max 6)
              </span>
            </p>
            <div className={`flex gap-4`}>
              <input
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
                className={`p-3 border border-gray-300 rounded w-full`}
                type="file"
                id="images"
                multiple
              />
              <button
                disabled={uploading}
                onClick={handleSubmitImages}
                className={`p-3 border border-green-600 uppercase text-green-700 rounded  hover:shadow-xl hover:opacity-90 `}
                type="button"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((urls, index) => (
                <div className={`flex justify-between p-3 border items-center`}>
                  <img
                    key={urls}
                    src={urls}
                    alt="listing image"
                    className={`w-20 h-20 object-contain rounded-lg`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className={`p-3 text-red-700 rounded-lg uppercase hover:opacity-85`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            <p className={"font-medium text-red-700"}>
              {imageUploadError && imageUploadError}
            </p>
            <button
              disabled={formSubmitLoader || uploading}
              className={`p-3 bg-slate-700 text-white rounded-lg uppercase w-full hover:opacity-95 disabled:opacity-90`}
            >
              {formSubmitLoader ? "Updating..." : "Update listing"}
            </button>
            <p className={"font-medium text-red-700"}>
              {formSubmitError && formSubmitError}
            </p>
          </div>
        </form>
      </main>
    </>
  );
};

export default UpdateLisitng;
