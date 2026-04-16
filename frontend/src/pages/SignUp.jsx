import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      alert("Account created successfully!");

      // After signup → go to login
      navigate("/login");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* LEFT SIDE */}
      <div style={{ flex: 1, background: "#e0f2fe", padding: "60px" }}>
        <h1>⚡ UtilitY</h1>
        <h2>Create your account</h2>
        <p>Join as a customer or service provider</p>
      </div>

      {/* RIGHT SIDE FORM */}
      <div style={{ width: "400px", padding: "40px", background: "#fff" }}>
        <h2>Sign Up</h2>

        {/* Role Selection */}
        <div style={{ display: "flex", marginBottom: "20px" }}>
          {["customer", "provider"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "10px",
                background: role === r ? "#38bdf8" : "#eee",
                color: role === r ? "#fff" : "#000",
                border: "none",
                cursor: "pointer",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
          />

          <button type="submit" style={{ width: "100%", padding: "10px" }}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}