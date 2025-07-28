import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { otpVerify, regenrateOtp } from "../../api/otpApi"; // Adjust the path if needed
import SignupImage from "../../assets/Enter OTP-bro.svg";
import Toast from "../../components/Toast";

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone||7455966189 // 📌 Get phone from navigate state

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };
const  handelregenerate = async ()=>{
    const payload = {
        phone: `+91${phone}`, 
      };
  const result = await regenrateOtp(payload)
  console.log(result)
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      showToast("Please enter the full 6-digit OTP", "error");
      return;
    }

    if (!phone) {
      showToast("Phone number missing. Please sign up again.", "error");
      return;
    }

    try {
      const payload = {
        phone: `${phone}`, // If phone already includes +91, then use phone directly
        otp: finalOtp,
      };

      const response = await otpVerify(payload);
      showToast(response.message || "OTP Verified Successfully", "success");

      setTimeout(() => {
        navigate("/login"); // or wherever you want to go
      }, 1000);
    } catch (err) {
        console.log(err)
      showToast("otp expire plz regenrate otp", "error");
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen container mx-auto">
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* Left Side */}
      <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Enter OTP</h2>
            <p className="text-gray-500 text-sm mb-2">Enter the 6-digit code sent to your number</p>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Submit OTP
            </button>
            <button onClick={()=>{
              handelregenerate()
            }} className="text-white">regenrate otp</button>
          </form>
        </div>
      </div>

      {/* Right Side Illustration */}
      <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
        <img
          src={SignupImage}
          alt="OTP Illustration"
          className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto"
        />
      </div>
    </div>
  );
};

export default Otp;
