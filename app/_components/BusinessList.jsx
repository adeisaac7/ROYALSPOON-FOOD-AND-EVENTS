"use client"
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import GlobalApi from '../_utils/GlobalApi';
import BusinessItem from './BusinessItem';
import BusinessItemSkeleton from './BusinessItemSkeleton';

const BusinessList = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getRestaurant();
    }, []);

    const getRestaurant = () => {
        setLoading(true);
        GlobalApi.GetRestaurant()
            .then(resp => {
                setRestaurant(resp?.restaurants[0] || null);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching business list:", error);
                setRestaurant(null);
                setLoading(false);
            });
    };

    return (
        <div className="mt-5 font-poppins max-w-4xl mx-auto px-4 mb-10">
            <h2 className="font-bold text-2xl">Our Restaurant</h2>
            <h2 className="font-bold text-primary">Results</h2>

            <div className="mt-3 flex justify-center">
                {!loading && restaurant ? (
                    <div className="w-full max-w-lg">
                        <BusinessItem business={restaurant} isFullWidth={true} />
                    </div>
                ) : (
                    <div className="w-full max-w-lg">
                        <BusinessItemSkeleton />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessList;
