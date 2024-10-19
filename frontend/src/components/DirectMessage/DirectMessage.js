import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const DirectMessage = ({ selectedUser, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000/direct', {
      auth: { token: localStorage.getItem('token') },
    });
    

    newSocket.on('direct message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    setSocket(newSocket);
    
    return () => newSocket.disconnect();
  }, [selectedUser]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log(`Sending message to ${selectedUser._id}: ${message}`);
      socket.emit('direct message', { to: selectedUser._id, message });
      setMessage('');
    }
  };

  return (
    <div>
      <button onClick={onBack}>Back to Users</button>
      <h3>Chat with {selectedUser.email}</h3>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default DirectMessage;
