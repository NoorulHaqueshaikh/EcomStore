// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import MyContext from "../context/Mycontext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import {
  StarIcon,
  HeartIcon as HeartSolid,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f-${i}`} className="h-4 w-4 text-amber-500" />
      ))}
      {half && (
        <StarIcon className="h-4 w-4 text-amber-500 [mask-image:linear-gradient(90deg,#000_0,#000_50%,transparent_50%)]" />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon
          key={`e-${i}`}
          className="h-4 w-4 text-gray-300"
          style={{ filter: "grayscale(100%) brightness(1.4)" }}
        />
      ))}
    </div>
  );
}

function ProductSale() {
  const navigate = useNavigate();
  const [productsData, setProductdata] = useState([]);
  const [wishlisted, setWishlisted] = useState({}); // {_id: true/false}
  const [busy, setBusy] = useState({}); // {_id: true while request in-flight}
  const [wishlistCount, setWishlistCount] = useState();
  const [wishlistIds, setWishlistIds] = useState([]); // product _ids currently wishlisted

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/product", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const token = await res.json();
    if (token.status) navigate("/");
    else navigate("/auth/login");

    const response = await fetch("https://ecomstore-backend-qrd5.onrender.com/find/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const products = await response.json();
    setProductdata(products);

    // Initialize to false; will be overwritten by wishlistIds after fetch
    setWishlisted((prev) => {
      const next = { ...prev };
      products.forEach((p) => {
        if (next[p._id] === undefined) next[p._id] = false;
      });
      return next;
    });
  };

  const addinlike = async (_id) => {
    await fetch("https://ecomstore-backend-qrd5.onrender.com/wishlist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
      credentials: "include",
    });
  };

  const deletelike = async (_id) => {
    await fetch("https://ecomstore-backend-qrd5.onrender.com/wishlist/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
      credentials: "include",
    });
  };

  // Sync count
  useEffect(() => {
    getWishlist();
    cartCount();
  }, []);

  const getWishlist = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/wishlist", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    const value = data.wishlist.length;
    setWishlistCount(value);
  };

  // Fetch wishlist IDs and map them to the cards
  const getWishlistIds = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/wishlistIds", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    // Expecting array like [{ productId: "..." }, ...] in data.wishlist
    const ids = Array.isArray(data.wishlist)
      ? data.wishlist.map((w) => w.productId)
      : [];
    setWishlistIds(ids);

    // Apply to wishlisted map
    setWishlisted((prev) => {
      const next = { ...prev };
      ids.forEach((pid) => {
        next[pid] = true;
      });
      // Any product not in ids should be false
      productsData.forEach((p) => {
        if (!ids.includes(p._id)) next[p._id] = false;
      });
      return next;
    });
  };

  // Call once after mount and after products load
  useEffect(() => {
    getWishlistIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData.length]);

  const toggleWish = async (id) => {
    if (busy[id]) return;
    setBusy((b) => ({ ...b, [id]: true }));

    const nextVal = !wishlisted[id];
    setWishlisted((prev) => ({ ...prev, [id]: nextVal }));

    try {
      if (nextVal) {
        await addinlike(id);
      } else {
        await deletelike(id);
      }
      // Re-sync with server to ensure icon matches backend truth
      await getWishlist();
      await getWishlistIds();
    } catch (e) {
      setWishlisted((prev) => ({ ...prev, [id]: !nextVal }));
      console.error("Wishlist toggle failed:", e);
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  // for show in cart number's of cart in ui of navbar
  const [cartCounts,setCartCounts] = useState()
  const cartCount = async() => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/cart",{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    })
    const data = await res.json();
    setCartCounts(data.carts.length)
  }

  return (
    <MyContext.Provider value={{wishlistCount,cartCounts}}>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Featured Products
            </h2>
            <p className="text-sm text-gray-600">
              Shop the latest drops and bestsellers
            </p>
          </div>
          <a
            href="/shop"
            className="hidden sm:inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {productsData.map((p) => {
            const isWished = !!wishlisted[p._id];
            const isBusy = !!busy[p._id];
            return (
              <article
                key={p._id}
                className="group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <a
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="block aspect-square overflow-hidden bg-gray-50"
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </a>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">{p.brand}</p>
                    </div>

                    <button
                      type="button"
                      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                      onClick={() => toggleWish(p._id)}
                      disabled={isBusy}
                      className={`rounded p-1 hover:bg-rose-50 ${
                        isWished ? "text-rose-600" : "text-gray-500 hover:text-rose-600"
                      } ${isBusy ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {isWished ? (
                        <HeartSolid className="h-5 w-5" />
                      ) : (
                        <HeartOutline className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stars value={p.ratings} />
                      <span className="text-xs text-gray-500">({p.numReviews})</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{Number(p.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Add to Cart button removed */}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <a
            href="/shop"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View all
          </a>
        </div>
      </section>
    </MyContext.Provider>
  );
}

export default ProductSale;
