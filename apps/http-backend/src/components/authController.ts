import { NextFunction, Request, Response } from "express";
import {signinSchema, signupSchema} from "@repo/common"
import { prisma } from "@repo/db";
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";



export const signup =async  (req:Request,res:Response,next:NextFunction)=>{
  try {
    
      const response = signupSchema.safeParse(req.body)
      
     if(!response.success){
        return res.status(400).json({
            status:false,
            message:response.error.issues[0]?.message
        })
    }

    const {email,password,name} = response.data


    const checkUser = await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(checkUser){
        return res.status(400).json({
            status:false,
            message:`User with ${email} already exist`
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser =await prisma.user.create({
        data:{
            email:email,
            password:hashedPassword,
            name:name
        }
    })
    
  } catch (error) {
    res.status(400).json({
        success:false,
        error:error
    })
    
  }

}

export  const signin =  async  (req:Request,res:Response,next:NextFunction)=>{
    try {
        const response = signinSchema.safeParse(req.body)

        if(!response.success){
            return res.status(400).json({
                status:false,
                message:"singin failed"
            })
        }

        const {email,password} = response.data

        const foundUser= await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(!foundUser){
            return res.status(400).json({
                status:false,
                message:`User with ${email} not exits`

            })
        }

        const hashedPassword = await foundUser.password

        const verifyPasswrod = await bcrypt.compare(password,hashedPassword)
        

        if(!verifyPasswrod){
            res.status(400).json({
                status:false,
                message:"Password Incorrect"
            })
        }

        const token = jwt.sign({id:foundUser.id,email:foundUser.email},JWT_SECRET,{expiresIn:"1h"})
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            maxAge:60*60*1000
        })

        res.status(200).json({
            status:true,
            message:"User logged in"
        })

        
    } catch (error) {
        res.status(400).json({
            success:false,
            error:error
        }) 
    }


}



export const logout = (req:Request,res:Response,next:NextFunction)=>{


}


