import {email, string, z} from 'zod'

export const signinSchema = z.object({
    email:z.string().email(),
    password:z.string().min(4),
    
})

export const signupSchema = signinSchema.extend({
    name:z.string().min(4),
    confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
    message:"Password don't match",
    path:["ConfirmPassword"]
})


export const createRoomSchema = z.object({
    roomId:z.string().min(3).max(9)
})

