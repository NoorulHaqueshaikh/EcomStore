// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import MyContext from "../context/Mycontext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { StarIcon, HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
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

function Products() {
  const navigate = useNavigate();
  const [productsData, setProductdata] = useState([]);
  const [wishlisted, setWishlisted] = useState({});
  const [busy, setBusy] = useState({});
  const [wishlistCount, setWishlistCount] = useState();
  const [wishlistIds, setWishlistIds] = useState([]);

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

    setWishlisted((prev) => {
      const next = { ...prev };
      ids.forEach((pid) => {
        next[pid] = true;
      });
      productsData.forEach((p) => {
        if (!ids.includes(p._id)) next[p._id] = false;
      });
      return next;
    });
  };

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
      await getWishlist();
      await getWishlistIds();
    } catch (e) {
      setWishlisted((prev) => ({ ...prev, [id]: !nextVal }));
      console.error("Wishlist toggle failed:", e);
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const [cartCounts, setCartCounts] = useState();
  const cartCount = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    setCartCounts(data.carts.length);
  };

  return (
    <MyContext.Provider value={{ wishlistCount, cartCounts }}>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Removed "View all" link block */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <p className="text-sm text-gray-600">
            Shop the latest drops and bestsellers
          </p>
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
                <button
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="block aspect-square overflow-hidden bg-gray-50 rounded-t-lg"
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                    loading="lazy"
                  />
                </button>

                <div className="p-3">
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

                  {/* Footer: keep price visible on very small screens */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                      <Stars value={p.ratings} />
                      <span className="text-xs text-gray-500 truncate">
                        ({p.numReviews})
                      </span>
                    </div>
                    <p className="flex-none whitespace-nowrap text-sm font-semibold text-gray-900 sm:text-sm [@media(max-width:360px)]:text-[13px]">
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

export default Products;
