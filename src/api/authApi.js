import authInstance from './axios/authInstance';
import googleAuthInstance from './axios/googleAuthInstance';

export const loginUser = async (credentials) => {
  const res = await authInstance.post('/auth/login/basic', credentials);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await authInstance.post('/auth/signup/basic', data);
  return res.data;
};
export const logoutUser = async ()=>{
    const res = await authInstance.get('/auth/logout')
    return res.data
}

export const googleUserLogin = async () =>{0
     const res = await googleAuthInstance.get('/auth/google');
  console.log("33333333333333333333333333333")
  console.log(res.data)
  return res.data;
}
