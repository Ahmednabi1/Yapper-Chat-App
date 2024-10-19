import React, { useEffect, useState } from 'react';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} onClick={() => onSelectUser(user)}>
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
