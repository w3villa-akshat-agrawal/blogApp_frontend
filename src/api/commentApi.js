import commentInstance from "./axios/commentInstance"

export const postComment = async (data,id) =>{
  const res = await commentInstance.post(`comment/${id}`,data)
  return (res.data)
}
