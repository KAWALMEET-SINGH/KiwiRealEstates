import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fechLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
    fechLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className={`flex flex-col justify-evenly items-start gap-3`}>
          <p>
            Contact{" "}
            <span className={`font-semibold`}>{landlord.username} </span>
            for{" "}
            <span className={`font-semibold`}>
              {" "}
              {listing.name.toLowerCase()}{" "}
            </span>{" "}
          </p>
          <textarea
            className={`w-full border border-slate-800 p-2 rounded-lg`}
            value={message}
            onChange={handleChange}
            placeholder="Enter your message...."
            name="message"
            id="message"
            rows="2"
            ></textarea>
          <button
            className={`w-full bg-green-700 text-white uppercase p-3 rounded-lg text-center`}
          >
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
            Send Message
          </Link>
          </button>
        </div>
      )}
      {error && <p className={`text-red-600 mt-5`}>{error}</p>}
    </>
  );
};

export default Contact;
