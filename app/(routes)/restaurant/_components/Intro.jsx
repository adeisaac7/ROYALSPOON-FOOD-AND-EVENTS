// Intro.jsx
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

function Intro({ restaurant, reviews }) {
  const [totalReview, setTotalReview] = useState(0);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    console.log("Restaurant Reviews:", reviews); // Debugging line
    if (reviews.length > 0) {
      CalculateRating(reviews);
    } else {
      setAvgRating("0.0");
      setTotalReview(0);
    }
  }, [reviews]);

  const CalculateRating = (reviews) => {
    let total = 0;
    let count = 0;

    reviews.forEach((item) => {
      total += item.star;
      count++;
    });

    const result = count > 0 ? (total / count).toFixed(1) : "0.0";
    console.log("Calculated Rating:", result); // Debugging line
    setTotalReview(count);
    setAvgRating(result);
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {restaurant?.banner?.url ? (
        <Image
          src={restaurant.banner.url}
          width={1000}
          height={300}
          className="w-full h-[220px] object-cover rounded-xl max-w-full"
          alt="Restaurant banner"
        />
      ) : (
        <div className="h-[120px] w-full bg-slate-200 animate-pulse rounded-xl"></div>
      )}

      <h2 className="text-3xl font-bold mt-2">{restaurant.name}</h2>

      <div className="flex items-center gap-2 mt-2">
        <Image src="/star.png" alt="star" width={20} height={20} />
        <label className="text-gray-500">
          {avgRating !== null ? `${avgRating} (${totalReview})` : "Loading..."}
        </label>
      </div>

      <h2 className="text-gray-500 mt-2 flex gap-2 items-center">
        <MapPin className="w-3 h-3 min-w-[25px] min-h-[25px] md:w-4 md:h-4 lg:w-5 lg:h-5" />
        {restaurant.address}
      </h2>
    </div>
  );
}

export default Intro;