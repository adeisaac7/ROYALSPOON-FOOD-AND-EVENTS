import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useContext } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import { toast } from 'sonner';
import { CartUpdateContext } from '../_context/CartUpdateContext';
import Link from 'next/link';

function Cart({ cart }) {
  const { setUpdateCart } = useContext(CartUpdateContext);

  // Calculate total cart amount
  const calculateCartAmount = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  // Remove item from cart
  const removeItemFromCart = async (id) => {
    try {
      await GlobalApi.DisconnectRestroFromCartItem(id);
      const response = await GlobalApi.DeleteItemFromCart(id);

      if (response?.deleteUserCart?.id) {
        toast('Item Removed!');
        setUpdateCart(prev => !prev); // Trigger a re-render
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast('Failed to remove item!');
    }
  };

  return (
    <div>
      <h2 className='text-lg font-bold'>{cart[0]?.restaurant?.name}</h2>

      <div className='mt-5 flex flex-col gap-3'>
        <h2 className='font-bold'>My Order</h2>

        {cart.length > 0 ? (
          cart.map((item, index) => (
            <div key={index} className='flex justify-between gap-8 items-center'>
              <div className='flex gap-2 items-center'>
                {item.productImage && (
                  <Image src={item.productImage} alt={item.productName}
                    width={40}
                    height={40}
                    className='h-[40px] w-[40px] rounded-lg object-cover'
                  />
                )}
                <h2 className='text-sm'>{item?.productName}</h2>
              </div>
              <h2 className='font-bold flex gap-2'>₦{item?.price}</h2>
              <X className='h-4 w-4 text-red-500 cursor-pointer'
                onClick={() => removeItemFromCart(item.id)}
              />
            </div>
          ))
        ) : (
          <p className='text-gray-500'>Your cart is empty</p>
        )}

        <Link href='/checkout'>
          <Button className='w-full'>Checkout ₦{calculateCartAmount()}</Button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;