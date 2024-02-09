import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import {useSelector} from 'react-redux'

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const { currentUser} = useSelector((state) => state.user);
  const [copied, setCopied] = useState(false);
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.error);
          setLoading(false);

          setError(data.error);
          return;
        }
        console.log(data);
        setError(false);
        setLoading(false);
        setListingData(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchListing();
  }, []);
  return (
    <>
      <main>
        {loading && <p className={`text-2xl text-center`}>Loading....</p>}
        {listingData && !loading && !error && (
          <div>
            <Swiper navigation>
              {listingData.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className={`h-[350px]`}
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div
             onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }} className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
             
            />
             {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          </div>
          <div className={`flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4`}>
            <p className={ `text-2xl font-semibold`}>
              {listingData.name} - &#8377;{' '}
              {listingData.offer
                ? listingData.discountPrice.toLocaleString('en-US')
                : listingData.regularPrice.toLocaleString('en-US')}
              {listingData.type === 'rent' && '/month'}
            </p>
            <p className={`flex items-center mt-6 gap-2 text-slate-600  text-sm`}>
              <FaMapMarkerAlt className='text-green-700' />
              {listingData.address}
            </p>
            <div className={  `flex gap-4`}>
              <p className={`bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md`}>
                {listingData.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listingData.offer && (
                <p className=  {`bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md`}>
                  
                  &#8377;{+listingData.regularPrice - +listingData.discountPrice} OFF
                </p>
              )}
            </div>
            <p className={`text-slate-800`}>
              <span className={`font-semibold text-black`}>Description - </span>
              {listingData.description}
            </p>
            <ul className={`text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6`}>
              <li className={`flex items-center gap-1 whitespace-nowrap `}>
                <FaBed className={`text-lg`} />
                {listingData.bedrooms === 1
                  ? `${listingData.bedrooms} bed `
                  : `${listingData.bedrooms} beds `}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap `}>
                <FaBath className={`text-lg`} />
                {listingData.bathrooms === 1
                  ? `${listingData.bathrooms} bath `
                  : `${listingData.bathrooms} baths `}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap `}>
                <FaParking className={`text-lg`} />
                {listingData.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap `}>
                <FaChair className={`text-lg`} />
                {listingData.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
          
          </div>
          </div>
        )}
        {error && (
          <p className={`text-2xl text-center text-red-700`}>{error}</p>
        )}
      </main>
    </>
  );
};

export default Listing;
