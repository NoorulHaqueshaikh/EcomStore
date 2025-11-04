// src/pages/Vieworders.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

// Map backend status strings to UI badge styles
function StatusBadge({ status }) {
  const map = {
    Delivered: "bg-green-100 text-green-700 ring-green-600/20",
    Shipped: "bg-blue-100 text-blue-700 ring-blue-600/20",
    Processing: "bg-amber-100 text-amber-700 ring-amber-600/20",
    Placed: "bg-indigo-100 text-indigo-700 ring-indigo-600/20",
    Cancelled: "bg-rose-100 text-rose-700 ring-rose-600/20",
    Returned: "bg-gray-100 text-gray-700 ring-gray-600/20",
  };
  const cls = map[status] || "bg-gray-100 text-gray-700 ring-gray-600/20";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
}

function Vieworders() {
  const [orders, setOrders] = useState([]); // normalized backend orders
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      console.log("ORDERS_RAW:", data.orders);

      const list = Array.isArray(data.orders) ? data.orders : [];
      const normalized = list.map((o) => ({
        id: o._id,
        date: o.createdAt,
        status: o.orderStatus,
        total: o.totalAmount,
        itemsCount: Array.isArray(o.items) ? o.items.length : 0,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        address: o.address,
      }));
      setOrders(normalized);
    } catch (e) {
      console.error("ORDERS_FETCH_ERROR:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    console.log("Reorder", orderId);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar with subtle graphics */}
      <div className="relative mb-4 rounded-2xl border border-gray-200 bg-white p-4 overflow-hidden">
        <div className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full bg-indigo-50" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-emerald-50" />
        <div className="relative z-10 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Back to home"
            title="Back to home"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </a>
          <h1 className="text-2xl font-semibold text-gray-900">Your Orders</h1>
          <span className="hidden sm:block w-[140px]" />
        </div>
      </div>

      {/* Orders list with decorative accents */}
      <div className="relative rounded-2xl border bg-white overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-indigo-50" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-emerald-50" />
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-8 h-12 w-12 rounded-full bg-indigo-100/60" />
        <div className="relative z-10">
          {/* Header row */}
          <div className="grid grid-cols-2 gap-4 px-4 py-3 text-xs font-semibold text-gray-500 sm:grid-cols-6">
            <div>Order ID</div>
            <div className="hidden sm:block">Date</div>
            <div className="hidden sm:block">Status</div>
            <div className="hidden sm:block">Items</div>
            <div className="hidden sm:block text-right">Total</div>
            <div className="text-right sm:text-left">Actions</div>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="p-4 text-sm text-gray-600">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-sm text-gray-600">No orders found.</div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="grid grid-cols-2 items-center gap-4 px-4 py-4 sm:grid-cols-6">
                  {/* Order ID + mobile meta */}
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate">{o.id}</div>
                    <div className="mt-0.5 text-xs text-gray-500 sm:hidden">
                      {new Date(o.date).toLocaleDateString("en-IN")} • {o.itemsCount} item{o.itemsCount > 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="hidden text-sm text-gray-700 sm:block">
                    {new Date(o.date).toLocaleDateString("en-IN")}
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block">
                    <StatusBadge status={o.status} />
                  </div>

                  {/* Items count */}
                  <div className="hidden sm:block text-sm text-gray-700">{o.itemsCount}</div>

                  {/* Total */}
                  <div className="hidden text-right text-sm font-semibold text-gray-900 sm:block">
                    {formatINR(o.total)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => navigate(`/view/order/${o.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      title="View details"
                      aria-label="View order"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(o.id)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                      title="Reorder items"
                      aria-label="Reorder"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Reorder</span>
                    </button>
                  </div>

                  {/* Mobile: status + total */}
                  <div className="col-span-2 mt-2 flex items-center justify-between sm:hidden">
                    <StatusBadge status={o.status} />
                    <div className="text-sm font-semibold text-gray-900">{formatINR(o.total)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">Showing {orders.length} orders</p>
        <div className="flex items-center gap-2">
          <button type="button" disabled className="rounded-md border px-2.5 py-1.5 text-xs text-gray-500">
            Prev
          </button>
          <button type="button" disabled className="rounded-md border px-2.5 py-1.5 text-xs text-gray-500">
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

export default Vieworders;
