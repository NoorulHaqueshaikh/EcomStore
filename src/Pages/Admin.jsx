// src/pages/Admin.jsx
import React, { useState } from "react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "Generic",
  stock: "",
  images: [""], // start with one input
  ratings: 0,
  numReviews: 0,
  isFeatured: false,
  // sizes aligned with your model
  sizes: [{ size: "", stock: 0 }],
};

function Admin() {
  // Controlled form state
  const [form, setForm] = useState(initialForm);

  // Individual field states to hold submitted values
  const [nameState, setNameState] = useState("");
  const [descriptionState, setDescriptionState] = useState("");
  const [priceState, setPriceState] = useState(0);
  const [categoryState, setCategoryState] = useState("");
  const [brandState, setBrandState] = useState("Generic");
  const [stockState, setStockState] = useState(0);
  const [imagesState, setImagesState] = useState([]);
  const [ratingsState, setRatingsState] = useState(0);
  const [numReviewsState, setNumReviewsState] = useState(0);
  const [isFeaturedState, setIsFeaturedState] = useState(false);
  // NEW: sizes state mirror like others
  const [sizesState, setSizesState] = useState([]);

  // Your consoles (with sizes added)
  console.log(nameState);
  console.log(descriptionState);
  console.log(priceState);
  console.log(categoryState);
  console.log(brandState);
  console.log(stockState);
  console.log(imagesState);
  console.log(ratingsState);
  console.log(numReviewsState);
  console.log(isFeaturedState);
  console.log(sizesState); // sizes state logged too

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Images handlers
  const changeImage = (idx, value) => {
    setForm((f) => {
      const next = [...f.images];
      next[idx] = value;
      return { ...f, images: next };
    });
  };
  const addImage = () => {
    setForm((f) => ({ ...f, images: [...f.images, ""] }));
  };
  const removeImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  // Sizes handlers
  const changeSize = (idx, field, value) => {
    setForm((f) => {
      const next = [...(f.sizes || [])];
      next[idx] = {
        ...next[idx],
        [field]: field === "stock" ? Number(value) : value,
      };
      return { ...f, sizes: next };
    });
  };
  const addSize = () => {
    setForm((f) => ({ ...f, sizes: [...(f.sizes || []), { size: "", stock: 0 }] }));
  };
  const removeSize = (idx) => {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, i) => i !== idx) }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // Coerce numeric fields and clean images
    const priceNum = Number(form.price) || 0;
    const stockNum = Number(form.stock) || 0;
    const ratingsNum = Number(form.ratings) || 0;
    const numReviewsNum = Number(form.numReviews) || 0;
    const imagesClean = form.images.filter((u) => u && u.trim().length > 0);

    // Set each field into its own state variable (unchanged pattern)
    setNameState(form.name);
    setDescriptionState(form.description);
    setPriceState(priceNum);
    setCategoryState(form.category);
    setBrandState(form.brand);
    setStockState(stockNum);
    setImagesState(imagesClean);
    setRatingsState(ratingsNum);
    setNumReviewsState(numReviewsNum);
    setIsFeaturedState(form.isFeatured);
    // sizes mirror
    setSizesState(form.sizes || []);

    // sending data to backend for product schema model
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/create/product",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nameState,isFeaturedState,sizesState,numReviewsState,ratingsState,stockState,priceState,brandState,categoryState,descriptionState,imagesState
      })
    })


  };

  const reset = () => {
    setForm(initialForm);
    // Clear submitted mirrors
    setNameState("");
    setDescriptionState("");
    setPriceState(0);
    setCategoryState("");
    setBrandState("Generic");
    setStockState(0);
    setImagesState([]);
    setRatingsState(0);
    setNumReviewsState(0);
    setIsFeaturedState(false);
    setSizesState([]);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Admin: Add Product</h1>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-lg border bg-white p-5">
        {/* Basic info */}
        <div>
          <label className="block text-xs font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={change}
            required
            placeholder="Product name"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            required
            rows={4}
            placeholder="Short description"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Price, Stock, Category, Brand */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700">Price</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={change}
              required
              placeholder="0.00"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={change}
              required
              placeholder="0"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={change}
              required
              placeholder="e.g., Footwear"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={change}
              placeholder="Brand name"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Ratings, numReviews, isFeatured */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Ratings</label>
            <input
              name="ratings"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.ratings}
              onChange={change}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Num Reviews</label>
            <input
              name="numReviews"
              type="number"
              min="0"
              step="1"
              value={form.numReviews}
              onChange={change}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={change}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Featured
            </label>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-xs font-medium text-gray-700">Sizes</label>
          <div className="mt-1 space-y-3">
            {(form.sizes || []).map((sz, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder='Size label (e.g., "S", "M", "L", "XL")'
                  value={sz.size}
                  onChange={(e) => changeSize(idx, "size", e.target.value)}
                  className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Stock"
                  value={sz.stock}
                  onChange={(e) => changeSize(idx, "stock", e.target.value)}
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSize(idx)}
                  className="rounded-md border px-2.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={(form.sizes || []).length === 1}
                  title="Remove size"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="mt-1 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              + Add another size
            </button>
          </div>
        </div>

        {/* Images array */}
        <div>
          <label className="block text-xs font-medium text-gray-700">Images (URLs)</label>
          <div className="mt-1 space-y-2">
            {form.images.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={url}
                  onChange={(e) => changeImage(idx, e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="rounded-md border px-2.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  disabled={form.images.length === 1}
                  title="Remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addImage}
            className="mt-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Add another image
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            Save Product
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Preview of individually stored states after submit */}
      <div className="mt-6 rounded-lg border bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">Submitted Field States</h2>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs text-gray-800">
{JSON.stringify(
  {
    nameState,
    descriptionState,
    priceState,
    categoryState,
    brandState,
    stockState,
    imagesState,
    ratingsState,
    numReviewsState,
    isFeaturedState,
    sizesState,
  },
  null,
  2
)}
        </pre>
      </div>
    </main>
  );
}

export default Admin;
