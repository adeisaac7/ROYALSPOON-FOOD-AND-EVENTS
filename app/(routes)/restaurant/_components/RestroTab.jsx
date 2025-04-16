"use client";
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuSection from './MenuSection';
import ReviewSection from './ReviewSection';
import AboutSection from '@/app/_components/AboutSection';
import GlobalApi from '@/app/_utils/GlobalApi';

function RestroTab({ restaurant }) {
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    if (restaurant) {
      getReviewList();
    }
  }, [restaurant]);

  const getReviewList = () => {
    GlobalApi.getRestaurantReview(restaurant.slug).then((resp) => {
      console.log("Fetched Reviews in RestroTab:", resp?.reviews);
      setReviewList(resp?.reviews || []);
    });
  };

  return (
    <Tabs defaultValue="category" className="w-full mt-10">
      <TabsList>
        <TabsTrigger value="category">Categories</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="review">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="category">
        <MenuSection restaurant={restaurant} />
      </TabsContent>

      <TabsContent value="about">
        <AboutSection restaurant={restaurant} />
      </TabsContent>

      <TabsContent value="review">
        <ReviewSection restaurant={restaurant} reviewList={reviewList} onReviewUpdate={getReviewList} />
      </TabsContent>
    </Tabs>
  );
}

export default RestroTab;
