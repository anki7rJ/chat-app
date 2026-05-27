import express from 'express'
import { authMiddleware } from '../middleware/middleware'
import { room } from '../components/roomController'

const roomRouter:express.Router = express.Router()

roomRouter.post('/room',authMiddleware,room)


export default roomRouter