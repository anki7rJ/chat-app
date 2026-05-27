import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes";
import roomRouter from "./routes/roomRoutes";


const app = express()

app.use(express.json())
app.use(cookieParser())



app.use('/auth',router)
app.use('/user',roomRouter)


const PORT = 3000

app.listen(PORT,()=>{
    console.log(`Your app is running on port: ${PORT} `)

})
