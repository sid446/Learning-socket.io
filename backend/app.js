import express from "express"
import { Server } from "socket.io";
import {createServer} from "http"
import cors from "cors"
import jwt from "jsonwebtoken";


const PORT=3000;
const secret="324124125"
const app=express()

const server=createServer(app)

//created instance of circuit
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }
})


app.use(cors({
    origin:"http://localhost:5173/",
    methods:["GET","POST"],
    credentials:true
}))

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.get("/login",(req,res)=>{
  const token=  jwt.sign({_id:"131331313"},secret)
  res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"}).json({message:"login success"})
})

// const user=false
// io.use((socket,next)=>{
//    if (user) next()
// })
io.on("connection",(socket)=>{
    console.log("User connected id :",socket.id);
    
    //  socket.emit("welcome",`Welcome to the server`);
    // socket.broadcast.emit("welcome",`User has joined ${socket.id}`);
   socket.on("message",({message,room})=>{
    console.log(room,message)
    //we can use socket in place of io it dosnt matter
    io.to(room).emit("receive-message",message)// sending this message to the whole circuit
   })
   socket.on("join-room",(room)=>{
    socket.join(room);
    console.log(`User joined room ${room}`)
   })

    socket.on("disconnect",()=>{
        console.log(`User disconnected ${socket.id}`)
    })
})

//this wont work since we have created server listen on app will create ne instance
// app.listen(PORT || 3000,()=>{
//     console.log(`Server is running on port ${PORT}`);
// })
server.listen(PORT || 3000,()=>{
    console.log(`Server is running on port ${PORT}`);
})