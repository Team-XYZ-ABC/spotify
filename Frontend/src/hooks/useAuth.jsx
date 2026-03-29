import { registerService } from "../services/auth.service";

const useAuth = ()=>{

    const registerUser = async(data)=>{
        const res = await registerService(data)
        return res.data
    }

    return {
        registerUser
    }
}


export default useAuth