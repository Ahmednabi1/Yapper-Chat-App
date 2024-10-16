import React, { useState, useEffect } from "react";
import "./ChatRooms.css";
import "./bootstrap.min.css";
import io from "socket.io-client";
import CreateRoom from "../CreateRoom/CreateRoom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
      let newnamespaceSocket;
      if (!selectedRoom.protection) {
        // if no password
        newnamespaceSocket = io(
          `http://localhost:5000/chat/${selectedRoom.roomName}`,
          { auth: { token: localStorage.getItem("token") } }
        );
      } else {
        let pass = prompt("Enter Room Password");
        if (selectedRoom.password === pass) {
          newnamespaceSocket = io(
            `http://localhost:5000/chat/${selectedRoom.roomName}`,
            { auth: { token: localStorage.getItem("token") } }
          );
        } else {
          alert("Wrong password! Please try again.");
          setRoom("");
        }
      }

      newnamespaceSocket.on("RoomCreated", (newRoom) => {
        setRooms((prevRooms) => [...prevRooms, newRoom]);
      });

      // Listening for incoming messages
      if (newnamespaceSocket) {
        newnamespaceSocket.on("chat message", (data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: data.from,
              message: data.message,
            },
          ]);
        });
        setnamespaceSocket(newnamespaceSocket);
        return () => {
          newnamespaceSocket.disconnect();
          setMessages([]);
        };
      }
    }
  }, [selectedRoom]);

  // fetch old messages from db
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
        method: "GET",
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

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/deleteAccount",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/login";
        alert(data.message);
        localStorage.removeItem("token"); // remove token from localStorage
      } else {
        alert(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
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
      <div className="sidebar">
        <div className="top-part">
          <h2>Chats </h2>
          <div className="Create-room">
            <button className="create-btn" onClick={togglevisable}>
              {isvisible ? "X" : "+"}
            </button>
            {isvisible && (
              <div className="overlay">
                <div className="overlay-content">
                  <CreateRoom onRoomCreated={handleRoomCreated} />
                </div>
              </div>
            )}
          </div>
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
                className=""
              >
                {room.roomName}
              </a>
            </li>
          ))}
        </ul>

        <input
          className="del-btn"
          value="Delete Account"
          type="button"
          onClick={handleDeleteAccount}
        />
        <input
          className="logout-btn"
          value="Log Out"
          type="button"
          onClick={handlelogout}
        />
        <a href="/Profile" className="pro-btn">
          {" "}
          Profile
        </a>
      </div>
      <div className="chat-area coloumn-2">
        {selectedRoom ? (
          <>
            <h3 class="chatroom-title">{selectedRoom.roomName}</h3>
            <div className="chat-messages">
              {messages.map((msg, index) => {
                if (msg.sender && msg.message) {
                  // ensure msg not empty
                  // get current user for msg colors
                  const token = localStorage.getItem("token");
                  let currentUser;
                  if (token) {
                    const decodedToken = jwtDecode(token);
                    currentUser = decodedToken.Uname;
                  }
                  let messageClass;
                  if (msg.sender === currentUser) {
                    messageClass = "my-message";
                  } else if (msg.sender === "server") {
                    messageClass = "server-message";
                  } else {
                    messageClass = "other-message";
                  }

                  return (
                    <div
                      key={msg._id}
                      className={`chat-message ${messageClass}`}
                    >
                      <p>
                        {msg.sender} : {msg.message}
                      </p>
                    </div>
                  );
                }
                return null; // dont display empty message
              })}
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
            <label className="chatroom-prompt">
              Please select or create a chatroom to start yapping...{" "}
            </label>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatRooms;
