// src/pages/Products.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import MyContext from "../context/Mycontext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { StarIcon, HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

function Stars({ value = 0 }) {
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
        <StarIcon key={`e-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
}

function ProductWomen() {
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCounts, setCartCounts] = useState(0);
  const [busy, setBusy] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // Fast lookup for wishlisted
  const wishlistedMap = useMemo(() => {
    const map = {};
    wishlistIds.forEach((id) => (map[id] = true));
    return map;
  }, [wishlistIds]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch("https://ecomstore-backend-qrd5.onrender.com/find/products/women", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProductsData(Array.isArray(data.products) ? data.products : []);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchWishlistCount = useCallback(async () => {
    try {
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/wishlist", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setWishlistCount(Array.isArray(data.wishlist) ? data.wishlist.length : 0);
    } catch {
      setWishlistCount(0);
    }
  }, []);

  const fetchWishlistIds = useCallback(async () => {
    try {
      setLoadingWishlist(true);
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
    } finally {
      setLoadingWishlist(false);
    }
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/get/cart", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setCartCounts(Array.isArray(data.carts) ? data.carts.length : 0);
    } catch {
      setCartCounts(0);
    }
  }, []);

  // Initial loads
  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [fetchProducts, fetchCartCount]);

  // Sync wishlist after products length known
  useEffect(() => {
    fetchWishlistCount();
    fetchWishlistIds();
  }, [fetchWishlistCount, fetchWishlistIds, productsData.length]);

  const addInLike = async (_id) => {
    await fetch("https://ecomstore-backend-qrd5.onrender.com/wishlist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ _id }),
    });
  };

  const deleteLike = async (_id) => {
    await fetch("https://ecomstore-backend-qrd5.onrender.com/wishlist/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ _id }),
    });
  };

  const toggleWish = async (id) => {
    if (busy[id]) return;
    setBusy((b) => ({ ...b, [id]: true }));

    const nextVal = !wishlistedMap[id];

    // Optimistic local update without changing layout metrics
    setWishlistIds((prev) =>
      nextVal ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
    );
    setWishlistCount((c) => (nextVal ? c + 1 : Math.max(c - 1, 0)));

    try {
      if (nextVal) await addInLike(id);
      else await deleteLike(id);
      await Promise.all([fetchWishlistCount(), fetchWishlistIds()]);
    } catch {
      // Revert
      setWishlistIds((prev) =>
        nextVal ? prev.filter((x) => x !== id) : [...new Set([...prev, id])]
      );
      setWishlistCount((c) => (nextVal ? Math.max(c - 1, 0) : c + 1));
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const contextValue = useMemo(
    () => ({ wishlistCount, cartCounts }),
    [wishlistCount, cartCounts]
  );

  const isLoading = loadingProducts || loadingWishlist;

  return (
    <MyContext.Provider value={contextValue}>
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-4">Men Products</h2>

        {isLoading && (
          <div className="text-sm text-gray-600">Loading products...</div>
        )}

        {!isLoading && productsData.length === 0 && (
          <div className="text-sm text-gray-600">
            No products found. Please check back later.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {productsData.map((p) => {
            const isWished = !!wishlistedMap[p._id];
            const isBusy = !!busy[p._id];

            return (
              <article
                key={p._id}
                className="group relative rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Media: keep corners clean */}
                <button
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="block aspect-square overflow-hidden rounded-t-lg w-full"
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="h-full w-full object-cover rounded-t-lg"
                    loading="lazy"
                  />
                </button>

                {/* Content */}
                <div className="p-3 relative">
                  {/* Spacer to reserve header row height and prevent reflow */}
                  <div className="min-h-6" />

                  {/* Title */}
                  <h3 className="line-clamp-1 text-sm font-semibold pr-10">
                    {p.name}
                  </h3>

                  {/* Heart button: absolute, fixed size -> no layout shift */}
                  <button
                    type="button"
                    aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => toggleWish(p._id)}
                    disabled={isBusy}
                    className={`absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors outline-none ${
                      isWished ? "text-rose-600" : "text-gray-600 "
                    } ${isBusy ? "opacity-60 cursor-not-allowed" : "hover:bg-rose-100"}`}
                  >
                    {isWished ? (
                      <HeartSolid className="h-5 w-5" />
                    ) : (
                      <HeartOutline className="h-5 w-5" />
                    )}
                  </button>

                  <div className="mt-2 flex items-center justify-between">
                    <Stars value={p.ratings} />
                    <span className="text-sm font-semibold">
                      ₹{Number(p.price || 0).toLocaleString("en-IN")}
                    </span>
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

export default ProductWomen;
