import React, { useEffect, useState } from "react";
import ProfileImage from "../assets/Account-cuate.svg";
import Toast from "../components/Toast";
import { blogDelete, userProfile } from "../api/blogApi";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { getFollowers, getFollowings, userFollow } from "../api/socialApi";

const Profile = () => {
  const navigate = useNavigate();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [sidePanelData, setSidePanelData] = useState([]);
  const [sidePanelTitle, setSidePanelTitle] = useState("Details");
  const [showSidePanel, setShowSidePanel] = useState(false);

  const [loginUserID, setloginUserID] = useState("");
  const [isFollowing, setisFollowing] = useState(false);
  const [username, setusername] = useState("");
  const [fCount, setfCount] = useState(0);
  const [userId, setuserId] = useState(0);
  const location = useLocation();
  const userIdFetch = location.state?.id;

  const [searchUser, setsearchUser] = useState("");

  const [profileData, setProfileData] = useState({
    username: "loading...",
    followers: 0,
    following: 0,
    blogs: [],
  });

  const [count, setCount] = useState(0);

  // Show toast
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const handleOpenSidePanel = (data, title = "Details") => {
    setSidePanelData(data);
    setSidePanelTitle(title);
    setShowSidePanel(true);
  };

  const handelShowComments = (comments) => {
    handleOpenSidePanel(comments, "Comments");
  };

  const handleUserFollowers = async (ID, search = "") => {
    try {
      const res = await getFollowers({ ID, search });
      handleOpenSidePanel(res.data, "Followers");
    } catch (error) {
      console.log(error);
      showToast("Failed to load followers", "error");
    }
  };

  const handleUserFollowings = async (ID, search = "") => {
    try {
      const res = await getFollowings({ ID, search });
      handleOpenSidePanel(res.data, "Followings");
    } catch (error) {
      console.log(error);
      showToast("Failed to load followings", "error");
    }
  };

  const handelDelete = async (id) => {
    try {
      await blogDelete(id);
      showToast("Blog deleted successfully", "success");
      setCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to delete blog", "error");
    }
  };

  const handelFollow = async (data) => {
    try {
      await userFollow(data);
      showToast("now following","success")
      setfCount((prev) => prev + 1);
    } catch (error) {
      showToast(error.messsage,"error")
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response) navigate("/login");
    } catch (err) {
      showToast(err?.response?.data?.message || "Logout failed", "error");
      if (err?.response?.status === 401) navigate("/login");
    }
  };

  const handelUpdate = (title, body, id) => {
    navigate("/update", { state: { title, body, id } });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userProfile(userIdFetch);
        const {
          userDetail,
          followerCount,
          followingCount,
          loginUserID,
          followingStatus,
        } = res.data;

        setloginUserID(loginUserID);
        setuserId(userIdFetch || loginUserID);
        setisFollowing(followingStatus);
        setusername(userDetail.username);
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
  }, [count, fCount]);

  // Debounce search in sidebar
  useEffect(() => {
    const delay = setTimeout(() => {
      if (sidePanelTitle === "Followers") {
        handleUserFollowers(userId, searchUser);
      } else if (sidePanelTitle === "Followings") {
        handleUserFollowings(userId, searchUser);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchUser]);

  return (
    <>
      <Navbar onlogout={handleLogout} />

      <div className="grid grid-cols-12 min-h-screen container mx-auto px-4 py-6 gap-4">
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {profileData.username}
              </h2>
              <p className="text-gray-600 mt-1">
                <button
                  onClick={() => handleUserFollowers(userId)}
                  className="font-semibold border px-1"
                >
                  {profileData.followers}
                </button>{" "}
                Followers ·{" "}
                <button
                  onClick={() => handleUserFollowings(userId)}
                  className="font-semibold"
                >
                  {profileData.following}
                </button>{" "}
                Following
              </p>
            </div>

            {isFollowing ? (
              <button className="px-4 py-2 bg-gray-300 text-black rounded">
                Following
              </button>
            ) : userId && loginUserID !== userId ? (
              <button
                onClick={() => handelFollow({ id: userId, name: username })}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Follow
              </button>
            ) : null}
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

                {/* Comments preview */}
                <div className="text-sm text-gray-700 mb-2">
                  <p className="font-semibold">Recent Comments:</p>
                  {blog.comments?.length > 0 ? (
                    blog.comments.slice(0, 2).map((c, i) => (
                      <p key={i} className="ml-2 text-gray-600">• {c.comment}</p>
                    ))
                  ) : (
                    <p className="ml-2 text-gray-400">No comments yet.</p>
                  )}
                </div>

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
            {profileData.blogs.length === 0 && (
              <p className="text-gray-500">No blogs posted yet.</p>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div
          className={`fixed bottom-19 z-50 right-0 h-[80%] w-full md:w-[400px] bg-white shadow-lg z-40 transform transition-transform duration-300 ${
            showSidePanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-green-200 bg-green-100">
            <h2 className="text-lg font-semibold text-green-800">
              {sidePanelTitle}
            </h2>
            <button
              onClick={() => setShowSidePanel(false)}
              className="text-green-700 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Search bar */}
          {(sidePanelTitle === "Followers" || sidePanelTitle === "Followings") && (
            <div className="p-3 border-b border-green-100 bg-green-50">
              <input
                type="text"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setsearchUser(e.target.value)}
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
            </div>
          )}

          {/* Panel Content */}
          <div className="p-4 overflow-y-auto h-[calc(100%-200px)] space-y-3">
            {sidePanelData?.length > 0 ? (
              sidePanelData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 p-3 rounded-md border border-green-200"
                >
                  {sidePanelTitle === "Comments" ? (
                    <>
                      <p className="font-semibold text-green-900">
                        {item.comment || item.body}
                      </p>
                      <p className="text-green-800 text-end text-sm">
                        {item.commentAuthor?.username || "Anonymous"}
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold text-green-900">{item.username}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-green-700 text-sm">
                No {sidePanelTitle.toLowerCase()} yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
