import adminInstance from "./axios/adminInstnace"




export const adminPannel = async (search = "",page=0,limit=10)=>{
    const res = adminInstance.get(`/adminPanel?page=${page}&limit=${limit}&search=${search}`)
    return res
}

export const block = async(id)=>{
    const res = adminInstance.get(`/userblocking/${id}`)
    return res
}

export const unBlock = async(id)=>{
    const res = adminInstance.get(`/userUnblocking/${id}`)
    return res
}