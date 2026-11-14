import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import chatRoutes from './routes/chat.routes.js'

const app = express()

dotenv.config()

connectDB()

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req,res) => {
  res.json({message: "API is running"})
})

app.use('/api/chat', chatRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})