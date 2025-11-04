// src/pages/ViewOrder.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [meta, setMeta] = useState({
    totalAmount: 0,
    orderStatus: "",
    paymentMethod: "",
    paymentStatus: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      const order = data?.order || {};
      setItems(Array.isArray(order.items) ? order.items : []);
      setAddress(order.address || null);
      setMeta({
        totalAmount: Number(order.totalAmount || 0),
        orderStatus: order.orderStatus || "",
        paymentMethod: order.paymentMethod || "",
        paymentStatus: order.paymentStatus || "",
        createdAt: order.createdAt || "",
      });
    } catch (e) {
      setItems([]);
      setAddress(null);
      setMeta({
        totalAmount: 0,
        orderStatus: "",
        paymentMethod: "",
        paymentStatus: "",
        createdAt: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          aria-label="Back to orders"
          title="Back to orders"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Orders
        </button>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">Order Summary</h1>

      {/* Graphic summary strip */}
      <section className="relative mt-6 rounded-2xl border border-gray-200 bg-white p-6 overflow-hidden">
        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-emerald-50" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-50" />
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="font-medium text-gray-900 break-all">{id}</p>
          </div>
          <div>
            <p className="text-gray-500">Placed on</p>
            <p className="font-medium text-gray-900">
              {meta.createdAt ? new Date(meta.createdAt).toLocaleString("en-IN") : "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-900">{meta.orderStatus || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-medium text-gray-900">{formatINR(meta.totalAmount)}</p>
          </div>
        </div>
      </section>

      {/* Address card with subtle graphics */}
      <section className="relative mt-6 rounded-2xl border border-gray-200 bg-white p-6 overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-100/70" />
        <div className="pointer-events-none absolute bottom-6 -left-6 h-20 w-20 rounded-full bg-indigo-100/70" />
        <div className="relative z-10">
          <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
          {!address ? (
            <p className="mt-3 text-sm text-gray-600">No address found.</p>
          ) : (
            <div className="mt-3 text-sm text-gray-700">
              <p className="font-medium text-gray-900">{address.fullName}</p>
              <p className="mt-1">{address.houseNo}</p>
              {address.landmark ? <p className="mt-1">{address.landmark}</p> : null}
              <p className="mt-1">
                {address.city}, {address.state} {address.pincode}
              </p>
              <p className="mt-1">Phone: {address.phone}</p>
            </div>
          )}
        </div>
      </section>

      {/* Items list with images */}
      <section className="relative mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full bg-indigo-50" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-emerald-50" />
        <div className="relative z-10">
          <h2 className="px-6 pt-6 text-base font-semibold text-gray-900">Items</h2>
          {loading ? (
            <div className="p-6 text-sm text-gray-600">Loading items…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No items found.</div>
          ) : (
            <ul className="divide-y">
              {items.map((it) => {
                const p = it.productId || {};
                const img =
                  Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;

                return (
                  <li key={it._id} className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-gray-50">
                        {img ? (
                          <img
                            src={img}
                            alt={p.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {p.name || "Product"}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span>{formatINR(it.price)}</span>
                          <span>Qty: {it.quantity}</span>
                          <span>Size: {it.size || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

export default ViewOrder;
