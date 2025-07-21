import planInstance from "./axios/planInstance"



export const subsApi = async ()=>{
        const res = await planInstance.get("/UserPlans");
        return res.data
}

export const buyPlan = async (data) =>{
        const res = await planInstance.post("/plan",data)
        return res.data
}