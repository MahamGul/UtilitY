import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    display: flex;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
  }

  .left-panel {
    flex: 1;
    background: linear-gradient(145deg, #e0f5ff 0%, #b8e8fa 40%, #a8f0d8 100%);
    padding: 40px 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .left-panel::after {
    content: '';
    position: absolute;
    bottom: -60px;
    right: -60px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    border: 40px solid rgba(255,255,255,0.25);
    pointer-events: none;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 999px;
    border: none;
    background: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    width: fit-content;
    position: relative;
    z-index: 1;
    transition: box-shadow 0.2s;
  }
  .back-btn:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.13); }

  .brand-row {
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 1;
  }
  .brand-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #38bdf8, #0ea5e9);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 6px 18px rgba(14,165,233,0.35);
  }
  .brand-text { line-height: 1.2; }
  .brand-name { font-size: 22px; font-weight: 800; color: #0f172a; }
  .brand-sub  { font-size: 12px; color: #64748b; font-weight: 500; }

  .welcome-heading {
    font-size: 46px;
    font-weight: 800;
    line-height: 1.15;
    color: #0369a1;
    position: relative;
    z-index: 1;
  }
  .welcome-sub {
    font-size: 14px;
    color: #475569;
    margin-top: 12px;
    max-width: 380px;
    line-height: 1.7;
    position: relative;
    z-index: 1;
  }

  .stats-row {
    display: flex;
    gap: 14px;
    position: relative;
    z-index: 1;
  }
  .stat-card {
    background: #fff;
    border-radius: 16px;
    padding: 16px 22px;
    flex: 1;
    box-shadow: 0 4px 14px rgba(0,0,0,0.06);
  }
  .stat-number { font-size: 22px; font-weight: 800; }
  .stat-number.blue   { color: #0ea5e9; }
  .stat-number.green  { color: #10b981; }
  .stat-number.orange { color: #f59e0b; }
  .stat-label { font-size: 12px; color: #64748b; margin-top: 2px; }

  .badge-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }
  .badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border-radius: 999px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .badge-dot { width: 8px; height: 8px; border-radius: 50%; }
  .badge-dot.green  { background: #22c55e; }
  .badge-dot.blue   { background: #38bdf8; }
  .badge-dot.purple { background: #8b5cf6; }

  .feature-cards {
    display: flex;
    gap: 14px;
    position: relative;
    z-index: 1;
  }
  .feature-card {
    flex: 1;
    border-radius: 18px;
    padding: 20px 18px;
    color: #fff;
  }
  .feature-card.blue   { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
  .feature-card.green  { background: linear-gradient(135deg, #10b981, #059669); }
  .feature-card.yellow { background: linear-gradient(135deg, #f59e0b, #d97706); }

  .feature-icon {
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .feature-title { font-size: 14px; font-weight: 700; }
  .feature-desc  { font-size: 11px; opacity: 0.85; margin-top: 4px; line-height: 1.5; }

  .right-panel {
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    padding: 30px;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 24px;
    padding: 36px 32px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.09);
  }

  .lock-icon {
    width: 62px; height: 62px;
    margin: 0 auto 14px;
    border-radius: 16px;
    background: linear-gradient(135deg, #38bdf8, #0ea5e9);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    box-shadow: 0 8px 22px rgba(14,165,233,0.35);
  }

  .login-title { text-align: center; font-size: 26px; font-weight: 800; color: #0f172a; }
  .login-sub   { text-align: center; font-size: 13px; color: #94a3b8; margin-top: 6px; margin-bottom: 22px; }

  .role-toggle {
    display: flex;
    background: #dbeafe;
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 22px;
    gap: 4px;
  }
  .role-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 8px;
    border: none;
    border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #475569;
    background: transparent;
  }
  .role-btn.active {
    background: #fff;
    color: #0ea5e9;
    box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  }
  .role-icon { font-size: 16px; }

  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 7px;
    display: block;
  }
  .input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 0 14px;
    background: #f8fafc;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .input-wrap:focus-within { border-color: #38bdf8; background: #fff; }
  .input-icon { color: #94a3b8; font-size: 16px; margin-right: 10px; flex-shrink: 0; }
  .input-wrap input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 13px 0;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #1e293b;
    outline: none;
  }
  .input-wrap input::placeholder { color: #b0bec5; }
  .eye-btn {
    background: none; border: none; cursor: pointer;
    color: #94a3b8; font-size: 16px; padding: 0; margin-left: 6px;
  }

  .extras-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 13px;
  }
  .remember-label {
    display: flex; align-items: center; gap: 7px;
    color: #475569; font-weight: 500; cursor: pointer;
  }
  .remember-label input[type="checkbox"] {
    width: 15px; height: 15px; accent-color: #0ea5e9; cursor: pointer;
  }
  .forgot-link { color: #0ea5e9; font-weight: 600; cursor: pointer; }
  .forgot-link:hover { text-decoration: underline; }

  .login-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(90deg, #38bdf8, #0ea5e9);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(14,165,233,0.4);
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.2px;
  }
  .login-btn:hover { opacity: 0.92; transform: translateY(-1px); }
  .login-btn:active { transform: translateY(0); }

  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 18px 0; color: #94a3b8; font-size: 12px; font-weight: 500;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: #e2e8f0;
  }

  .google-btn {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .google-btn:hover { border-color: #38bdf8; box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
  .g-logo { font-size: 17px; }

  .signup-row {
    text-align: center;
    margin-top: 18px;
    font-size: 13px;
    color: #64748b;
  }
  .signup-link { color: #38bdf8; font-weight: 700; cursor: pointer; }
  .signup-link:hover { text-decoration: underline; }
`;

export default function LoginPage() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      // ✅ FIXED: Save user to localStorage so dashboard can read the name
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("email", email);

      alert("Login successful");

      // Redirect based on role
      if (data.user.role === "customer") {
        navigate("/customer-dashboard");
      } else {
        navigate("/provider-dashboard");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="login-root">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>

          <div>
            <div className="brand-row" style={{ marginBottom: 28 }}>
              <div className="brand-icon">🔧</div>
              <div className="brand-text">
                <div className="brand-name">UtilitY</div>
                <div className="brand-sub">Trusted Service Platform</div>
              </div>
            </div>

            <h1 className="welcome-heading">Welcome Back!</h1>
            <p className="welcome-sub">
              Login to access your dashboard and continue connecting with
              verified professionals across the country.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-number blue">10K+</div>
              <div className="stat-label">Professionals</div>
            </div>
            <div className="stat-card">
              <div className="stat-number green">50K+</div>
              <div className="stat-label">Jobs Done</div>
            </div>
            <div className="stat-card">
              <div className="stat-number orange">4.8★</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>

          <div className="badge-row">
            <div className="badge">
              <span className="badge-dot green" />✓ Verified Platform
            </div>
            <div className="badge">
              <span className="badge-dot blue" />
              🔒 Secure Login
            </div>
            <div className="badge">
              <span className="badge-dot purple" />
              👥 50K+ Users
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="login-card">
            <div className="lock-icon">🔒</div>
            <h2 className="login-title">Login</h2>
            <p className="login-sub">Enter your credentials to continue</p>

            {/* Role Toggle */}
            <div className="role-toggle">
              <button
                className={`role-btn ${role === "customer" ? "active" : ""}`}
                onClick={() => setRole("customer")}
                type="button"
              >
                👤 I Need a Service
              </button>

              <button
                className={`role-btn ${role === "provider" ? "active" : ""}`}
                onClick={() => setRole("provider")}
                type="button"
              >
                🏗️ I Provide Services
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="field-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <label className="field-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="extras-row">
                <label className="remember-label">
                  <input type="checkbox" /> Remember me
                </label>
                <span className="forgot-link">Forgot Password?</span>
              </div>

              <button type="submit" className="login-btn">
                Login to Account
              </button>
            </form>

            <p className="signup-row">
              Don't have an account?{" "}
              <span className="signup-link" onClick={() => navigate("/SignUp")}>
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
