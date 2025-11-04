import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'

function Signup() {

  const [name,setName] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [usercreatingmsg,setUsercreatingmsg] = useState("Create your account to get started");

  // below of this route protecting

  const navigate = useNavigate()

  useEffect(() => {
    getToken()
  },[])


  const getToken = async () => {
    const res = await fetch('https://ecomstore-backend-qrd5.onrender.com/auth/signup', {
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
      navigate("/auth/signup")
    }
  }


  // below of this from handling

  const submitHandle = async (e) => {
    e.preventDefault()
    console.log(name,email,password)

    const res = await fetch("https://ecomstore-backend-qrd5.onrender.com/auth/createuser",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email,password}),
        credentials: "include"
    })
    const data = await res.json()
    setUsercreatingmsg(data.message)
  }

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-full max-w-md p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Signup</h1>
        <p className="text-sm text-gray-500">{usercreatingmsg}</p>
      </header>

      <form autoComplete="off" onSubmit={submitHandle} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2.5 bg-transparent border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition duration-200"
          />
        </div>

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
            placeholder="Create a password"
            className="w-full px-4 py-2.5 bg-transparent border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/auth/login" className="text-gray-900 font-medium hover:underline">
          Login here
        </a>
      </p>
    </div>
  </div>
    
  )
}

export default Signup