"use client";
export const dynamic = 'force-dynamic';
import { CartUpdateContext } from "@/app/_context/CartUpdateContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { default as DynamicImport } from "next/dynamic";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Renamed dynamic import to avoid conflict
const PaystackPaymentButton = DynamicImport(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

function Checkout() {
  const params = useSearchParams();
  const { user } = useUser();
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext);
  const [cart, setCart] = useLocalStorage("cart", []);
  const [SubTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    setIsClient(true);
    if (user) {
      GetUserCart();
    }
  }, [user, updateCart]);

  const GetUserCart = () => {
    GlobalApi.GetUserCart(user?.primaryEmailAddress.emailAddress).then(
      (resp) => {
        const fetchedCart = resp?.userCarts || [];
        setCart(fetchedCart);
        calculateTotalAmount(fetchedCart);
      }
    );
  };

  const calculateTotalAmount = (cart_) => {
    const total = cart_.reduce((sum, item) => sum + item.price, 0);
    setSubTotal(total.toFixed(2));
    setTaxAmount(total * 0.075);
    setTotal(total + total * 0.09);
  };

  const handlePaymentSuccess = async (reference) => {
    toast.success("Payment Successful!");
    try {
      await addToOrder();
    } catch (error) {
      toast.error("Failed to process order");
    }
  };

  const addToOrder = async () => {
    if (!userName || !email || !phone || !address) {
      toast.error("Please fill in all fields before proceeding.");
      return;
    }
  
    setLoading(true);
  
    const data = {
      email: user?.primaryEmailAddress.emailAddress,
      orderAmount: total,
      restaurantName: params.get("restaurant"),
      userName: user?.fullName,
      phone: phone,
      address: address,
      zipCode: zip,
    };
  
    try {
      const resp = await GlobalApi.CreateNewOrder(data);
      const resultId = resp?.createOrder?.id;
  
      if (resultId) {
        await Promise.all(cart.map(item => 
          GlobalApi.UpdateOrderToAddOrderItems(
            item.productName,
            item.price,
            resultId,
            user?.primaryEmailAddress.emailAddress
          )
        )); 
      
        setLoading(false);
        toast.success("Order created Successfully");
        await sendConfirmationEmails(resultId);
        setCart([]);
        setUpdateCart((prev) => !prev);
        redirectToConfirmation(resultId);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create order");
    }
  };

  const sendConfirmationEmails = async (orderId) => {
    const orderDetails = {
      userName: user?.fullName,
      email: user?.primaryEmailAddress.emailAddress,
      phone: phone,
      address: address,
      zipCode: zip,
      restaurantName: params.get("restaurant"),
      orderItems: cart,
      subtotal: SubTotal,
      taxAmount: taxAmount,
      totalAmount: total,
    };

    const emailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user?.primaryEmailAddress.emailAddress,
        orderDetails,
      }),
    });

    if (!emailResponse.ok) {
      toast.error("Error sending emails");
    } else {
      toast.success("Emails sent successfully");
    }
  };

  const redirectToConfirmation = (orderId) => {
    router.replace(
      `/confirmation?orderId=${orderId}&totalAmount=${total.toFixed(2)}&restaurantName=${
        encodeURIComponent(params.get("restaurant") || "Royal Spoon Foods")
      }`
    );
  };

  const paystackConfig = {
    email: email || user?.primaryEmailAddress?.emailAddress,
    amount: total * 100,
    publicKey,
    text: "Pay Now",
    onSuccess: handlePaymentSuccess,
    onClose: () => toast.error("Payment closed, try again"),
  };

  return (
    <div className="p-4 md:p-10">
      <h2 className="font-bold text-2xl my-5 text-center">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow-md p-5 rounded-lg">
          <h2 className="font-bold text-xl mb-4">Billing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Name" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)} 
            />
            <Input 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input 
              placeholder="Phone" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)} 
            />
            <Input 
              placeholder="Zip code (optional)" 
              value={zip}
              onChange={(e) => setZip(e.target.value)} 
            />
          </div>
          <div className="mt-4">
            <Input 
              placeholder="Address" 
              value={address}
              onChange={(e) => setAddress(e.target.value)} 
              className="w-full" 
            />
          </div>
        </div>

        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
          <h2 className="text-center font-bold text-lg bg-gray-300 py-2">
            Total Cart ({isClient ? cart?.length : 0})
          </h2>
          <div className="p-4 space-y-4">
            <h2 className="flex justify-between">
              Subtotal: <span>₦{SubTotal}</span>
            </h2>
            <h2 className="flex justify-between">
              VAT (7.5%): <span>₦{taxAmount.toFixed(2)}</span>
            </h2>
            <hr />
            <h2 className="font-bold flex justify-between">
              Total: <span>₦{total.toFixed(2)}</span>
            </h2>
            
            <PaystackPaymentButton
              {...paystackConfig}
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${
                (!userName || !email || !phone || !address) ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!userName || !email || !phone || !address || loading}
            />
            {loading && <Loader className="animate-spin mx-auto" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;