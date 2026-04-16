import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Design tokens
const tokens = {
  primary: "#38bdf8",
  primaryDark: "#0ea5e9",
  font: "'Poppins', sans-serif",
  radius: { input: "16px", card: "24px" },
  gradientLogin: "linear-gradient(122deg, #e0f2fe, #bae6fd, #a7f3d0)",
};

export default function LoginPage() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
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
        throw new Error(data.detail || "Login failed");
      }

      alert("Login successful");

      const userRole = data.user.role;

      if (userRole === "customer") {
        navigate("/customer-dashboard");
      } else if (userRole === "provider") {
        navigate("/provider-dashboard");
      }

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.font }}>
      
      {/* LEFT SIDE */}
      <div
        style={{
          flex: 1,
          background: tokens.gradientLogin,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 50px",
          gap: "32px",
        }}
      >
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#0c4a6e" }}>
          ⚡ UtilitY
        </div>

        <div>
          <div style={{ fontSize: "42px", fontWeight: 800, color: "#0c4a6e" }}>
            Welcome Back!
          </div>
          <p>Connect with trusted service professionals near you.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          width: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f9ff",
          padding: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: tokens.radius.card,
            padding: "40px",
            width: "100%",
            boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
          }}
        >
          <h2>Login</h2>

          {/* Role Toggle */}
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

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
              }}
            />

            <button type="submit" style={{ width: "100%", padding: "10px" }}>
              Login
            </button>
          </form>

          <p style={{ marginTop: "10px" }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/SignUp")}
              style={{
                background: "none",
                border: "none",
                color: "#38bdf8",
                cursor: "pointer",
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}