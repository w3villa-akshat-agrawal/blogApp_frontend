import React, { useEffect, useState } from 'react'
import {  subsApi } from '../api/planApi'
import blogSvg from '../assets/Pricing plans-bro.svg'
import Toast from '../components/Toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PlanPage = () => {
  const [plans, setPlans] = useState([])
  const navigate = useNavigate()

  // Toast States
  const [toastVisible, setToastVisible] = useState(false)
  const [userId, setuserId] = useState("")
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success") // or "error"
//   const [Price, setPrice] = useState(0)
    
  const showToast = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }
  
const handelbuyNow = async (planId, period, name) => {
  try {
    let price;
    if (name.toLowerCase() === "silver") {
      price = 5;
    } else if (name.toLowerCase() === "gold") {
      price = 10;
    } else {
      showToast("❌ Invalid plan selected", "error");
      return;
    }

    // Create Razorpay order
    const res = await axios.post("https://blog-backend-l8vd.onrender.com/api/payment/create-order", {
      amount: price * 100, // Razorpay accepts amount in paise
      planId,
    });

    const { order, key } = res.data;

    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Blog App",
      description: `Subscribe to ${name} plan`,
      order_id: order.id,
      handler: async (response) => {
        try {
          // Verify payment on backend
          await axios.post("https://blog-backend-l8vd.onrender.com/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId,
            period,
            userId: userId
          });

          showToast("✅ Payment Successful", "success");
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.log(err)
          showToast("❌ Payment verification failed", "error");
        }
      },
      prefill: {
        name: "User",
        email: "user@example.com",
      },
      theme: {
        color: "#22c55e",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
    const errMsg = error.response?.data?.message || 'Payment failed.';
    showToast(errMsg, "error");
  }
};


  useEffect(() => {
    const fetchPlans = async () => {
      const res = await subsApi()
      setPlans(res.data.res)
      setuserId(res.data.userId)
    }
    fetchPlans()
  }, [])

  const getPlanColor = (planName) => {
    switch (planName.toLowerCase()) {
      case 'free': return 'bg-gray-800'
      case 'silver': return 'bg-slate-500'
      case 'gold': return 'bg-yellow-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 px-4">
      {/* ✅ Toast Component */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl gap-8 items-center">
        {/* Pricing Cards */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose a Plan</h2>
          {plans.map((plan) => (
            <div key={plan.id}>
              <div
                className={`rounded-xl shadow-md text-white p-6 ${getPlanColor(plan.name)} transition-all hover:scale-[1.02] flex justify-between items-center`}
              >
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{plan.name} Plan</h3>
                  <p className="text-sm mb-1">
                    Blogs/day: {plan.maxBlogsPerDay ?? 'Unlimited'}
                  </p>
                  <p className="text-sm mb-1">
                    Can follow others: {plan.canFollow ? '✅ Yes' : '❌ No'}
                  </p>
                  <p className="text-sm">
                    Duration: {plan.durationHours} hour{plan.durationHours > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => handelbuyNow(plan.id, plan.durationHours,plan.name)}
                  className="border-black px-3 py-1 rounded bg-red-600 hover:scale-[1.05] transition-transform"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <img src={blogSvg} alt="Pricing Visual" className="max-w-md w-full" />
        </div>
      </div>
    </div>
  )
}

export default PlanPage
