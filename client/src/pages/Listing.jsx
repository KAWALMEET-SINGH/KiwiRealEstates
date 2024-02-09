import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();

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
        {loading && <p className={"text-2xl text-center"}>Loading....</p>}
        {listingData && !loading && !error && (
          <div>
            <Swiper navigation>
            {listingData.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[350px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
        )}
        {error && (
          <p className={"text-2xl text-center text-red-700"}>{error}</p>
        )}
      </main>
    </>
  );
};

export default Listing;
