
import otpInstance from "./axios/otpInstance"

export const otpVerify = async (data) =>{
  const res = await otpInstance.post("/verify",data)
  return (res.data)
}