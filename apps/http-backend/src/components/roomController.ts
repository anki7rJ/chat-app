import { NextFunction, Request, Response } from "express";

import { createRoomSchema } from '@repo/common'
import {  prisma } from "@repo/db";


export const room = async (req:Request,res:Response,next:NextFunction)=>{
    const parsedData = createRoomSchema.safeParse(req.body)
    console.log(parsedData)
    console.log(req.body)
    console.log(parsedData.data)

    if(!parsedData.success){
        return res.status(400).json({
            status:false,
            message:parsedData.error.issues[0]?.message
        })
    }

    const user = req.user

    if(!user){
        return res.status(401).json({
            status:false,
            message:"Unauthorized"
        })
    }

    try {
        const room = await prisma.room.create({
            data:{
                slug: parsedData.data.roomId,
                adminId:user.id

            }
        })

        res.json({
            roomId:room.id
        })
        
    } catch (error) {
        res.status(411).json({
            message:"Room already exists with this name"
        })
        
    }
    


} 


export const roomId = async (req:Request,res:Response,next:NextFunction)=>{
    const roomId = Number(req.params.roomId)
    const message = await prisma.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50
    })

    


}