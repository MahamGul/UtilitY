import { useState } from "react";

// Design tokens 

const tokens = {
  primary: "#38bdf8",
  primaryDark: "#0ea5e9",
  font: "'Poppins', sans-serif",
  radius: { input: "16px", card: "24px" },
  gradientLogin: "linear-gradient(122deg, #e0f2fe, #bae6fd, #a7f3d0)",
};

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: tokens.font,
  },
  left: {
    flex: 1,
    background: tokens.gradientLogin,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px 50px",
    gap: "32px",
  },
  logo: { fontSize: "28px", fontWeight: 700, color: "#0c4a6e" },
  hero: { fontSize: "42px", fontWeight: 800, color: "#0c4a6e", lineHeight: 1.2 },
  stat: { display: "flex", flexDirection: "column" },
  statNum: { fontSize: "24px", fontWeight: 700, color: "#0ea5e9" },
  statLabel: { fontSize: "13px", color: "#0c4a6e" },
  right: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f9ff",
    padding: "40px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: tokens.radius.card,
    padding: "40px",
    width: "100%",
    boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
  },
  title: { fontSize: "28px", fontWeight: 700, color: "#0c4a6e", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#64748b", marginBottom: "24px" },
  roleToggle: {
    display: "flex",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px",
    padding: "4px",
    marginBottom: "24px",
  },
  roleBtn: (active) => ({
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: tokens.font,
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: active ? tokens.primary : "transparent",
    color: active ? "#fff" : "#64748b",
  }),
  inputGroup: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" },
  input: {
    width: "100%",
    height: "52px",
    borderRadius: tokens.radius.input,
    border: "1.5px solid #e2e8f0",
    padding: "0 16px",
    fontSize: "14px",
    fontFamily: tokens.font,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  checkLabel: { fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" },
  forgot: { fontSize: "13px", color: tokens.primary, cursor: "pointer", fontWeight: 600, background: "none", border: "none", fontFamily: tokens.font },
  submitBtn: {
    width: "100%",
    height: "52px",
    borderRadius: tokens.radius.input,
    border: "none",
    background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryDark})`,
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: tokens.font,
    cursor: "pointer",
    marginBottom: "20px",
    transition: "opacity 0.2s",
  },
  divider: { textAlign: "center", color: "#94a3b8", fontSize: "13px", marginBottom: "16px", position: "relative" },
  googleBtn: {
    width: "100%",
    height: "48px",
    borderRadius: tokens.radius.input,
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: tokens.font,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  switchText: { textAlign: "center", fontSize: "14px", color: "#64748b" },
  switchLink: { color: tokens.primary, fontWeight: 700, cursor: "pointer", background: "none", border: "none", fontFamily: tokens.font },
};

export default function Login({ onNavigateToSignup }) {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`No backend yet`);
  };

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.left}>
        <div style={styles.logo}>⚡ UtilitY</div>
        <div>
          <div style={styles.hero}>Welcome Back!</div>
          <p style={{ color: "#0c4a6e", marginTop: "12px", fontSize: "15px" }}>
            Connect with trusted service professionals near you.
          </p>
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          {[["10K+", "Professionals"], ["50K+", "Jobs Done"], ["4.8★", "Rating"]].map(([n, l]) => (
            <div key={l} style={styles.stat}>
              <span style={styles.statNum}>{n}</span>
              <span style={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", fontSize: "32px", marginBottom: "12px" }}>🔒</div>
          <div style={styles.title}>Login</div>
          <div style={styles.subtitle}>Sign in to your account to continue</div>

          {/* Role Toggle */}
          <div style={styles.roleToggle}>
            {["customer", "provider"].map((r) => (
              <button key={r} style={styles.roleBtn(role === r)} onClick={() => setRole(r)}>
                {r === "customer" ? "👤 Customer" : "🔧 Provider"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
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

            <div style={styles.row}>
              <label style={styles.checkLabel}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" style={styles.forgot}>Forgot Password?</button>
            </div>

            <button type="submit" style={styles.submitBtn}>Login to Account</button>
          </form>

          <div style={styles.divider}>── OR ──</div>
          <button style={styles.googleBtn}>
            <span>G</span> Continue with Google
          </button>

          <div style={styles.switchText}>
            Don't have an account?{" "}
            <button style={styles.switchLink} onClick={onNavigateToSignup}>
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
