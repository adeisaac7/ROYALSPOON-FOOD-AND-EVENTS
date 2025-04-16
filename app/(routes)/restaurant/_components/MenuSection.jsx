import { CartUpdateContext } from '@/app/_context/CartUpdateContext';
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { SquarePlus } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

function MenuSection({ restaurant }) {
  const [menuItemList, setMenuItemList] = useState({ category: "", menuItem: [] });
  const { user } = useUser();
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext);

  useEffect(() => {
    if (restaurant?.menu && restaurant.menu.length > 0) {
      FilterMenu(restaurant.menu[0].category.name); 
    }

    console.log("Restaurant Data in MenuSection:", restaurant);
    console.log("Categories in MenuSection:", restaurant?.categories);
    console.log("Menu in MenuSection:", restaurant?.menu);
  }, [restaurant]);

  const FilterMenu = (categoryName) => {
    const result = restaurant?.menu?.find((item) => item.category.name === categoryName);
    if (result && result.menuItem) {
      setMenuItemList({
        category: result.category.name,
        menuItem: result.menuItem,
      });
    } else {
      setMenuItemList({ category: "", menuItem: [] });
    }
  };

  const addToCartHandler = (item) => {
    setUpdateCart(!updateCart);
    toast('Adding to cart');

    const data = {
      email: user?.primaryEmailAddress?.emailAddress,
      productName: item?.name,
      productDescription: item?.description,
      productImage: item?.productImage?.url,
      price: item?.price,
      restaurantSlug: restaurant.slug,
    };

    GlobalApi.AddToCart(data).then(
      (resp) => {
        console.log(resp);
        toast('Added to cart');
      },
      (error) => {
        toast('Error while adding to the cart');
      }
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 mt-2">
        {/* Categories (Left Side) */}
        <div className="col-span-1 mr-4">
          {/* Horizontal Scrollable List for Smaller Screens */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 mb-4 md:mb-0">
            {restaurant?.menu?.length > 0 ? (
              restaurant.menu.map((item, index) => (
                <Button
                  variant="ghost"
                  key={index}
                  className={`flex justify-start whitespace-nowrap w-fit md:w-full px-3 py-1 rounded-lg ${
                    menuItemList.category === item.category.name ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => FilterMenu(item.category.name)}
                >
                  {item.category.name}
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No categories found.</p>
            )}
          </div>
        </div>

        {/* Menu Items (Right Side) */}
        <div className="col-span-1 md:col-span-3">
          <h2 className="font-extrabold text-lg mb-4">{menuItemList.category}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {menuItemList?.menuItem?.length > 0 ? (
              menuItemList.menuItem.map((item, index) => (
                <div
                  className="p-4 border rounded-xl hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                  key={index}
                >
                  <div className="relative w-full h-48 mb-4">
                    {item?.productImage?.url ? (
                      <Image
                        src={item.productImage.url}
                        alt={item.name}
                        width={300} 
                        height={200} 
                        className="object-cover rounded-lg w-full h-full"
                      />
                    ) : (
                      <div className="bg-slate-200 h-full w-full rounded-lg"></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <h2 className="font-bold text-primary">₦{item.price}</h2>
                      <SquarePlus
                        className="cursor-pointer text-primary"
                        onClick={() => addToCartHandler(item)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No menu items found for this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuSection;