import React, { useEffect, useState } from "react";
import ProfileImage from "../assets/Account-cuate.svg";
import Toast from "../components/Toast";
import { blogDelete, userProfile } from "../api/blogApi";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";

const Profile = () => {
  const navigate = useNavigate();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showComments, setShowComments] = useState(false);
  const [commentData,setcommentData] = useState([])
    const location = useLocation();
  const userId = location.state?.id;
  const [profileData, setProfileData] = useState({
    username: "loading...",
    followers: 0,
    following: 0,
    blogs: [],
  });

  const [count, setCount] = useState(0);

  // Helper: show toast
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };
  const handelShowComments = async (data)=>{
    console.log(data)
    setcommentData(data)
    setShowComments(true)
  }
  // Delete blog
  const handelDelete = async (id) => {
    try {
      const res = await blogDelete(id);
      console.log(res);

      showToast("Blog deleted successfully", "success");

      setCount((prev) => prev + 1); // Trigger re-fetch
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to delete blog", "error");
    }
  };

  // Logout user
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response) {
        navigate("/login");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Logout failed", "error");

      if (err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Navigate to update page
  const handelUpdate = (title, body, id) => {
    navigate("/update", {
      state: { title, body, id },
    });
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userProfile(userId);
        const { userDetail, followerCount, followingCount } = res.data;

        setProfileData({
          username: userDetail.username,
          followers: followerCount,
          following: followingCount,
          blogs: userDetail.blogs,
        });
      } catch (err) {
        console.log(err);
        showToast("Failed to load profile", "error");
      }
    };

    fetchProfile();
  }, [count]);

  return (
    <>
      <Navbar onlogout={handleLogout} />

      <div className="grid grid-cols-12 min-h-screen container mx-auto px-4 py-6 gap-4">
        {/* Toast */}
        <Toast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onClose={() => setToastVisible(false)}
        />

        {/* Left: Profile Image */}
        <div className="col-span-12 md:col-span-4 flex items-center justify-center">
          <img
            src={ProfileImage}
            alt="Profile"
            className="w-full max-w-xs h-auto rounded-md shadow-md"
          />
        </div>

        {/* Right: Profile Info + Blogs */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          {/* User Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{profileData.username}</h2>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">{profileData.followers}</span> Followers ·{" "}
              <span className="font-semibold">{profileData.following}</span> Following
            </p>
          </div>

          {/* Blog List */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4">
            {profileData.blogs.map((blog) => (

              <div
                key={blog.id}
                className="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
              >
                <h4 className="text-lg font-bold text-gray-800">{blog.title}</h4>
                <p className="text-gray-600 mt-1 mb-2">{blog.body}</p>

                {/* Preview comments */}
                <div className="text-sm text-gray-700 mb-2">
                  <p className="font-semibold">Recent Comments:</p>
                  {blog.comments?.length > 0 ? (
                    blog.comments.slice(0, 2).map((c, index) => (
                      <p key={index} className="ml-2 text-gray-600">
                        • {c.comment}
                      </p>
                    ))
                  ) : (
                    <p className="ml-2 text-gray-400">No comments yet.</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handelShowComments(blog.comments)} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Show All Comments
                  </button>
                  <button
                    onClick={() => handelUpdate(blog.title, blog.body, blog.id)}
                    className="text-yellow-600 hover:underline text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handelDelete(blog.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* No Blogs Message */}
            {profileData.blogs.length === 0 && (
              <p className="text-gray-500">No blogs posted yet.</p>
            )}
          </div>
        </div>
        {/* side bar */}
        <div
        className={`fixed bottom-19 z-50 right-0 h-[80%] w-full md:w-[400px] bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          showComments ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-green-200 bg-green-100">
          <h2 className="text-lg font-semibold text-green-800">Comments</h2>
          <button onClick={() => setShowComments(false)} className="text-green-700 text-xl font-bold">
            ×
          </button>
        </div>

        {/* Comments List */}
        <div className="p-4 overflow-y-auto h-[calc(100%-200px)] space-y-3">
          {commentData?.length > 0 ? (
            commentData.map((comment, idx) => (
              <div key={idx} className="bg-green-50 p-3 rounded-md border border-green-200">
                <p className="font-semibold text-green-900">{comment.comment || comment.body}</p>
                <p className="text-green-800 text-end text-sm">{comment.commentAuthor.username || 'Anonymous'}</p>
              </div>
            ))
            
          ) : (
            <p className="text-green-700 text-sm">`No coments yet `</p>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Profile;
