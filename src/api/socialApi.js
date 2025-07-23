import socilaInstance from "./axios/socilaInstance"



export  const userFollow = async (data)=>{
    const res = socilaInstance.post("/following",data)
    return res

}

export const getFollowers = async ({ ID, page = 1, limit = 10, search = "" }) => {
  const res = await socilaInstance.get(
    `/follower?page=${page}&limit=${limit}&ID=${ID}&search=${search}`
  );
return res.data;
};
export const getFollowings = async ({ ID, page = 1, limit = 10, search = "" }) => {
  const res = await socilaInstance.get(
    `/followings?page=${page}&limit=${limit}&ID=${ID}&search=${search}`
  );
return res.data;
};