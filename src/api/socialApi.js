import socilaInstance from "./axios/socilaInstance"



export  const userFollow = async (data)=>{
    const res = socilaInstance.post("/following",data)
    return res

}