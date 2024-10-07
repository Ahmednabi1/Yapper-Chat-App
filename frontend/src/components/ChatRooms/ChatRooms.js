import React, { useState, useEffect } from "react";
import "./ChatRooms.css";
import "./bootstrap.min.css";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

function ChatRooms() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setRoom] = useState("");
  const [namespaceSocket, setnamespaceSocket] = useState("");
  const rooms = ["one", "two", "three"];
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (selectedRoom) {
      const newnamespaceSocket = io(
        `http://localhost:5000/chat/${selectedRoom}`,
        { auth: { token: localStorage.getItem("token") } }
      );

      // Listening for incoming messages
      newnamespaceSocket.on("chat message", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `${data.from} : ${data.message}`,
        ]);
      });
      setnamespaceSocket(newnamespaceSocket);
      return () => {
        newnamespaceSocket.disconnect();
        setMessages([]);
      };
    }
  }, [selectedRoom]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && namespaceSocket) {
      namespaceSocket.emit("chat message", message); // Send message to backend
      setMessage("");
    }
  };

  return (
    <div className="chat-container row-2">
      <div className="sidebar coloumn-1">
        <h2>Chats</h2>

        <ul>
          {rooms.map((room, index) => (
            <li key={index}>
              <a
                href="#"
                onClick={() => {
                  setRoom(room);
                  setMessages([]);
                }}
                className=""
              >
                {room}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area" coloumn-2>
        {selectedRoom ? (
          <>
            <h3>Room:{selectedRoom}</h3>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <p>{msg}</p>
                </div>
              ))}
            </div>
            <form className="message-form coloumn" onSubmit={sendMessage}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)} // Updated casing for consistency
                placeholder="Type your message......."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <>
            <p>please select a chatroom to start yapping</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatRooms;
