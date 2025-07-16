import React, { useEffect } from 'react';

const Google = () => {
  useEffect(() => {
    // Redirect the browser to backend Google login route
    window.location.href = "http://localhost:3008/api/v1/auth/google";
  }, []);

  return <div>Redirecting to Google...</div>;
};

export default Google;
