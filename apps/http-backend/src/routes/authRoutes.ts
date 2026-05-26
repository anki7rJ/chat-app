import express from 'express'
import { logout, signin, signup } from '../components/authController'

const router:express.Router = express.Router()

router.post('/login',signin)
router.post('/signup',signup)
router.post('/logout',logout)

export default router

