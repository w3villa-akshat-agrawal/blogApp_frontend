import React, { useState } from 'react';
import BlogSVG from '../assets/Publish article-bro (1).svg';
import Toast from '../components/Toast';
import { blogUpdate } from '../api/blogApi';
import { useNavigate, useLocation } from 'react-router-dom';

const Update = () => {
  const { state } = useLocation(); // ✅ Get blog data passed via navigate
  const { title, body, id } = state || {};
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({ title, body });

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await blogUpdate(blogData, id);
      showToast(response.data?.message || 'Blog updated successfully!', 'success');
      setBlogData({ title: '', body: '' });
      setTimeout(()=>{
        navigate("/profile")
      },2000)
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Failed to update blog.';
      showToast(errMsg, 'error');
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen container mx-auto relative">
      {/* ✅ Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />

      {/* Left: Blog Form */}
      <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Update Blog
            </h2>

            {[
              { name: 'title', placeholder: 'Blog Title', type: 'text' },
              { name: 'body', placeholder: 'Blog Content', type: 'textarea' }
            ].map(({ name, placeholder, type }) =>
              type === 'textarea' ? (
                <textarea
                  key={name}
                  name={name}
                  value={blogData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <input
                  key={name}
                  type={type}
                  name={name}
                  value={blogData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              )
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Update Blog
            </button>
          </form>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
        <img
          src={BlogSVG}
          alt="Blog Illustration"
          className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto"
        />
      </div>
    </div>
  );
};

export default Update;
