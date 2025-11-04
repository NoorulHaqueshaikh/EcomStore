import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() { 

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [userloginmsg,setUserloginmsg] = useState("Access your account to manage your business");

  const navigate = useNavigate()

  // ✅ Check if user already logged in
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const res = await fetch('https://ecomstore-backend-qrd5.onrender.com/auth/login', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include"
    });

    const token = await res.json()
    if(token.status){
      navigate("/")
    }
  }

  // ✅ Login with email + password
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/auth/loginuser",{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email,password}),
      credentials: "include"
    });

    const data = await res.json()
    setUserloginmsg(data.message)

    if(data.message === "exits"){
      navigate("/")
    }
  }

  // ✅ Detect Google success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");

    if (success === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.open("https://ecomstore-backend-qrd5.onrender.com/auth/google", "_self");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Login to EcomStore</h1>
          <p className="text-sm text-gray-500">{userloginmsg}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 bg-transparent border border-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 bg-transparent border border-gray-200 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gray-900 text-white rounded-md"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="mt-2 w-full inline-flex items-center justify-center gap-3 border border-gray-200 text-gray-700 rounded-md px-4 py-2.5 hover:bg-gray-50"
          >
            <span className="text-sm">Login with Google</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-gray-900 font-medium hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login;
