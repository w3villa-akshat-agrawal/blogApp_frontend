import React, { useEffect } from 'react';

const Google = () => {
  useEffect(() => {
    // Redirect the browser to backend Google login route
    window.location.href = "https://blog-backend-l8vd.onrender.com/api/v1/auth/google";
  }, []);

  return <div>Redirecting to Google...</div>;
};

export default Google;
