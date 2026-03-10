import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerDashboard from "./customerdashboard";

const tokens = {
  primary: "#38bdf8",
  primaryDark: "#0ea5e9",
  font: "'Poppins', sans-serif",
  radius: { input: "16px", card: "24px" },
  gradientLogin: "linear-gradient(122deg, #e0f2fe, #bae6fd, #a7f3d0)",
};

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: tokens.font },
  left: { flex: 1, background: tokens.gradientLogin, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 50px", gap: "32px" },
  logo: { fontSize: "28px", fontWeight: 700, color: "#0c4a6e" },
  hero: { fontSize: "42px", fontWeight: 800, color: "#0c4a6e", lineHeight: 1.2 },
  stat: { display: "flex", flexDirection: "column" },
  statNum: { fontSize: "24px", fontWeight: 700, color: "#0ea5e9" },
  statLabel: { fontSize: "13px", color: "#0c4a6e" },

  right: { width: "480px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f9ff", padding: "40px" },
  card: { backgroundColor: "#fff", borderRadius: tokens.radius.card, padding: "40px", width: "100%", boxShadow: "0 25px 50px rgba(0,0,0,0.12)" },
  title: { fontSize: "28px", fontWeight: 700, color: "#0c4a6e", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#64748b", marginBottom: "24px" },
  roleToggle: { display: "flex", backgroundColor: "#f1f5f9", borderRadius: "12px", padding: "4px", marginBottom: "24px" },
  roleBtn: (active) => ({
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    backgroundColor: active ? tokens.primary : "transparent",
    color: active ? "#fff" : "#64748b",
  }),
  inputGroup: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" },
  input: { width: "100%", height: "52px", borderRadius: tokens.radius.input, border: "1.5px solid #e2e8f0", padding: "0 16px", fontSize: "14px", fontFamily: tokens.font, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  submitBtn: { width: "100%", height: "52px", borderRadius: tokens.radius.input, border: "none", background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryDark})`, color: "#fff", fontSize: "16px", fontWeight: 700, fontFamily: tokens.font, cursor: "pointer", marginBottom: "20px", transition: "opacity 0.2s" },
  switchText: { textAlign: "center", fontSize: "14px", color: "#64748b" },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "provider") {
      navigate("/provider-dashboard");
    } else if (role === "customer") {
      setLoggedIn(true);
    }
  };

  if (loggedIn && role === "customer") {
    return <CustomerDashboard />;
  }

  return (
    <div style={styles.page}>
      {/* Left Section */}
      <div style={styles.left}>
        <div style={styles.logo}>⚡ UtilitY</div>
        <div>
          <div style={styles.hero}>Welcome Back!</div>
          <p style={{ color: "#0c4a6e", marginTop: "12px" }}>
            Connect with trusted service professionals near you.
          </p>
        </div>

        <div style={{ display: "flex", gap: "32px" }}>
          {[
            ["10K+", "Professionals"],
            ["50K+", "Jobs Done"],
            ["4.8★", "Rating"],
          ].map(([n, l]) => (
            <div key={l} style={styles.stat}>
              <span style={styles.statNum}>{n}</span>
              <span style={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.title}>Login</div>
          <div style={styles.subtitle}>Sign in to your account</div>

          {/* Role Toggle */}
          <div style={styles.roleToggle}>
            <button style={styles.roleBtn(role === "customer")} onClick={() => setRole("customer")}>
              👤 Customer
            </button>
            <button style={styles.roleBtn(role === "provider")} onClick={() => setRole("provider")}>
              🔧 Provider
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={styles.submitBtn}>
              Login to Account
            </button>
          </form>

          <div style={styles.switchText}>Don't have an account? Sign Up</div>
        </div>
      </div>
    </div>
  );
}