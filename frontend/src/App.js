import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const API_BASE = "http://127.0.0.1:8000"; // Your FastAPI backend URL

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAddUser = async () => {
    if (!name || !email) return alert("Enter name and email!");
    try {
      await axios.post(`${API_BASE}/add-user`, { name, email });
      setName("");
      setEmail("");
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Users</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddUser}>Add User</button>

      <ul>
        {users.map((user, i) => (
          <li key={i}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
