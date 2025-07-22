import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBlog } from '../api/blogApi';
import Navbar from '../components/Navbar';
import { postComment } from '../api/commentApi';

const BlogPage = () => {
  const { state } = useLocation();
  const { id } = state;
  const navigate = useNavigate();

  const [blog, setBlog] = useState([]);
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState('');

  // Fetch blog
  useEffect(() => {
    const blogFetch = async () => {
      try {
        const res = await fetchBlog(id);
        setBlog(res.data.data);
        setUserId(res.data.userId);
      } catch (err) {
        setError('Failed to fetch blog');
        console.error(err.message);
      }
    };

    blogFetch();
  }, [id, count]);

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!blog || blog.length === 0) return <div className="text-center mt-10 text-green-800">Loading blog...</div>;

  const blogData = blog[0];

  const handleGoToProfile = (id) => {
    navigate('/Profile', {
      state: { id },
    });
  };

  const handlePublishComment = async (id) => {
    try {
      if (!newComment.trim()) return;

      await postComment({ comment: newComment }, id);
      setCount((prev) => prev + 1);
      setNewComment('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Blog Section */}
      <div className="max-w-4xl relative mt-5 mx-auto bg-green-100 rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-green-900 leading-tight">
          {blogData.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
          <p className="text-green-700 text-sm">
            By{' '}
            <span
              onClick={() => handleGoToProfile(blogData.author.id)}
              className="font-semibold text-green-900 cursor-pointer hover:underline"
            >
              {blogData.author?.username}
            </span>
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleGoToProfile(blogData.author.id)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition"
            >
              Go to Profile
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition"
            >
              Comments ({blogData.comments?.length || 0})
            </button>
          </div>
        </div>

        <article className="text-green-800 leading-relaxed whitespace-pre-line text-base">
          {blogData.body}
        </article>
      </div>

      {/* Slide-in Comment Sidebar */}
      <div
        className={`fixed bottom-19 right-0 h-[80%] w-full md:w-[400px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          showComments ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-green-200 bg-green-100">
          <h2 className="text-lg font-semibold text-green-800">Comments</h2>
          <button
            onClick={() => setShowComments(false)}
            className="text-green-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Comments List */}
        <div className="p-4 overflow-y-auto h-[calc(100%-200px)] space-y-3">
          {blogData.comments?.length > 0 ? (
            blogData.comments.map((comment, idx) => (
              <div
                key={idx}
                className="bg-green-50 p-3 rounded-md border border-green-200"
              >
                <p className="font-semibold text-green-900">
                  {comment.comment || comment.body}
                </p>
                <p className="text-green-800 text-end text-sm">
                  {comment.commentAuthor.username || 'Anonymous'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-green-700 text-sm">No comments yet</p>
          )}
        </div>

        {/* New Comment Box */}
        <div className="p-4 border-t border-green-200 bg-green-100">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-green-400 text-green-900"
            placeholder="Write a comment..."
          />
          <button
            onClick={() => handlePublishComment(blog[0].id)}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full"
          >
            Publish Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
