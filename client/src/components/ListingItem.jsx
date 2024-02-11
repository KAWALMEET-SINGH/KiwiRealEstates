import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

const ListingItem = ({listing}) => {
  return (
    <Link to={`/listing/${listing._id}`}>
        <div className={` bg-white flex flex-col gap-4 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg h-full w-full sm:w-[330px]`}>
<img className={`h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-500`} src={listing.imageUrls[0]} alt="image" />    
       <div className={`p-3 flex flex-col gap-2`} >
        <p className={`truncate text-slate-700  font-semibold`}>{listing.name}</p>
        <div className={`flex items-center gap-1`}> <MdLocationOn  className={`text-green-700 h-4 w-4`} /> 
        <p className={`text-gray-800 text-sm truncate w-full`}>{listing.address}</p></div>
        <p className={`text-sm text-gray-600 line-clamp-2`}>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold '>
          &#8377;
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      

        </div>
    </Link>
        
  )
}

export default ListingItem