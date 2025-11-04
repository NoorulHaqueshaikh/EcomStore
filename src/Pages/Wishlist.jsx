// src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import MyContext from "../context/Mycontext";
import { TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

function formatINR(n) {
  const val = Number(n || 0);
  return `₹${val.toLocaleString("en-IN")}`;
}

function Wishlist() {
  const [items, setItems] = useState([]); // will hold products from backend
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState();

  const removeItem = async (id) => {
    // Optimistic UI: remove immediately
    setItems((prev) => prev.filter((p) => p._id !== id));
    try {
      await fetch("https://ecomstore-backend-qrd5.onrender.com/wishlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: id }),
      });
      await getWishlist(); // refresh count/items
    } catch {
      // Optionally revert on failure
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const getWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/wishlist", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      const value = Array.isArray(data.wishlist) ? data.wishlist.length : 0;
      setWishlistCount(value);

      // Expect: { wishlist: [ product or {productId: product}, ... ] }
      let list = Array.isArray(data.wishlist) ? data.wishlist : [];
      if (list.length > 0 && list[0].productId) {
        list = list.map((w) => w.productId);
      }
      setItems(list);
      console.log("Wishlist items:", list);
    } catch (e) {
      console.error("Wishlist fetch error:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Loading wishlist...</p>
      </main>
    );
  }

  return (
    <MyContext.Provider value={wishlistCount}>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar: Back button + Title */}
        <div className="flex items-center justify-between gap-3">
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

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-semibold text-gray-900">Wishlist</h1>
            <p className="text-sm text-gray-600">
              Saved items for later; move to cart when you’re ready.
            </p>
          </div>

          <span className="hidden sm:block w-[140px]" />
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-lg border bg-white p-8 text-center text-gray-600">
            Your wishlist is empty. Browse products and save items you like.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((p) => {
              const inStock = (p.stock ?? 0) > 0;
              const image = p.images?.[0];
              return (
                <article
                  key={p._id}
                  className="group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <a
                    href={`/product/${p._id}`}
                    className="block aspect-square overflow-hidden bg-gray-50"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </a>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                          <a href={`/product/${p._id}`}>{p.name}</a>
                        </h3>
                        {p.brand && (
                          <p className="mt-0.5 text-xs text-gray-500">{p.brand}</p>
                        )}
                      </div>
                      {/* Heart icon intentionally removed */}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`text-xs ${
                          inStock ? "text-green-600" : "text-rose-600"
                        }`}
                      >
                        {inStock ? "In stock" : "Out of stock"}
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatINR(p.price)}
                      </p>
                    </div>

                    {/* Only Remove button (Add to Cart removed) */}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => removeItem(p._id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <TrashIcon className="h-5 w-5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </MyContext.Provider>
  );
}

export default Wishlist;
