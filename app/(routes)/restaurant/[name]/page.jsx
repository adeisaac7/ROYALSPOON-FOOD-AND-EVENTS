// [name]/page.jsx
"use client";
import React, { useEffect, useState } from 'react';
import GlobalApi from '@/app/_utils/GlobalApi';
import { usePathname } from 'next/navigation';
import Intro from '../_components/Intro';
import RestroTab from '../_components/RestroTab';

function RestaurantDetails() {
  const param = usePathname();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const restroSlug = param.split("/")[2];
    GetRestaurantDetail(restroSlug);
    GetRestaurantReviews(restroSlug);
  }, [param]);

  const GetRestaurantDetail = (restroSlug) => {
    GlobalApi.GetBusinessDetail(restroSlug).then((resp) => {
      console.log("Restaurant Detail:", resp);
      if (resp?.restaurants && resp.restaurants.length > 0) {
        setRestaurant(resp.restaurants[0]);
      } else {
        setRestaurant(null);
      }
    }).catch((error) => {
      console.error("Error fetching restaurant details:", error);
      setRestaurant(null);
    });
  };

  const GetRestaurantReviews = (restroSlug) => {
    GlobalApi.getRestaurantReview(restroSlug).then((resp) => {
      console.log("Fetched Reviews:", resp?.reviews);
      setReviews(resp?.reviews || []);
    }).catch((error) => {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    });
  };

  const handleReviewUpdate = () => {
    const restroSlug = param.split("/")[2];
    GetRestaurantReviews(restroSlug); // Refresh reviews after a new review is added
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Intro restaurant={restaurant} reviews={reviews} />
      <RestroTab restaurant={restaurant} onReviewUpdate={handleReviewUpdate} />
    </div>
  );
}

export default RestaurantDetails;