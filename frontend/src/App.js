import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // State variables
  const [users, setUsers] = useState([]); // list of users from DB
  const [name, setName] = useState("");   // new user name
  const [email, setEmail] = useState(""); // new user email

  // Backend URL
  const API_BASE = "http://127.0.0.1:8000";

  // Fetch users from backend when component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data); // set users state
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Function to add a new user
  const handleAddUser = async () => {
    if (!name || !email) return alert("Please enter both name and email!");

    try {
      await axios.post(`${API_BASE}/add-user`, { name, email });
      setName("");   // clear input fields
      setEmail("");
      fetchUsers();  // refresh user list
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MongoDB Users</h1>

      {/* Input form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleAddUser} style={{ padding: "5px 10px" }}>
          Add User
        </button>
      </div>

      {/* User list */}
      <ul>
        {users.length === 0 ? (
          <li>No users found</li>
        ) : (
          users.map((user, index) => (
            <li key={index}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
