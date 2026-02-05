import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const API_BASE = "http://127.0.0.1:8000"; // FastAPI backend

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      console.log("Backend response:", res.data); // 👈 debug log
      setUsers(res.data); // update state
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAddUser = async () => {
    if (!name || !email) return alert("Please enter both name and email!");
    try {
      await axios.post(`${API_BASE}/add-user`, { name, email });
      setName("");
      setEmail("");
      fetchUsers(); // refresh the list
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>MongoDB Users</h1>

      {/* Input form */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: 10, padding: 5 }}
        />
        <button onClick={handleAddUser} style={{ padding: "5px 10px" }}>
          Add User
        </button>
      </div>

      {/* Display users */}
      <ul>
        {users.length === 0 ? (
          <li>No users found</li>
        ) : (
          users.map((user, i) => (
            <li key={i}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
