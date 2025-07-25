import React, { useState } from "react";
import { signupUser } from "../../api/authApi";
import SignupImage from "../../assets/sign-up-animate.svg";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../components/Toast";

const Signup = () => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

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
    e.preventDefault();
    const payload = {
      ...formData,
      isActive: true,
      status: true,
    };

    try {
      const response = await signupUser(payload);
      showToast(response.data?.message || "Signup successful!", "success");

      setFormData({
        username: "",
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        password: "",
      });
      setTimeout(() => {
        console.log(response)
        
  navigate("/otpVerification", {
    state: { phone: response.data.user.phone }
  });
}, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Something went wrong. Try again.";
      showToast(errMsg, "error");
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen container mx-auto relative">
      {/* ✅ Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* Left: Signup Form */}
      <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Create your account
            </h2>

            {[
              { name: "username", placeholder: "Username" },
              { name: "firstName", placeholder: "First Name" },
              { name: "lastName", placeholder: "Last Name" },
              { name: "email", placeholder: "Email", type: "email" },
              { name: "phone", placeholder: "Phone" },
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

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Sign Up
            </button>

            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:underline dark:text-green-400">
                Login
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
    </div>
  );
};

export default Signup;
