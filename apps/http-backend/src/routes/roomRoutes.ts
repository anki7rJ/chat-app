import express from 'express'
import { authMiddleware } from '../middleware/middleware'
import { room } from '../components/roomController'

const roomRouter:express.Router = express.Router()

roomRouter.post('/room',authMiddleware,room)
roomRouter.post('/room/:roomId',authMiddleware,)



export default roomRouter