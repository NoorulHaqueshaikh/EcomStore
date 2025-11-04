import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'


function Login() { 

  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [userloginmsg,setUserloginmsg] = useState("Access your account to manage your business");

  // below is for protecting route

  const navigate = useNavigate()

  useEffect(() => {
    getToken()
  },[])


  const getToken = async () => {
    const res = await fetch('https://ecomstore-backend-qrd5.onrender.com/auth/login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    })
    const token = await res.json()

    if(token.status){
      navigate("/")
    }else{
      navigate("/auth/login")
    }
  }

  // below for login operation

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/auth/loginuser",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email,password}),
      credentials: "include"
    })
    const data = await res.json()
    setUserloginmsg(data.message)
    if(data.message === "exits"){
      navigate("/")
    }
  }

  // below for google login

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const success = params.get("success");

  // If Google login succeeded, redirect to home
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
            className="w-full px-4 py-2.5 bg-transparent border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition duration-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2.5 bg-transparent border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
        >
          Login
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="mt-4 w-full inline-flex items-center justify-center gap-3 border border-gray-200 text-gray-700 rounded-md px-4 py-2.5 hover:bg-gray-50 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
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

export default Login