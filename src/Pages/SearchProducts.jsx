// src/pages/SearchProducts.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MyContext from "../context/Mycontext";
import { StarIcon, HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import Navbar from "./Navbar";

function Stars({ value }) {
  const v = Number(value) || 0;
  const full = Math.floor(v);
  const half = v - full >= 0.5;
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

function SearchProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [wishlisted, setWishlisted] = useState({});
  const [busy, setBusy] = useState({});
  const [wishlistIds, setWishlistIds] = useState([]);

  // Counts for Navbar (match Products)
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCounts, setCartCounts] = useState(0);

  useEffect(() => {
    getProducts();
  }, [id]);

  useEffect(() => {
    // Load counts like Products
    refreshWishlistCount();
    refreshCartCount();
  }, []);

  const getProducts = async () => {
    const res = await fetch(`https://ecomstore-backend-qrd5.onrender.com/product/search/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    const items = Array.isArray(data.products) ? data.products : [];
    setResults(items);

    setWishlisted((prev) => {
      const next = { ...prev };
      items.forEach((p) => {
        if (next[p._id] === undefined) next[p._id] = false;
      });
      return next;
    });

    await syncWishlistIds(items);
    await refreshWishlistCount();
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

  const getWishlistIds = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/wishlistIds", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    const ids = Array.isArray(data.wishlist)
      ? data.wishlist.map((w) => w.productId)
      : [];
    setWishlistIds(ids);
    return ids;
  };

  const refreshWishlistCount = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/wishlist", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    setWishlistCount(Array.isArray(data.wishlist) ? data.wishlist.length : 0);
  };

  const refreshCartCount = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/cart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    setCartCounts(Array.isArray(data.carts) ? data.carts.length : 0);
  };

  const syncWishlistIds = async (items = results) => {
    const ids = await getWishlistIds();
    setWishlisted((prev) => {
      const next = { ...prev };
      ids.forEach((pid) => (next[pid] = true));
      items.forEach((p) => {
        if (!ids.includes(p._id)) next[p._id] = false;
      });
      return next;
    });
  };

  const toggleWish = async (pid) => {
    if (busy[pid]) return;
    setBusy((b) => ({ ...b, [pid]: true }));
    const nextVal = !wishlisted[pid];
    setWishlisted((prev) => ({ ...prev, [pid]: nextVal }));

    try {
      if (nextVal) await addinlike(pid);
      else await deletelike(pid);
      await Promise.all([syncWishlistIds(), refreshWishlistCount()]);
      // cart count not touched by wishlist; leave it as is
    } catch (e) {
      setWishlisted((prev) => ({ ...prev, [pid]: !nextVal }));
      console.error("Wishlist toggle failed:", e);
    } finally {
      setBusy((b) => ({ ...b, [pid]: false }));
    }
  };

  return (
    <MyContext.Provider value={{ wishlistCount, cartCounts }}>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((p) => {
            const isWished = !!wishlisted[p._id];
            const isBusy = !!busy[p._id];
            return (
              <article
                key={p._id}
                className="group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="block aspect-square w-full overflow-hidden bg-gray-50 rounded-t-lg"
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                    loading="lazy"
                  />
                </button>

                <div className="p-3 relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                        {p.brand}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                      onClick={() => toggleWish(p._id)}
                      disabled={isBusy}
                      className={`inline-flex items-center justify-center w-7 h-7 rounded ${
                        isWished ? "text-rose-600" : "text-gray-500 hover:text-rose-600"
                      } ${isBusy ? "opacity-60 cursor-not-allowed" : "hover:bg-rose-50"}`}
                    >
                      {isWished ? (
                        <HeartSolid className="h-5 w-5" />
                      ) : (
                        <HeartOutline className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                      <Stars value={Number(p.ratings) || 0} />
                      <span className="text-xs text-gray-500 truncate">
                        ({p.numReviews || 0})
                      </span>
                    </div>
                    <p className="flex-none whitespace-nowrap text-sm font-semibold text-gray-900 [@media(max-width:360px)]:text-[13px]">
                      ₹{Number(p.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </MyContext.Provider>
  );
}

export default SearchProducts;
