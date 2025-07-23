import React, { useEffect, useState } from 'react';
import { allBlog } from '../api/blogApi';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/authApi';
import Navbar from '../components/Navbar';


const Dashboard = () => {
  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(false);
  const [blog, setBlog] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [userId, setuserId] = useState("")
  const handelBlogOpen = (id)=>{
    navigate("/Blog", {
      state: {id},
    });
  }
  useEffect(() => {
  // 🌟 1. Set userId immediately from localStorage (if present)
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
     setuserId(Number(storedUserId));
  }

  // 🌟 2. Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await allBlog();
      setBlog(response.data.data);

      // 🌟 3. If userId comes from DB, update state + localStorage
      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId);
        setuserId(response.data.userId);
      }

      setToastMessage("Blogs fetched successfully!");
      setToastType("success");
      setToastVisible(true);
    } catch (err) {
      console.error("Error fetching blogs:", err?.response?.data?.message);
      setToastMessage(err?.response?.data?.message || "Something went wrong");
      setToastType("error");
      setToastVisible(true);
      if (err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  fetchBlogs();
}, []);


  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response) {
        navigate('/login');
      }
    } catch (err) {
      setToastMessage(err?.response?.data?.message || "Something went wrong");
      setToastType("error");
      setToastVisible(true);
      if (err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* ✅ Toast Notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />

      {/* ✅ Green Themed Navbar */}
      <Navbar onlogout= {handleLogout} />

      {/* ✅ Blog Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Latest Blogs</h2>

        <div className="space-y-6">
          {blog.map((item, idx) => (
            <div
              onClick={()=>{
                handelBlogOpen(item.id)
              }}
              key={idx}
              className="flex flex-col md:flex-row items-start md:items-center bg-white rounded-xl border border-green-200 shadow-md p-5 hover:bg-green-100 transition"
            >
              {/* 📝 Blog Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-green-800 mb-2">{item.title}</h3>
                <p className="text-green-700 mb-3">
                  {item.body.length > 150 ? item.body.slice(0, 150) + "..." : item.body}
                </p>

               <div className="flex items-center gap-4 flex-wrap text-sm text-green-600">
  <span>
    by <span className="font-semibold">{userId === item.author.id ? "Me" : item.author?.username || "Anonymous"}</span>
  </span>
{/* 
  {userId !== item.author.id && (
    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
      Follow
    </button>
  )} */}

  <button className="hover:underline">
    💬 {item.comments?.length || 0} Comments
  </button>
</div>

              </div>

              {/* 📷 Image */}
              <div className="mt-4 md:mt-0 md:ml-6">
                <img
                  src="https://flowbite.com/docs/images/blog/image-4.jpg"
                  alt="Blog Thumbnail"
                  className="w-40 h-28 object-cover rounded-lg border border-green-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
