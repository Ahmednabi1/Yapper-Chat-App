import React, { useState, useEffect } from "react";
import "./ChatRooms.css";
import "./bootstrap.min.css";
import io from "socket.io-client";
import CreateRoom from "../CreateRoom/CreateRoom";
import UserList from "../UserList/UserList";
import DirectMessage from "../DirectMessage/DirectMessage"; 
import { useNavigate } from "react-router-dom";

function ChatRooms() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setRoom] = useState("");
  const [namespaceSocket, setNamespaceSocket] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 

  const navigate = useNavigate();

  // Join the selected room and listen for chat messages
  const roomJoin = () => {
    const newNamespaceSocket = io(
      `http://localhost:5000/chat/${selectedRoom.roomName}`,
      { auth: { token: localStorage.getItem("token") } }
    );

    newNamespaceSocket.on("chat message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: data.from,
          message: data.message,
        },
      ]);
    });

    setNamespaceSocket(newNamespaceSocket);
  };

  // Check for selected room and password protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (selectedRoom) {
      if (!selectedRoom.protection) {
        roomJoin();
      } else {
        let pass = prompt("Enter Room Password");
        if (selectedRoom.password === pass) {
          roomJoin();
        } else {
          alert("Wrong password! Try joining again");
          navigate("/chat");
        }
      }
    }
  }, [selectedRoom]);

  // Fetch old messages from DB
  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rooms/${roomId}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
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

  // Handle sending messages
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && namespaceSocket) {
      namespaceSocket.emit("chat message", message);
      setMessage("");
    }
  };

  // Handle logout
  const handleLogout = async () => {
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
      console.error("Error logging out:", error);
    }
  };

  // Handle room creation
  const handleRoomCreated = () => {
    setIsVisible(false);
    fetchRooms();
  };

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="chat-container">
      <input value="log out" type="button" onClick={handleLogout} />
      <a href="/Profile" className="pro-btn">
        Profile
      </a>

      <div className="sidebar">
        <h2>Chats</h2>
        <div className="Create-room">
          <button onClick={toggleVisible}>
            {isVisible ? "Close Room Form" : "Create Room"}
          </button>
          {isVisible && (
            <div className="overlay">
              <div className="overlay-content">
                <button className="close-btn" onClick={toggleVisible}>
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
                  e.preventDefault();
                  setRoom(room);
                  fetchMessages(room._id);
                }}
              >
                {room.roomName}
              </a>
            </li>
          ))}
        </ul>
        <UserList onSelectUser={(user) => setSelectedUser(user)} />{" "}
      </div>

      <div className="chat-area column-2">
        {selectedUser ? (
          <DirectMessage
            selectedUser={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        ) : selectedRoom ? (
          <>
            <h3>Room: {selectedRoom.roomName}</h3>
            <div className="chat-messages">
              {messages.map((msg, index) => {
                if (msg.sender && msg.message) {
                  return (
                    <div key={index} className="chat-message">
                      <p>
                        {msg.sender} : {msg.message}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <form className="message-form column" onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <h2>Select a room to chat or a user to DM</h2>
        )}
      </div>
    </div>
  );
}

export default ChatRooms;
