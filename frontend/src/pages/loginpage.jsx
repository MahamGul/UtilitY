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

export default function LoginPage({ onNavigateToSignup }) {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Navigate to dashboard based on role
    if (role === "customer") {
      navigate("/customer-dashboard"); // Correct: router handles layout + outlet
    } else if (role === "provider") {
      navigate("/provider-dashboard");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.font }}>
      {/* LEFT HERO SIDE */}
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
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#0c4a6e" }}>⚡ UtilitY</div>
        <div>
          <div style={{ fontSize: "42px", fontWeight: 800, color: "#0c4a6e", lineHeight: 1.2 }}>
            Welcome Back!
          </div>
          <p>Connect with trusted service professionals near you.</p>
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
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
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0c4a6e" }}>Login</div>
          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
            Sign in to your account to continue
          </div>

          {/* Role Toggle */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#f1f5f9",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "24px",
            }}
          >
            {["customer", "provider"].map((r) => (
              <button
                key={r}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: role === r ? tokens.primary : "transparent",
                  color: role === r ? "#fff" : "#64748b",
                }}
                onClick={() => setRole(r)}
              >
                {r === "customer" ? "👤 Customer" : "🔧 Provider"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}
              >
                Email
              </label>
              <input
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: tokens.radius.input,
                  border: "1.5px solid #e2e8f0",
                  padding: "0 16px",
                }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}
              >
                Password
              </label>
              <input
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: tokens.radius.input,
                  border: "1.5px solid #e2e8f0",
                  padding: "0 16px",
                }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                height: "52px",
                borderRadius: tokens.radius.input,
                border: "none",
                background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryDark})`,
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: "20px",
              }}
            >
              Login to Account
            </button>
          </form>

          <div>
            Don't have an account?{" "}
            <button onClick={onNavigateToSignup}>Sign Up Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}