import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BusinessItem = ({ business, isFullWidth }) => {
  const CalculateRating = () => {
    let total = 0;
    let count = 0;

    business?.review.forEach(item => {
      total = total + item.star;
      count++;
    });

    const result = total / count;
    return result ? result.toFixed(1) : 4.5;
  };

  return (
    <Link 
      href={'/restaurant/' + business?.slug}
      className={`p-3 border rounded-xl hover:border-primary 
      hover:bg-orange-100 cursor-pointer transition duration-300 ease-in-out block`}>

      <Image 
        src={business.banner?.url}
        alt={business.name}
        width={isFullWidth ? 800 : 300} 
        height={isFullWidth ? 400 : 150}
        layout="intrinsic"
        className={`rounded-xl object-cover w-full`}
      />

      <div className="mt-2">
        <h2 className="font-bold text-lg">{business.name}</h2>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Image src="/star.png" alt="star" height={14} width={14} />
            <label className="text-gray-400 text-sm">{CalculateRating()}</label>
            <h2 className="text-gray-400 text-sm">{business?.restroType[0]}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BusinessItem;
