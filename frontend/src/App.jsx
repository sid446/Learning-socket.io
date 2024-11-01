import { Button, Container, TextField, Typography, Stack } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []); // prevent reconnecting on re-render
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState("");

  const GroupHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room",group)
    setGroup("")

  }



  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected:", socket.id);
    });

    // Listen for incoming messages
    socket.on("receive-message", (data) => {
      console.log('received:', data);
      setMessages((messages)=>[...messages,data]); // Append new message
    });

    socket.on("welcome", (welcomeMessage) => {
      console.log(welcomeMessage);
    });

    // Cleanup socket connection
    return () => {
      socket.disconnect();
    }
  }, [socket]); // Include socket in dependency array for clarity

  // Send message to the room
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && room) { // Ensure message and room aren't empty
      socket.emit("message", { message, room });
      setMessage("");
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        Socket ID: {socketId}
      </Typography>
      <form onSubmit={GroupHandler}>
     <h5>Join room</h5>
     <TextField 
          value={group} 
          onChange={(e) => setGroup(e.target.value)} 
          label="Group" 
          variant="outlined" 
          fullWidth 
        />
        <Button type="submit" variant="contained" color="primary">Join</Button>
      </form>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          label="Message" 
          variant="outlined" 
          fullWidth 
        />
        <TextField 
          value={room} 
          onChange={(e) => setRoom(e.target.value)} 
          label="Room" 
          variant="outlined" 
          fullWidth 
        />
        <Button type="submit" variant="contained" color="primary">Send</Button>
      </form>
      
      <Stack spacing={2}>
        {messages.map((msg, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
