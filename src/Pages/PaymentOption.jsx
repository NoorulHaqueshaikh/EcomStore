// src/components/PaymentOption.jsx
import React, { useEffect, useState } from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";

function PaymentOption({
  amount = 0,
  onPayCOD = () => {},
  onPayRazorpay = () => {},
}) {
  const [addr, setAddr] = useState(null);
  const [cart, setCart] = useState([]);
  const { totalprice } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    addressGet();
    cartGet();
  }, []);

  const addressGet = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/address/get", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (!data.address) {
      navigate("/addresses");
      return;
    }
    setAddr(data.address);
  };

  const cartGet = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/cart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    setCart(Array.isArray(data.carts) ? data.carts : []);
  };

  const buildOrderPayload = (paymentMethod) => {
    const orderAddress = addr
      ? {
          fullName: addr.fullName,
          phone: addr.phone,
          pincode: addr.pincode,
          state: addr.state,
          city: addr.city,
          houseNo: addr.addressLine,
          landmark: addr.landmark || "",
        }
      : null;

    const items = cart.map((ci) => {
      const p = ci.productId || {};
      return {
        productId: p._id,
        quantity: Number(ci.quantity || 1),
        size: typeof ci.size === "string" ? ci.size : "",
        price: Number(p.price || 0),
      };
    });

    const totalAmount =
      Number(totalprice || 0) > 0 ? Number(totalprice) : Number(amount || 0);

    return { items, totalAmount, address: orderAddress, paymentMethod };
  };

  const submitCOD = async () => {
    if (!addr || cart.length === 0) {
      alert("Missing address or cart.");
      return;
    }
    const payload = buildOrderPayload("COD");
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/orders/cod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.message || "Failed to place COD order");
      return;
    }
    if (data.status === "success") {
      navigate("/order/success");
    }
    onPayCOD(data);
  };

  const submitRazorpay = () => {
    return;
  };

  const payable =
    Number(totalprice || amount) > 0 ? Number(totalprice || amount) : 0;

  const razorpayAvailable = false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-xl">
        {/* Back button */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <span className="inline-block h-5 w-5 rounded-full border border-gray-300 grid place-items-center">
              {/* simple left arrow */}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
            Back to cart
          </button>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Choose Payment Method</h3>
          <p className="mt-1 text-sm text-gray-600">
            Select a secure way to complete your purchase.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {payable > 0 && (
            <div className="w-full flex justify-center -mt-4">
              <div className="inline-flex items-center rounded-full bg-gray-900 text-white text-xs px-3 py-1 shadow">
                Payable: ₹{payable.toLocaleString("en-IN")}
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Razorpay (Unavailable look) */}
              <button
                type="button"
                onClick={submitRazorpay}
                disabled={!razorpayAvailable}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition focus:outline-none 
                  ${
                    razorpayAvailable
                      ? "border-gray-200 bg-white hover:shadow-md focus:ring-2 focus:ring-indigo-500/20"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
              >
                <div
                  className={`absolute -right-6 -top-6 h-16 w-16 rounded-full transition-transform
                    ${razorpayAvailable ? "bg-indigo-50 group-hover:scale-125" : "bg-gray-200"}
                  `}
                />
                <div className="relative flex items-center gap-3">
                  <div
                    className={`shrink-0 rounded-lg p-2
                      ${razorpayAvailable ? "bg-indigo-600/10 text-indigo-700" : "bg-gray-200 text-gray-400"}
                    `}
                  >
                    <CreditCardIcon className="h-6 w-6" />
                  </div>
                  <div className={`${razorpayAvailable ? "text-gray-900" : "text-gray-400"}`}>
                    <h4 className="font-semibold">Razorpay</h4>
                    <p className={`text-sm ${razorpayAvailable ? "text-gray-600" : "text-gray-400"}`}>
                      Pay with UPI, Cards, Netbanking
                    </p>
                  </div>
                </div>
                <div className={`mt-3 text-xs ${razorpayAvailable ? "text-indigo-700/80" : "text-gray-400"}`}>
                  {razorpayAvailable ? "Instant confirmation • Secure gateway" : "Currently unavailable"}
                </div>
                {!razorpayAvailable && (
                  <div className="absolute inset-0 rounded-xl pointer-events-none opacity-70" />
                )}
              </button>

              {/* COD (Active) */}
              <button
                type="button"
                onClick={submitCOD}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-50 transition-transform group-hover:scale-125" />
                <div className="relative flex items-center gap-3">
                  <div className="shrink-0 rounded-lg bg-emerald-600/10 p-2 text-emerald-700">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cash on Delivery</h4>
                    <p className="text-sm text-gray-600">Pay at your doorstep</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-emerald-700/80">
                  Available on eligible pincodes
                </div>
              </button>
            </div>

            <div className="mt-5 text-center text-xs text-gray-500">
              Your payment info is encrypted and never stored on our servers.
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          By proceeding, you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default PaymentOption;
