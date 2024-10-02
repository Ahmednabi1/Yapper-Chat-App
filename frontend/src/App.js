import React from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import ChatRooms from "./components/ChatRooms/ChatRooms";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/chat" element={<ChatRooms />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
