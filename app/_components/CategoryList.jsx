"use client";
import React, { useEffect, useState, useRef } from "react";
import GlobalApi from "../_utils/GlobalApi";
import Image from "next/image";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CategoryList() {
  const listRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const params = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setSelectedCategory(params.get("category"));
  }, [params]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    GlobalApi.GetCategory()
      .then((resp) => {
        console.log("Fetched categories:", resp);
        setCategoryList(resp.categories || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const ScrollRightHandle = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-7 relative">
      <div className="flex gap-10 overflow-auto scrollbar-hide" ref={listRef}>
        {categoryList &&
          categoryList.map((category, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-2 border p-3 rounded-xl min-w-28 hover:border-primary hover:bg-orange-50 cursor-pointer group
                ${selectedCategory == category.slug && "text-primary border-primary bg-orange-50"}
              `}
            >
              <Image
                src={category.icon?.url}
                alt={category.name}
                width={40}
                height={40}
                className="group-hover:scale-125 transition-all duratiion-200"
              />
              <h2 className="text-sm font-medium group-hover:text-primary">
                {category.name}
              </h2>
            </div>
          ))}
      </div>
      <ArrowRightCircle
        className="absolute -right-10 top-0 bg-gray-500 rounded-full text-white h-8 w-8 cursor-pointer"
        onClick={() => ScrollRightHandle()}
      />
    </div>
  );
}

export default CategoryList;