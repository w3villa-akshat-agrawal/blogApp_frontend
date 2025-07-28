
import otpInstance, { otpInstance2 } from "./axios/otpInstance"

export const otpVerify = async (data) =>{
  const res = await otpInstance2.post("/verify",data)
  return (res.data)
}
export const regenrateOtp = async (data) =>{
  const res = await otpInstance.post("/send",data)
  return (res.data)
}