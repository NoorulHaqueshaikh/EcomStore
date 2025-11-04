// src/pages/ManageAddress.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/solid";

function AddressCard({ data }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {data.isDefault ? "Default Address" : "Address"}
            </h3>
            {data.isDefault && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Default
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-700">
            {data.fullName}
            <br />
            {data.addressLine}
            {data.landmark ? (
              <>
                <br />
                {data.landmark}
              </>
            ) : null}
            <br />
            {data.city}, {data.state} {data.pincode}
            <br />
            Phone: {data.phone}
          </p>
        </div>
      </div>
    </div>
  );
}

function AddressForm({ onCancel, onSaved }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    addressLine: "",
    landmark: "",
    isDefault: true, // mark default by default if you only keep one
  });

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("ADDRESS_FORM_SUBMIT_PAYLOAD:", form);
    try {
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/address/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          pincode: form.pincode,
          state: form.state,
          city: form.city, // fixed: use form.city, not form.state
          addressLine: form.addressLine,
          landmark: form.landmark,
          isDefault: form.isDefault,
        }),
      });
      const data = await res.json();
      // If backend returns the created address, reflect it in UI
      if (res.ok && (data.address || data._id)) {
        onSaved(data.address || data);
      } else {
        // Fall back to optimistic
        onSaved({ ...form, _id: `temp_${Date.now()}` });
      }
    } catch (e2) {
      // Optimistic fallback
      onSaved({ ...form, _id: `temp_${Date.now()}` });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={change}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={change}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">PIN Code</label>
          <input
            name="pincode"
            value={form.pincode}
            onChange={change}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">State</label>
          <input
            name="state"
            value={form.state}
            onChange={change}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">City</label>
          <input
            name="city"
            value={form.city}
            onChange={change}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700">Address Line</label>
          <input
            name="addressLine"
            value={form.addressLine}
            onChange={change}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700">Landmark (Optional)</label>
          <input
            name="landmark"
            value={form.landmark}
            onChange={change}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Near park, mall, etc."
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={change}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        Set as default address
      </label>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ManageAddress() {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [adding, setAdding] = useState(false);

  // Fetch and display backend address
  useEffect(() => {
    getAddress();
  }, []);

  const getAddress = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/address/get", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    // Map backend object directly to UI
    if (data?.address) {
      setDefaultAddress({
        _id: data.address._id,
        fullName: data.address.fullName,
        phone: data.address.phone,
        pincode: data.address.pincode,
        state: data.address.state,
        city: data.address.city,
        addressLine: data.address.addressLine,
        landmark: data.address.landmark || "",
        isDefault: true, // your API doesn’t return it; default page shows this one
      });
    } else {
      setDefaultAddress(null);
    }
  };

  const handleSaved = (newAddr) => {
    // Show newly added as current default (UX choice)
    setDefaultAddress({
      ...newAddr,
      isDefault: true,
    });
    setAdding(false);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <a
          href="/account"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          aria-label="Back"
          title="Back"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Account</span>
          <span className="sm:hidden">Back</span>
        </a>

        <h1 className="text-2xl font-semibold text-gray-900">Manage Addresses</h1>

        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add New
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="mb-6 rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-base font-semibold text-gray-900">Add Address</h2>
          <AddressForm onCancel={() => setAdding(false)} onSaved={handleSaved} />
        </div>
      )}

      {/* Default address view */}
      {!defaultAddress ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
          No default address on file. Click “Add New” to create one.
        </div>
      ) : (
        <AddressCard data={defaultAddress} />
      )}
    </main>
  );
}

export default ManageAddress;
