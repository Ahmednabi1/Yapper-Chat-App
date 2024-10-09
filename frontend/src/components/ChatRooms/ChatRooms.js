import React, { useState, useEffect } from "react";
import "./ChatRooms.css";
import "./bootstrap.min.css"
import io from "socket.io-client";
import CreateRoom from "../CreateRoom/CreateRoom";
import { useNavigate } from "react-router-dom";

function ChatRooms() { 
  const [isvisible, Setisvisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setRoom] = useState(""); 
  const [namespaceSocket, setnamespaceSocket] = useState("");
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (selectedRoom) {
      // fetchMessages(selectedRoom);
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

  // fetch old messages from db
  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}/messages`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("room id: ", roomId);
      setMessages(data); // set the fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchrooms();
  }, []);

  const fetchrooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/rooms", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && namespaceSocket) {
      namespaceSocket.emit("chat message", message); // Send message to backend
      setMessage("");
    }
  };
  const handlelogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("error logging out:", error);
    }
  };
  const handleRoomCreated = () => {
    Setisvisible(false);
    fetchrooms();
  };

  const togglevisable = () => {
    Setisvisible(!isvisible);
  };

  return (
    <div className="chat-container">
      <input value="log out" type="button" onClick={handlelogout} />

      <div className="sidebar">
        <h2>Chats</h2>
        <div className="Create-room">
          <button onClick={togglevisable}>
            {isvisible ? "Close Room Form" : "createRoom"}
          </button>
          {isvisible && (
            <div className="overlay">
              <div className="overlay-content">
                <button className="close-btn" onClick={togglevisable}>
                  X
                </button>
                <CreateRoom onRoomCreated={handleRoomCreated} />
              </div>
            </div>
          )}
        </div>

        <ul>
          {rooms.map((room) => (
            <li key={room._id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  setRoom(room.roomName);
                  //setMessages([]);
                  console.log( "room id: ", room._id)
                  fetchMessages(room._id);

          
                }}
                className=""
              >
                {room.roomName}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area coloumn-2">
        {selectedRoom ? (
          <>
            <h3>Room:{selectedRoom}</h3>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={msg._id} className="chat-message">
                  <p>{msg.sender}: </p>
                  <p>{msg.message}</p>
                  <p>
                      time: {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
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
