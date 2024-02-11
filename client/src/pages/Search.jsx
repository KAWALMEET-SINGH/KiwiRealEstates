import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("order", sidebardata.order);
    urlParams.set("sort", sidebardata.sort);

    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermURL = urlParams.get("searchTerm");
    const typeURL = urlParams.get("type");
    const furnishedURL = urlParams.get("furnished");
    const parkingURL = urlParams.get("parking");
    const offerURL = urlParams.get("offer");
    const orderURL = urlParams.get("order");
    const sortURL = urlParams.get("sort");
    if (
      searchTermURL ||
      typeURL ||
      furnishedURL ||
      parkingURL ||
      offerURL ||
      orderURL ||
      sortURL
    ) {
      setSidebardata({
        searchTerm: searchTermURL || "",
        type: typeURL || "all",
        parking: parkingURL === "true" ? true : false,
        furnished: furnishedURL === "true" ? true : false,
        offer: offerURL === "true" ? true : false,
        sort: sortURL || "created_at",
        order: orderURL || "desc",
      });
    }
    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
        
      }else{setShowMore(false);}
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [location.search]);
  const showMoreClick = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };
  return (
    <div className={`flex flex-col md:flex-row md:min-h-screen`}>
      <div className={`p-7 border-b-2 sm:border-r-2  `}>
        <form onSubmit={handleSubmit} className={`flex flex-col gap-8`}>
          <div className={`flex items-center gap-3`}>
            <label
              className={`whitespace-nowrap font-semibold`}
              htmlFor="searchTerm"
            >
              Search Term:{" "}
            </label>
            <input
              value={sidebardata.searchTerm}
              className={`border rounded-lg p-3 w-full`}
              onChange={handleChange}
              type="text"
              id="searchTerm"
              name="searchTerm"
            />
          </div>
          <div className={`flex items-center gap-3`}>
            <label className={`whitespace-nowrap font-semibold`}>Type: </label>
            <div className={`flex flex-row items-center gap-1`}>
              {" "}
              <input
                className={`border rounded-lg p-3 w-full`}
                type="checkbox"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
                id="all"
                name="all"
              />
              <label htmlFor="all" className={`whitespace-nowrap`}>
                Rent & Sale
              </label>
            </div>
            <div className={`flex flex-row items-center gap-1`}>
              {" "}
              <input
                className={`border rounded-lg p-3 w-full`}
                type="checkbox"
                onChange={handleChange}
                id="rent"
                checked={sidebardata.type === "rent"}
                name="rent"
              />
              <label htmlFor="rent" className={`whitespace-nowrap`}>
                Rent{" "}
              </label>
            </div>
            <div className={`flex flex-row items-center gap-1`}>
              <input
                className={`border rounded-lg p-3 w-full`}
                type="checkbox"
                id="sale"
                onChange={handleChange}
                name="sale"
                checked={sidebardata.type === "sale"}
              />
              <label htmlFor="sale" className={`whitespace-nowrap`}>
                Sale
              </label>
            </div>
            <div className={`flex flex-row items-center gap-1`}>
              <input
                className={`border rounded-lg p-3 w-full`}
                type="checkbox"
                onChange={handleChange}
                value={sidebardata.offer}
                id="offer"
                name="offer"
              />
              <label htmlFor="offer" className={`whitespace-nowrap`}>
                Offer
              </label>
            </div>
          </div>
          <div className={`flex items-center gap-3`}>
            <label className={`whitespace-nowrap font-semibold`}>
              Amenidities:{" "}
            </label>
            <div className={`flex flex-row items-center gap-1`}>
              {" "}
              <input
                className={`border rounded-lg p-3 w-full`}
                type="checkbox"
                id="parking"
                onChange={handleChange}
                value={sidebardata.parking}
                name="parking"
              />
              <label htmlFor="parking" className={`whitespace-nowrap`}>
                Parking
              </label>
            </div>
            <div className={`flex flex-row items-center gap-1`}>
              {" "}
              <input
                className={`border rounded-lg p-3 w-full`}
                type="checkbox"
                id="furnished"
                name="furnished"
                onChange={handleChange}
                value={sidebardata.furnished}
              />
              <label htmlFor="furnished" className={`whitespace-nowrap`}>
                Furnished{" "}
              </label>
            </div>
          </div>
          <div className={` flex items-center gap-3`}>
            <label className={`font-semibold`}>Sort: </label>

            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="created_at_desc">Latest</option>
              <option value="created_at_asc">Oldest</option>
            </select>
          </div>
          <button
            className={`bg-slate-700 text-white uppercase p-4 rounded-lg hover:opacity-95 disabled:opacity-75`}
          >
            Search
          </button>
        </form>
      </div>
      <div className={`flex flex-col flex-1`}>
        <h1
          className={`text-3xl font-semibold border-b p-3 text-slate-700 mt-5`}
        >
          Results:
        </h1>
        <div className={`p-3 flex flex-wrap gap-5`}>
          {!loading && listing.length === 0 && (
            <p className={`text-2xl text-red-700 `}>No Listing Found!</p>
          )}
          {loading && <p className={`text-2xl text-slate-700 `}>Loading...</p>}
          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              className={`text-green-700 hover:underline text-center w-full`}
              onClick={() => {
                showMoreClick();
              }}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
