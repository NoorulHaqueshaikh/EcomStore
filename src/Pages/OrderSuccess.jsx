// src/pages/OrderSuccess.jsx
import React, { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";

/*
Optional: pass orderId and total via location.state from the previous page:
navigate("/order/success", { state: { orderId: createdOrder._id, total: createdOrder.totalAmount }});
*/

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location?.state?.orderId || null;
  const total = location?.state?.total || null;


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Card with subtle graphic accents (same style used on PaymentOption) */}
        <div className="relative rounded-3xl border border-gray-200 bg-white shadow-sm p-8 sm:p-10 overflow-hidden">
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-emerald-50" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-50" />
          <div className="pointer-events-none absolute top-10 -left-6 h-16 w-16 rounded-full bg-emerald-100/70" />
          <div className="pointer-events-none absolute bottom-6 -right-6 h-20 w-20 rounded-full bg-indigo-100/70" />

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="mx-auto inline-flex rounded-full bg-emerald-50 p-3">
              <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-900">
              Order placed successfully
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-prose mx-auto">
              Your order is confirmed and will be processed shortly. Track your order status anytime from your orders page.
            </p>

            {/* Summary pills */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {orderId && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  Order ID: {orderId}
                </span>
              )}
              {total !== null && (
                <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                  Paid: ₹{Number(total).toLocaleString("en-IN")}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Estimated delivery: 5–7 days
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
              >
                My Orders
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        {/* End card */}
      </div>
    </div>
  );
}

export default OrderSuccess;
