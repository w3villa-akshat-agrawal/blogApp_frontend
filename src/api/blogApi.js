import blogInstance from "./axios/blogInstance"



export const allBlog = async () => {
  try {
    const res = await blogInstance.get("/allBlog");
    return res.data;
  } catch (error) {
    // log error optionally
    console.error("allBlog API Error:", error.response?.data || error.message);
    throw error; // ✅ throw it instead of returning
  }
};

export const createBlog = async (data)=>{
    const res = await blogInstance.post("/createBlog",data)
    return res
}

export const userProfile = async ()=>{
    const res = await blogInstance.get("/userBlog")
    return (res.data)
}

export const blogDelete = async (id)=>{
    const  res = await blogInstance.delete(`/delete/blog/${id}`)
    return (res.data)
}
export const blogUpdate = async (data,id)=>{
    const res = await blogInstance.patch(`/updateBlog/${id}`,data)
    return (res.data)
}
export const fetchBlog = async (id) =>{
  const res = await blogInstance.get(`/particularBlog/${id}`)
  return (res.data)
}
