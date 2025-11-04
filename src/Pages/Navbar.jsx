// src/components/Navbar.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import MyContext from "../context/Mycontext";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(2);
  const [wishlistCount] = useState(1);
  // usecontext using here
  const data = useContext(MyContext);

  const links = [
    { name: "Men", to: "/product/men" },
    { name: "Women", to: "/product/women" },
    { name: "Kids", to: "/product/kids" },
    { name: "New", to: "/product/new" },
    { name: "Sale", to: "/product/sale" },
  ];

  // Style helpers for NavLink
  const navClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
    }`;

  const mobileItemClasses = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${
      isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-800 hover:bg-gray-100"
    }`;

  // Prevent background scroll while drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "contain";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [mobileOpen]);

  // handling search produts
  const navigate = useNavigate();
  const [input,setInput] = useState();
  const submitHandle = (e) => {
    e.preventDefault();
    navigate(`/product/search/${input}`)
  }

  return (
    <header className="sticky top-0 z-[50] bg-white/80 backdrop-blur border-b isolate">
      {/* Main navigation bar */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: mobile menu button + logo */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              className="sm:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setMobileOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Brand */}
            <NavLink to="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white font-bold">
                E
              </span>
              <span className="text-lg font-semibold tracking-tight">EcomStore</span>
            </NavLink>
          </div>

          {/* Center: main links (hidden on small screens) */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <li key={l.name}>
                <NavLink to={l.to} className={navClasses}>
                  {l.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right: search + wishlist + account + cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (large screens) */}
            <form
              onSubmit={submitHandle}
              role="search"
              aria-label="Site search"
              className="relative hidden lg:block"
            >
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                onChange={(e) => setInput(e.target.value)}
                name="q"
                type="search"
                placeholder="Search products"
                className="w-72 rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </form>

            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <HeartIcon className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-semibold leading-none text-white">
                  {data.wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Account */}
            <NavLink
              to="/account"
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Account"
            >
              <UserIcon className="h-6 w-6" />
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold leading-none text-white">
                  {data.cartCounts}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Mobile search */}
        <form
          onSubmit={submitHandle}
          role="search"
          aria-label="Mobile search"
          className="mt-3 lg:hidden"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              onChange={(e) => setInput(e.target.value)}
              name="q"
              type="search"
              placeholder="Search products"
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 my-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </form>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <div className="fixed left-0 top-0 h-[100svh] w-80 max-w-[85%] bg-white shadow-xl z-[70] overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white font-bold">
                  E
                </span>
                <span className="text-base font-semibold">EcomStore</span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Drawer links and shortcuts */}
            <nav className="px-2 py-2">
              {/* Main links */}
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.name}>
                    <NavLink
                      to={l.to}
                      className={mobileItemClasses}
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.name}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Common account actions */}
              <div className="mt-4 border-t pt-4">
                <NavLink
                  to="/account"
                  className={mobileItemClasses}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="inline-flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    My Account
                  </span>
                </NavLink>

                <NavLink
                  to="/wishlist"
                  className={mobileItemClasses}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="inline-flex items-center gap-2">
                    <HeartIcon className="h-5 w-5" />
                    Wishlist
                    {/* {wishlistCount > 0 && (
                      <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-semibold leading-none text-white">
                        {wishlistCount}
                      </span>
                    )} */}
                  </span>
                </NavLink>

                <NavLink
                  to="/cart"
                  className={mobileItemClasses}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingCartIcon className="h-5 w-5" />
                    Cart
                    {/* {cartCount > 0 && (
                      <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold leading-none text-white">
                        {cartCount}
                      </span>
                    )} */}
                  </span>
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
