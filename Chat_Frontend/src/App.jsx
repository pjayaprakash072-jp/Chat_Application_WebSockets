import { useEffect } from 'react';
import { useState } from 'react'
import {io} from 'socket.io-client'
const socket = io("http://localhost:5000")
const App = () => {
    const [username,setUsername] = useState("");
    const [receiver,setReceiver] = useState("");
    const [msg,setMsg] = useState("");
    const [messages,setMessages] = useState([]);
    useEffect(
        ()=>{
            socket.on("receiveMsg",(data)=>{
                setMessages(
                    (oldMessages)=>[
                        ...oldMessages,data
                    ]
                )
            });
            return ()=>socket.off("receiveMsg")
        },[]
    )
    const join =()=>{
        if(username.trim() === "") return;
        socket.emit("join",username);
    }
    const sendMessage = ()=>{
        if(msg.trim() === "" || receiver.trim() === "") return;
        const data = {
                sender:username,
                receiver:receiver,
                msg:msg
        }
        socket.emit("sendMsg",data);
        setMessages(
            (oldMessages)=>[
                ...oldMessages,data
            ]
        )
        setMsg("");
    }
  return (
    <div>
        <h1>Simple Chat app</h1>
        <input 
        placeholder='Enter your name'
        onChange={(e)=>setUsername(e.target.value)}
        value={username}
        type="text" />
        <button onClick={join}>Join</button>
        <br /><br />
        <input 
        placeholder='Receiver Name'
        value={receiver}
        onChange={(e)=>setReceiver(e.target.value)}
        type="text" />
        <br /><br />
        <div>
            {
                messages.map(
                    (item ,index)=>(
                        <p
                        key={index}
                        >
                            <b>{item.sender}</b> {"  "} {item.msg}
                        </p>
                    )
                )
            }
        </div>
        <input 
        placeholder='Enter Message'
        onChange={(e)=>setMsg(e.target.value)}
        value={msg}
        type="text" />
        <button onClick={sendMessage}>send</button>
    </div>
  )
}

export default App