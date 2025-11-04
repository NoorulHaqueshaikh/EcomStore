// Footer.jsx
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
    { name: "On Sale", href: "#" },
    { name: "Gift Cards", href: "#" },
  ];

  const helpLinks = [
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Track Order", href: "#" },
    { name: "Support", href: "#" },
  ];

  const companyLinks = [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const accountLinks = [
    { name: "My Account", href: "/account" },
    { name: "Orders", href: "/orders" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Addresses", href: "#" },
  ];

  // admin check
  const [checkAdmin, setCheckAdmin] = useState(false);
  useEffect(() => {
    checkingAdmin();
  }, []);

  const checkingAdmin = async () => {
    try {
      const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/check/admin", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.userId === "68f5e5d700961244caeb77a0") {
        setCheckAdmin(true);
      }
    } catch (e) {
      // fail silently or add toast
    }
  };

  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand + contact + socials */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-indigo-600 text-white text-xl font-bold">
                E
              </span>
              <span className="text-xl font-semibold tracking-tight">EcomStore</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm text-gray-600">
              Quality products, fast delivery, and great prices.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-500" />
                Mumbai, India
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                <a
                  href="mailto:support@ecomstore.in"
                  className="hover:underline"
                  rel="noopener noreferrer"
                >
                  support@ecomstore.in
                </a>
              </li>
            </ul>

            <div className="mt-4 flex items-center gap-4 text-gray-500">
              <a href="#" aria-label="Facebook" className="hover:text-gray-700">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-gray-700">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="X" className="hover:text-gray-700">
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-gray-700">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Quick Links</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {quickLinks.map((l) => (
                  <li key={l.name}>
                    <Link to={l.href} className="hover:text-gray-900 hover:underline underline-offset-4">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900">Help</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {helpLinks.map((l) => (
                  <li key={l.name}>
                    <Link to={l.href} className="hover:text-gray-900 hover:underline underline-offset-4">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {companyLinks.map((l) => (
                  <li key={l.name}>
                    <Link to={l.href} className="hover:text-gray-900 hover:underline underline-offset-4">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900">Account</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {accountLinks.map((l) => (
                  <li key={l.name}>
                    <Link to={l.href} className="hover:text-gray-900 hover:underline underline-offset-4">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter + Admin */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-gray-900">Subscribe to our newsletter</h4>
            <p className="mt-2 text-sm text-gray-600">The latest deals, new drops, and updates. No spam.</p>

            <form className="mt-4 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                Subscribe
              </button>
            </form>

            {checkAdmin ? (
              <Link
                to="/admin"
                className="mt-8 shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">© {year} EcomStore. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <li>
              <Link className="hover:text-gray-900">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link  className="hover:text-gray-900">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link  className="hover:text-gray-900">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
