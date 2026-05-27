import  { WebSocketServer,WebSocket } from 'ws'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common'


import {prisma} from '@repo/db'

const wss = new WebSocketServer({port:8080})

interface User{
    ws:WebSocket,
    userId:string,
    rooms:string[]
}

const users:User[] = []

function checkUser(token:string):string | null {
   try {
     const decoded = jwt.verify(token,JWT_SECRET)

        if(typeof decoded == "string"){
            return null
        }
        

  
    return decoded.id as string|| null
    
   } catch (error) {
    return null
    
   }
}


wss.on('connection',(ws,request)=>{
    const url = request.url
    if(!url){
        return
    }
    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get("token") || ""
    const userId = checkUser(token)

    if(!userId){
        ws.close()
    }
    if(userId==null){
        ws.close()
        return null
    }

    users.push({
        userId,
        rooms:[],
        ws
    })

    ws.on('message',async (data)=>{
        
        const parsedData = JSON.parse(data.toString())
        if(parsedData.type==="join_room"){
            const user = users.find(x=>x.ws===ws)
            user?.rooms.push(parsedData.roomId)
        }

        if(parsedData.type==="chat"){
            const roomId = parsedData.roomId
            const message = parsedData.message

            await prisma.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            })
            
            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId
                        
                    }))
                }
            })
        }

    })

    

})

