// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { MinusIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);  // [{ _id, productId:{...}, quantity, size }]
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});   // per-item in-flight lock

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/cart", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      const list = Array.isArray(data.carts) ? data.carts : [];
      setItems(list);
    } catch (e) {
      console.error("Cart fetch error:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (id, nextQty) => {
    const curr = items.find((i) => i._id === id);
    if (!curr) return;
    const max = curr.productId?.stock ?? 1;
    const qty = Math.min(Math.max(1, nextQty), max);

    if (busy[id]) return;
    setBusy((b) => ({ ...b, [id]: true }));

    // optimistic update
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, quantity: qty } : it))
    );

    try {
      await fetch("https://ecomstore-backend-qrd5.onrender.com/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemId: id, quantity: qty }),
      });
    } catch (e) {
      // revert on error
      setItems((prev) =>
        prev.map((it) => (it._id === id ? { ...it, quantity: curr.quantity } : it))
      );
      console.error("Update qty failed:", e);
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const removeItem = async (id) => {
    if (busy[id]) return;
    setBusy((b) => ({ ...b, [id]: true }));

    const prevItems = items;
    setItems((p) => p.filter((i) => i._id !== id));

    try {
      await fetch("https://ecomstore-backend-qrd5.onrender.com/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemId: id }),
      });
    } catch (e) {
      console.error("Remove failed:", e);
      setItems(prevItems); // revert
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const saveForLater = async (id) => {
    const curr = items.find((i) => i._id === id);
    if (!curr) return;
    // Example for later:
    // await fetch("/wishlist/add", { method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include", body: JSON.stringify({ _id: curr.productId._id }) });
    // await removeItem(id);
  };

  // Totals
  const subtotal = items.reduce(
    (acc, it) => acc + (it.productId?.price || 0) * (it.quantity || 0),
    0
  );
  const shipping = subtotal > 4999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Loading cart...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <section className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
              Your cart is empty. Continue shopping to add items.
            </div>
          ) : (
            <ul className="divide-y rounded-lg border bg-white">
              {items.map((it) => {
                const p = it.productId || {};
                const img = p.images?.[0];
                return (
                  <li key={it._id} className="p-4 sm:p-5">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <a
                        href={`/product/${p._id}`}
                        className="block h-24 w-24 shrink-0 overflow-hidden rounded bg-gray-50 sm:h-28 sm:w-28"
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </a>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          {/* Pixel fix: min-w-0 + mobile-only typography and clamp */}
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 [@media(max-width:360px)]:text-[13px] [@media(max-width:360px)]:leading-[18px] [@media(max-width:360px)]:line-clamp-2 [@media(max-width:360px)]:break-words">
                              <a href={`/product/${p._id}`}>{p.name}</a>
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500 line-clamp-1 [@media(max-width:360px)]:text-[12px]">
                              {p.brand}
                              {it.size ? ` • ${it.size}` : ""}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-gray-900 [@media(max-width:360px)]:text-[13px]">
                              {formatINR(p.price)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                              aria-label="Save for later"
                              title="Save for later"
                              onClick={() => saveForLater(it._id)}
                            >
                              <TagIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                              aria-label="Remove item"
                              title="Remove"
                              onClick={() => removeItem(it._id)}
                              disabled={!!busy[it._id]}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity + stock */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-md border">
                            <button
                              type="button"
                              className="px-2 py-1.5 text-gray-700 hover:bg-gray-50"
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(it._id, (it.quantity || 1) - 1)}
                              disabled={(it.quantity || 1) <= 1 || !!busy[it._id]}
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={p.stock ?? 1}
                              value={it.quantity || 1}
                              readOnly
                              aria-label="Quantity"
                              className="w-12 border-x px-2 py-1.5 text-center text-sm outline-none"
                            />
                            <button
                              type="button"
                              className="px-2 py-1.5 text-gray-700 hover:bg-gray-50"
                              aria-label="Increase quantity"
                              onClick={() => updateQty(it._id, (it.quantity || 1) + 1)}
                              disabled={(it.quantity || 1) >= (p.stock ?? 1) || !!busy[it._id]}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <p
                            className={
                              (p.stock ?? 0) > 5
                                ? "text-xs text-green-600"
                                : (p.stock ?? 0) > 0
                                ? "text-xs text-amber-600"
                                : "text-xs text-rose-600"
                            }
                          >
                            {(p.stock ?? 0) > 5
                              ? "In stock"
                              : (p.stock ?? 0) > 0
                              ? `Only ${p.stock} left`
                              : "Out of stock"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Continue shopping */}
          <div className="mt-4">
            <a
              href="/"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              &larr; Continue shopping
            </a>
          </div>
        </section>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg border bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

            {/* Coupon */}
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="coupon"
                placeholder="Coupon code"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Apply
              </button>
            </form>

            {/* Price breakdown */}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium text-gray-900">
                  {shipping === 0 ? "Free" : formatINR(shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Tax (est.)</dt>
                <dd className="font-medium text-gray-900">{formatINR(tax)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Discount</dt>
                <dd className="font-medium text-gray-900">
                  {discount ? `- ${formatINR(discount)}` : formatINR(0)}
                </dd>
              </div>
              <div className="border-t pt-3 flex items-center justify-between text-base">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-semibold text-gray-900">{formatINR(total)}</dd>
              </div>
            </dl>

            <button
              onClick={() => navigate(`/checkout/payment/options/${total}`)}
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Taxes and shipping are estimates; final amounts are shown at
              checkout based on your address and method selection.
            </p>
          </div>

          <div className="mt-4 rounded-lg border bg-white p-4">
            <p className="text-xs text-gray-500">
              Secure payments with cards, UPI, and netbanking.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
