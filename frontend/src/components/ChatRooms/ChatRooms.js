import React, { useState, useEffect } from "react";
import "./ChatRooms.css"; // Ensure the CSS file is also renamed to ChatRooms.css
import io from "socket.io-client";

// Connect to the Socket.IO server
const socket = io("http://localhost:5000");

function ChatRooms() {
  const [message, setMessage] = useState(""); // Updated casing for consistency
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]); // Use functional update
    });

    // Cleanup function to remove the event listener
    return () => {
      socket.off("chat message");
    };
  }, []);

  // Function to send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage(""); // Clear input after sending
    }
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
