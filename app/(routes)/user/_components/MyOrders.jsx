import GlobalApi from '@/app/_utils/GlobalApi';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function MyOrders() {
  const { user } = useUser();
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    if (user) {
      console.log("Fetching orders for user:", user.primaryEmailAddress?.emailAddress);
      GetUserOrders();
    }
  }, [user]);

  const GetUserOrders = () => {
    GlobalApi.GetUserOrders(user?.primaryEmailAddress?.emailAddress).then(resp => {
      console.log("Order response:", resp);
      setOrderList(resp?.orders || []); // Ensure orderList is always an array
    }).catch(error => {
      console.error("Error fetching orders:", error);
      setOrderList([]); // Set orderList to an empty array on error
    });
  };

  return (
    <div>
      <h2 className='font-bold text-lg'>My Orders</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {orderList?.map((order, index) => (
          <div key={index} className='p-3 border rounded-lg flex flex-col gap-3'>
            <h2 className='font-bold'>{moment(order?.createdAt).format('DD-MM-YYYY')}</h2>
            <h2 className='text-sm'>
              Order Total Amount: <span className='font-semibold'>₦{(order.orderAmount).toFixed(2)}</span>
            </h2>
            <h2 className='text-sm'>
              Address: <span className='font-semibold'>{order.address}, {order.zipCode}</span>
            </h2>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h2 className='text-primary text-sm underline'>View Order Details</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-col gap-3'>
                    {order?.orderDetail?.map((item, index) => (
                      <div key={index} className='flex justify-between'>
                        <h2>{item.name}</h2>
                        <h2 className='font-semibold'>₦{item.price}</h2>
                      </div>
                    ))}
                    <hr />
                    <h2 className='font-bold text-md mt-2'>
                      Total Order Amount (Including VAT):{' '}
                      <span className='font-semibold'>₦{(order.orderAmount).toFixed(2)}</span>
                    </h2>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;