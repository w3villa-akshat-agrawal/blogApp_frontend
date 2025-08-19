import React, { useEffect, useState } from "react";
import { allBlog } from "../api/blogApi";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(false);
  const [blog, setBlog] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [userId, setuserId] = useState("");

  const handelBlogOpen = (id) => {
    navigate("/Blog", {
      state: { id },
    });
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setuserId(Number(storedUserId));
    }

    const fetchBlogs = async () => {
      try {
        const response = await allBlog();
        setBlog(response.data.data);

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
        navigate("/login");
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
      <Navbar onlogout={handleLogout} />

      {/* ✅ Blog Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-green-700 mb-10 text-center">
          Blogs
        </h2>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blog.map((item, idx) => (
            <div
              onClick={() => handelBlogOpen(item.id)}
              key={idx}
              className="bg-white rounded-xl border border-green-200 shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition cursor-pointer flex flex-col"
            >
              {/* 📷 Blog Image */}
              <img
                src="https://flowbite.com/docs/images/blog/image-4.jpg"
                alt="Blog Thumbnail"
                className="w-full h-40 object-cover"
              />

              {/* 📝 Blog Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-green-700 flex-grow">
                  {item.body.length > 100
                    ? item.body.slice(0, 100) + "..."
                    : item.body}
                </p>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-sm text-green-600">
                  <span>
                    by{" "}
                    <span className="font-semibold">
                      {userId === item.author.id
                        ? "Me"
                        : item.author?.username || "Anonymous"}
                    </span>
                  </span>
                  <button className="hover:underline">
                    💬 {item.comments?.length || 0} Comments
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
