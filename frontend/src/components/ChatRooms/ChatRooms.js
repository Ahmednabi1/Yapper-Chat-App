import React, { useState, useEffect } from "react";
import "./ChatRooms.css"; // Ensure the CSS file is also renamed to ChatRooms.css
import io from "socket.io-client";

// Connect to the Socket.IO server
const socket = io("http://localhost:5000");

function ChatRooms() {
  const [id, setId] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Listen for room creation and joining events
    socket.on("room-created", (data) => {
      console.log(data);
    });

    socket.on("room-joined", (data) => {
      console.log(data);
    });

    // Listening for incoming messages
    socket.on("chat message", (msg, id) => {
      setMessages([...messages, id + ": " + msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message, room, id); // Send message to backend
      setMessage("");
    }
  };

  const HandleInputValue = (e) => {
    setRoom(e.target.value);
  };
  const CreateRoom = () => {
    setId("1");
    socket.emit("create-room", room, id);
  };
  const JoinRoom = () => {
    setId("1");
    socket.emit("join-room", room, id);
  };
  return (
    <div className="chat-container">
      <div className="sidebar">
        <h2>Chats</h2>
        <ul>
          <li>user1</li>
          <li>user2</li>
          <li>user3</li>
          <li>user4</li>
        </ul>
      </div>
      <div className="chat-area">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <p>{msg}</p>
            </div>
          ))}
        </div>
      </div>
      <div // div for createroom and join room
      >
        <button onClick={CreateRoom}>CreateRoomBtn</button>
        <input
          type="text"
          placeholder="enter room id"
          value={room}
          onChange={HandleInputValue}
        ></input>
        <button onClick={JoinRoom}>join Room</button>
        <div></div>
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Updated casing for consistency
          placeholder="Type your message......"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRooms;
