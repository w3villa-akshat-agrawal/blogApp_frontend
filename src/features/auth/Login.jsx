import React, { useState, useEffect } from "react";
import { loginUser } from "../../api/authApi";
import SignupImage from "../../assets/Login-cuate.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Toast from "../../components/Toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setloader] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  // ✅ Show error toast if redirected from Google login with ?error=... in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const errorMessage = queryParams.get("error");

    if (errorMessage) {
      showToast(errorMessage, "error");
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    setloader(true)
    e.preventDefault();
    const payload = { ...formData };

    try {
      const response = await loginUser(payload);
      showToast(response.data?.message || "Login successful!", "success");

      setFormData({ email: "", password: "" });
      setloader(false)
      navigate("/dashboard");
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Something went wrong. Try again.";
      showToast(errMsg, "error");
    }
  };
   return (
  
    (
      <div className="grid grid-cols-12 min-h-screen container mx-auto relative">
        {/* ✅ Toast */}
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />

        {/* Left: Login Form */}
        <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Login to your account
              </h2>

              {[
                { name: "email", placeholder: "Email", type: "email" },
                { name: "password", placeholder: "Password", type: "password" },
              ].map(({ name, placeholder, type = "text" }) => (
                <input
                  key={name}
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ))}

              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Not have an account?{" "}
                <Link
                  to="/google"
                  className="text-green-600 hover:underline dark:text-green-400"
                >
                  Google Login
                </Link>
              </p>


              {loader ? (<div className="text-center"><span className="loading loading-ring loading-lg"></span></div>):(<button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Login
              </button>)}

              

              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Not have an account?{" "}
                <Link
                  to="/signup"
                  className="text-green-600 hover:underline dark:text-green-400"
                >
                  Signup
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
          <img
            src={SignupImage}
            alt="Signup Illustration"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto"
          />
        </div>
      </div>))
 

            }

export default Login;
