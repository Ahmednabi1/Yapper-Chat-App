import React from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import ChatRooms from "./components/ChatRooms/ChatRooms";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProfileForm from "./components/Profile/porfile";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* redirect root to /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/chat" element={<ChatRooms />} />
          <Route path="/profile" element={<ProfileForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
