import React from 'react'
import {Link, useNavigate}  from 'react-router-dom'

const Navbar = ({onlogout}) => {
    const navigate = useNavigate()
    const handelCreateBlog = async ()=>{
        navigate("/createBlog")
    }
  return (
    <nav className="bg-green-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">
            <Link to="/dashboard">Blogverse</Link>
          </div>
           
          <div className="flex items-center gap-6 text-sm">
           <Link to="/dashboard" className="hover:text-green-200">Home</Link>
            <Link to="/profile" className="hover:text-green-200">Profile</Link>
             <Link to="/plans" className="hover:text-green-200">Plans</Link>
            <button onClick={handelCreateBlog} className="bg-white text-green-600 font-medium px-4 py-1 rounded hover:bg-green-100">
              Get Started
            </button>
            <button onClick={onlogout} className="bg-white text-red-600 font-medium px-4 py-1 rounded hover:bg-red-100">
              Logout
            </button>
          </div>
        </div>
      </nav>
  )
}

export default Navbar