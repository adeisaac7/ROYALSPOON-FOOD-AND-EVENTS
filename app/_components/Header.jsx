"use client";
import { Button } from '@/components/ui/button';
import { SignInButton, SignOutButton, SignUpButton, useUser } from '@clerk/nextjs';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { CartUpdateContext } from '../_context/CartUpdateContext';
import GlobalApi from '../_utils/GlobalApi';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Cart from './Cart';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Header = () => {
  const { user, isSignedIn } = useUser();
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext);
  const [cart, setCart] = useLocalStorage('cart',[]);

  useEffect(() => {
    if (user) {
      GetUserCart();
    } else {
      setCart([]);
    }
  }, [user, updateCart]);

  const GetUserCart = async () => {
    try {
      const resp = await GlobalApi.GetUserCart(user?.primaryEmailAddress?.emailAddress);
      setCart(resp?.userCarts || []);
      } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  return (
    <div className='flex justify-between items-center px-4 md:px-6 py-4 shadow-sm bg-white w-full'>
      {/* Logo at the extreme left */}
      <Link href='/'>
        <Image
          src="/logo.png"
          alt="LOGO"
          width={100}
          height={100}
          className="w-30 h-30 md:w-25 md:h-25 cursor-pointer"
        />
      </Link>

      {/* Business Name or Slogan in the middle */}
      <div className='flex-1 text-center'>
        <h1 className='text-xl md:text-2xl font-bold'>
          <span className='text-primary'>Royalspoon</span>{' '}
          <span className=''>Foods & Events</span>
        </h1>
        <p className='text-sm md:text-md text-gray-600'>Home of Taste, <span  className='text-primary'>Flavour for Royalties</span></p>
      </div>

      {/* Cart and User Menu */}
      <div className='flex items-center gap-4'>
        {isSignedIn ? (
          <>
            {/* Cart */}
            <Popover>
              <PopoverTrigger asChild>
                <div className='flex items-center gap-2 cursor-pointer'>
                  <ShoppingCart className='w-5 h-5 md:w-6 md:h-6' />
                  <span className='p-1 px-2 rounded-full bg-slate-200 text-xs md:text-sm'>{cart?.length || 0}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-full'>
                <Cart cart={cart} />
              </PopoverContent>
            </Popover>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src={user?.imageUrl}
                  alt='User Avatar'
                  width={30}
                  height={30}
                  className='rounded-full w-8 h-8 md:w-9 md:h-9'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={'/user'}>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href={'/user#/my-orders'}>
                  <DropdownMenuItem>My Orders</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <SignOutButton>Logout</SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className='flex gap-2 md:gap-3'>
            <SignInButton mode='modal'>
              <Button variant="outline" className='text-xs md:text-sm px-3 py-1'>Login</Button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <Button className='text-xs md:text-sm px-3 py-1'>Sign Up</Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;