import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { customUserPayload } from "../types/express";
import {JWT_SECRET} from '@repo/backend-common'

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                status:false,
                message:"User is not authorized"
            })
        }
        const userVerification = jwt.verify(token!,JWT_SECRET!) as customUserPayload

        if(!userVerification){
            return res.status(401).json({
                status:"false",
                message:"User is not verified"
            })
        }
        req.user = userVerification
        next()
        
    } catch (error) {
        return res.status(401).json({
            status:false,
            message:"Invalid or expired token"
        })
        
    }
}
