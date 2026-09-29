const express = require('express')
const dotEnv = require('dotenv')
dotEnv.config();
const http = require('http')
const app = express();
const cors = require('cors')
app.use(cors());
app.use(express.json());
const {Server } = require('socket.io')
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
})
const users = {};
io.on("connection",(socket)=>{
    console.log("New User conected",socket.id);
    socket.on("join",(username)=>{
        users[username] = socket.id;
        console.log(username , "JOINED");
    });
    socket.on("sendMsg",(data)=>{
        const {sender,receiver,msg} = data;
        const receiversocket = users[receiver];
        if(receiversocket){
            io.to(receiversocket).emit("receiveMsg",{
                sender,receiver,msg
            })
        }
    })
    socket.on("disconnect",()=>{
        console.log("Disconnected",socket.id);
    })
})
const PORT = process.env.PORT;
server.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`)
})