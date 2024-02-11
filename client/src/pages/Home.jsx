import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  SwiperCore.use([Navigation]);

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(saleListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <>
      <div className={`flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto`}>
        <h1 className={` font-bold  text-3xl lg:text-6xl `}>
          Discover Living with{" "}
          <span className={`text-slate-600`}>Kiwi Estates,</span>
          <br /> Where Dreams Take Flight
        </h1>
        <div className={`text-gray-500 text-xs sm:text-sm text-balance`}>
          Unlock the Door to Luxury Living with Kiwi Estates! Explore our
          exclusive properties and experience the pinnacle of modern elegance.
          From panoramic views to unparalleled amenities, find your perfect
          sanctuary with us today.
        </div>
        <Link
          className={`text-xs sm:text-sm font-bold text-blue-800 hover:underline`}
          to={"/search"}
        >
          Let's start now.
        </Link>
      </div>
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className={`h-[450px] `}
                key={listing._id}
                style={{
                  background: `url(${listing.imageUrls[0]}),
                      
              center no-repeat
              `,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className={`max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10`}>
        {offerListings && offerListings.length > 0 && (
          <div className={`flex flex-col  items-start gap-1`}>
            <h2 className={`text-2xl text-slate-700 font-semibold`}>Recent Offers</h2>
            <Link className={`text-md text-blue-700 `} to={`/search?offes=true`}>
              Show more offers
            </Link>
          <div className={`flex flex-col sm:flex-row flex-wrap gap-4 items-center`}>
            {" "}
            {offerListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}{" "}
          </div>
          </div>
        )}{" "}
      </div>
      <div className={`max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10`}>
        {rentListings && rentListings.length > 0 && (
          <div className={`flex flex-col  items-start gap-1`}>
          <h2 className={`text-xl text-slate-700 font-semibold`}>Recent places for rent</h2>
          <Link className={`text-md text-blue-700 `} to={`/search?type=rent`}>
            Show more rentals
          </Link>
          <div className={`flex flex-col sm:flex-row flex-wrap gap-4 items-center`}>
            {" "}
            {rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}{" "}
          </div></div>
        )}{" "}
      </div>
      <div className={`max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10`}>
        {saleListings && saleListings.length > 0 && (
          <div className={`flex flex-col  items-start gap-1`}>
          <h2 className={`text-xl text-slate-700 font-semibold`}>Recent places for sale</h2>
          <Link className={`text-md text-blue-700 `} to={`/search?type=sale`}>
            Show more properties
          </Link>
          <div className={`flex flex-col sm:flex-row flex-wrap  gap-4 items-center`}>
            {" "}
            {saleListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}{" "}
          </div></div>
        )}{" "}
      </div>
    </>
  );
};

export default Home;
