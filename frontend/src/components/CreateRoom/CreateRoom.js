import React, { useState } from "react"; 


function CreateRoom({ onRoomCreated }) {
  const [Room, setRoom] = useState("");
  const [protection, setProtection] = useState(false);
  const [password, setPassword] = useState("");

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const RoomData = { roomName: Room, protection, password };
    console.log(RoomData);
    const response = await fetch("http://localhost:5000/api/rooms/createroom", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(RoomData),
    }).then(response => {
      if (response.ok) {
        console.log("Room Created");
        onRoomCreated(); 
      }
      else{
        console.log("error in chatroon front end")
      }
    }); 
  };

  return (
    <>
      <div className="container">
        <form className="Create-room">
          <h2>Create a new Room</h2>
          <input
            type="text"
            placeholder="RoomName....."
            required
            value={Room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <label style={{"fontSize": "14px"}} >Create a private room?</label>
          <input
            type="checkbox"
            id="protection"
            checked={protection}
            onChange={(e) => {
              setProtection(e.target.checked);
            }}
          />
          {protection && (
            <input
              style={{"margin": "20px 0"}}
              type="password"
              placeholder="room password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          )}
          <button onClick={handleCreateRoom}>Create</button>
        </form>
      </div>
    </>
  );
}
export default CreateRoom;
