"use client";
export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import NextDynamic from "next/dynamic";

import { CartUpdateContext } from "@/app/_context/CartUpdateContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const PaystackPaymentButton = NextDynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { 
    ssr: false,
    loading: () => <Button disabled>Loading payment...</Button>
  }
);

// Wrapper component to handle search params separately
function CheckoutContent() {
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext);

  const [cart, setCart] = useLocalStorage("cart", []);
  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurantName, setRestaurantName] = useState("Royal Spoon Foods");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    // Get restaurant name from URL when component mounts on client side
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRestaurantName(params.get("restaurant") || "Royal Spoon Foods");
    }

    if (user) {
      GetUserCart();
    }
  }, [user, updateCart]);

  const GetUserCart = async () => {
    const resp = await GlobalApi.GetUserCart(user?.primaryEmailAddress.emailAddress);
    const fetchedCart = resp?.userCarts || [];
    setCart(fetchedCart);
    calculateTotalAmount(fetchedCart);
  };

  const calculateTotalAmount = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.075;
    const grandTotal = subtotal + subtotal * 0.09;

    setSubTotal(subtotal.toFixed(2));
    setTaxAmount(tax);
    setTotal(grandTotal);
  };

  const handlePaymentSuccess = async () => {
    toast.success("Payment Successful!");
    try {
      await addToOrder();
    } catch {
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
      restaurantName,
      userName: user?.fullName,
      phone,
      address,
      zipCode: zip,
    };

    try {
      const resp = await GlobalApi.CreateNewOrder(data);
      const orderId = resp?.createOrder?.id;

      if (orderId) {
        await Promise.all(
          cart.map((item) =>
            GlobalApi.UpdateOrderToAddOrderItems(
              item.productName,
              item.price,
              orderId,
              user?.primaryEmailAddress.emailAddress
            )
          )
        );

        await sendConfirmationEmails(orderId);
        setLoading(false);
        toast.success("Order created Successfully");

        setCart([]);
        setUpdateCart((prev) => !prev);
        redirectToConfirmation(orderId);
      }
    } catch {
      setLoading(false);
      toast.error("Failed to create order");
    }
  };

  const sendConfirmationEmails = async (orderId) => {
    const orderDetails = {
      userName: user?.fullName,
      email: user?.primaryEmailAddress.emailAddress,
      phone,
      address,
      zipCode: zip,
      restaurantName,
      orderItems: cart,
      subtotal: subTotal,
      taxAmount,
      totalAmount: total,
    };

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: orderDetails.email, orderDetails }),
    });

    if (!response.ok) {
      toast.error("Error sending emails");
    } else {
      toast.success("Emails sent successfully");
    }
  };

  const redirectToConfirmation = (orderId) => {
    router.replace(
      `/confirmation?orderId=${orderId}&totalAmount=${total.toFixed(2)}&restaurantName=${
        encodeURIComponent(restaurantName)
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

  if (!userLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10">
      <h2 className="font-bold text-2xl my-5 text-center">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing Details */}
        <div className="lg:col-span-2 bg-white shadow-md p-5 rounded-lg">
          <h2 className="font-bold text-xl mb-4">Billing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input placeholder="Zip code (optional)" value={zip} onChange={(e) => setZip(e.target.value)} />
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

        {/* Order Summary */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
          <h2 className="text-center font-bold text-lg bg-gray-300 py-2">
            Total Cart ({cart?.length || 0})
          </h2>
          <div className="p-4 space-y-4">
            <h2 className="flex justify-between">Subtotal: <span>₦{subTotal}</span></h2>
            <h2 className="flex justify-between">VAT (7.5%): <span>₦{taxAmount.toFixed(2)}</span></h2>
            <hr />
            <h2 className="font-bold flex justify-between">Total: <span>₦{total.toFixed(2)}</span></h2>

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

// Main checkout component with Suspense boundary
export default function Checkout() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
