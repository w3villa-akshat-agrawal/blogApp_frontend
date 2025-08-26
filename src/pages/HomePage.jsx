import React, { useEffect, useState } from 'react';
import blogImage from '../assets/blog-post-animate (1).svg';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 👈 new state

  const handleSubmit = () => {
    navigate("/signup");
  };

  useEffect(() => {
    const sessionGuard = async () => {
      try {
        const result = await axios.get(
          "https://blog-backend-l8vd.onrender.com/api/v1/sessionGuard",
          { withCredentials: true } // 👈 send cookies
        );

        if (result?.status === 200) {
          navigate("/dashboard"); // already logged in
        } else {
          setLoading(false); // allow UI to render
        }
      } catch {
        setLoading(false); // not logged in → show UI
      }
    };

    sessionGuard();
  }, [navigate]);

  // ⏳ Show loader until check is complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="loading loading-ring loading-lg text-green-600"></span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 min-h-screen container mx-auto">
      {/* Left side */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5 flex items-center justify-center p-4">
        <div className="flex flex-col items-start gap-6 max-w-md text-left">
          <h1 className="lg:text-[40px] text-[25px] font-bold text-gray-900">Welcome to BlogVerse</h1>
          <p className="text-gray-600">
            A platform where writers and readers connect, read, write, and explore around the world.
          </p>
          <Button
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 
                       focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 
                       me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 
                       dark:focus:ring-green-800"
            text="Get Started"
            eventFunction={handleSubmit}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="col-span-12 md:col-span-6 lg:col-span-7 flex items-center justify-center p-4">
        <img
          src={blogImage}
          alt="Blog Illustration"
          className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto"
        />
      </div>
    </div>
  );
};

export default HomePage;
