// src/pages/ProductShow.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, StarIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

function formatINR(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f-${i}`} className="h-5 w-5 text-amber-500" />
      ))}
      {half && (
        <StarIcon className="h-5 w-5 text-amber-500" style={{ clipPath: "inset(0 50% 0 0)" }} />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon key={`e-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
}

function ProductShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Wishlist state aligned with Products logic
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getProductDetails();
    syncWishlistForThisProduct();
  }, [id]);

  const getProductDetails = async () => {
    const res = await fetch(`https://ecomstore-backend-qrd5.onrender.com/product/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    const productData = data.response || data;
    setProduct(productData);

    if (productData.sizes && productData.sizes.length > 0) {
      setSelectedSize(productData.sizes[0].size);
    }
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
    const ids = Array.isArray(data.wishlist) ? data.wishlist.map((w) => w.productId) : [];
    return ids;
  };

  const syncWishlistForThisProduct = async () => {
    try {
      const ids = await getWishlistIds();
      setIsWishlisted(ids.includes(id));
    } catch (e) {
      // keep current state on error
    }
  };

  const toggleWishlist = async () => {
    if (busy) return;
    setBusy(true);

    const nextVal = !isWishlisted;
    setIsWishlisted(nextVal); // optimistic

    try {
      if (nextVal) {
        await addinlike(id);
      } else {
        await deletelike(id);
      }
      // Re-sync to ensure this mirrors backend truth exactly like Products
      await syncWishlistForThisProduct();
    } catch (e) {
      setIsWishlisted(!nextVal); // revert if API fails
      console.error("Wishlist toggle failed:", e);
    } finally {
      setBusy(false);
    }
  };

  // cart handling ....
  const handleAddToCart = async () => {
    console.log("Add to cart:", { productId: id, size: selectedSize, quantity });
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/add/cart", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id,selectedSize,quantity}),
      credentials: "include"
    })
    const data = res.json();
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images section */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                    selectedImage === idx ? "border-indigo-600" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
              {product.brand && <p className="mt-1 text-sm text-gray-600">{product.brand}</p>}
            </div>
            <button
              onClick={toggleWishlist}
              disabled={busy}
              className={`rounded-md p-2 text-gray-500 hover:bg-gray-100 ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? (
                <HeartIcon className="h-6 w-6 text-rose-600" />
              ) : (
                <HeartOutline className="h-6 w-6" />
              )}
            </button>
          </div>

          {product.ratings > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Stars value={product.ratings} />
              <span className="text-sm text-gray-600">
                {product.ratings.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          {product.price !== undefined && (
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{formatINR(product.price)}</p>
            </div>
          )}

          {product.description && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900">Description</h3>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-sm">
            {product.category && (
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                {product.category}
              </span>
            )}
            {product.stock !== undefined && (
              <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-rose-600"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">Select Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(sz.size)}
                    disabled={sz.stock === 0}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedSize === sz.size
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : sz.stock > 0
                        ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {sz.size}
                    {sz.stock === 0 && <span className="ml-1 text-xs">(Out)</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                −
              </button>
              <span className="text-lg font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Add to Cart
            </button>
          </div>

          {product.isFeatured && (
            <div className="mt-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              ⭐ Featured Product
            </div>
          )}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
          <div className="mt-6 space-y-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{review.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Stars value={review.rating} />
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductShow;
