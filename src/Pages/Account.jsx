// src/pages/Account.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function Account({ email = "user@example.com", onLogout }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/ecomstore/logout",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: true}),
      credentials: "include"
    })
    navigate("/")
  };


  return (
    <main className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Top bar with back to home */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          aria-label="Back to home"
          title="Back to home"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">Account</h1>

      <div className="mt-6 rounded-lg border bg-white p-5">
        {/* Email only, as requested */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="text-base font-medium text-gray-900">{email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/30"
            aria-label="Logout"
            title="Logout"
          >
            Logout
          </button>
        </div>

        {/* Optional quick links */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            to="/orders"
            className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            View Orders
          </Link>
          <Link
            to="/addresses"
            className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Manage Addresses
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Account;
