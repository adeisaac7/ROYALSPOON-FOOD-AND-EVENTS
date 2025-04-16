// ReviewList.jsx
import Image from 'next/image';
import React from 'react';
import { Rating as ReactRating } from '@smastrom/react-rating';
import moment from 'moment';

function ReviewList({ reviewList = [] }) {
  return (
    <div className="flex flex-col gap-5">
      {reviewList.length > 0 ? (
        reviewList.map((review, index) => {
          const publishedAt = review.publishedAt ? moment(review.publishedAt).format('DD-MM-YYYY') : "Unknown Date";
          return (
            <div key={index} className="flex gap-5 items-center border rounded-lg p-5">
              <Image
                src={review.profileImage}
                alt="profileImage"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h2>{review.reviewText}</h2>
                <ReactRating style={{ maxWidth: 100 }} value={review.star} isDisabled />
                <h2 className="text-sm">
                  <span className="font-bold">{review.userName}</span> at {publishedAt}
                </h2>
              </div>
            </div>
          );
        })
      ) : (
        [1, 2, 3, 4].map((item, index) => (
          <div key={index} className="h-[50px] w-full bg-slate-200 animate-pulse rounded-lg"></div>
        ))
      )}
    </div>
  );
}

export default ReviewList;