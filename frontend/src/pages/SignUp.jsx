import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .signup-root {
    display: flex;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
  }

  /* ── LEFT PANEL ── */
  .su-left {
    flex: 1;
    background: linear-gradient(160deg, #7dd3fc 0%, #38bdf8 35%, #86efac 100%);
    padding: 60px 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    position: relative;
    overflow: hidden;
  }

  .su-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .su-brand-icon {
    width: 80px; height: 80px;
    background: rgba(255,255,255,0.85);
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.12);
    position: relative; z-index: 1;
  }

  .su-headline {
    font-size: 42px;
    font-weight: 800;
    color: #0f172a;
    text-align: center;
    line-height: 1.2;
    position: relative; z-index: 1;
  }

  .su-subtext {
    font-size: 15px;
    color: #1e3a5f;
    text-align: center;
    max-width: 320px;
    line-height: 1.7;
    position: relative; z-index: 1;
  }

  .su-features {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: 360px;
    position: relative; z-index: 1;
  }

  .su-feature-item {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255,255,255,0.75);
    border-radius: 16px;
    padding: 16px 20px;
    backdrop-filter: blur(6px);
  }

  .su-feature-icon {
    width: 44px; height: 44px; flex-shrink: 0;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .su-fi-yellow { background: #fef9c3; }
  .su-fi-orange { background: #ffedd5; }
  .su-fi-red    { background: #fee2e2; }

  .su-feature-text strong {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
  }
  .su-feature-text span {
    font-size: 12px;
    color: #475569;
  }

  /* ── RIGHT PANEL ── */
  .su-right {
    width: 520px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #f1f5f9;
    padding: 30px 28px;
    overflow-y: auto;
  }

  .su-card {
    width: 100%;
    max-width: 440px;
    background: #fff;
    border-radius: 24px;
    padding: 36px 32px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.09);
    margin: auto 0;
  }

  .su-card-title {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    text-align: center;
  }
  .su-card-sub {
    font-size: 13px;
    color: #94a3b8;
    text-align: center;
    margin-top: 6px;
    margin-bottom: 22px;
  }

  /* role toggle */
  .su-role-toggle {
    display: flex;
    background: #dbeafe;
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 22px;
    gap: 4px;
  }
  .su-role-btn {
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
  .su-role-btn.active {
    background: #fff;
    color: #0ea5e9;
    box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  }

  /* field */
  .su-field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 7px;
    display: block;
  }
  .su-input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 0 14px;
    background: #f8fafc;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .su-input-wrap:focus-within { border-color: #38bdf8; background: #fff; }
  .su-input-icon { color: #94a3b8; font-size: 16px; margin-right: 10px; flex-shrink: 0; }
  .su-input-wrap input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 13px 0;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #1e293b;
    outline: none;
  }
  .su-input-wrap input::placeholder { color: #b0bec5; }
  .su-eye-btn {
    background: none; border: none; cursor: pointer;
    color: #94a3b8; font-size: 16px; padding: 0; margin-left: 6px;
  }

  .su-submit-btn {
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
    margin-top: 4px;
  }
  .su-submit-btn:hover { opacity: 0.92; transform: translateY(-1px); }
  .su-submit-btn:active { transform: translateY(0); }

  .su-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 18px 0; color: #94a3b8; font-size: 12px; font-weight: 500;
  }
  .su-divider::before, .su-divider::after {
    content: ''; flex: 1; height: 1px; background: #e2e8f0;
  }

  .su-google-btn {
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
  .su-google-btn:hover { border-color: #38bdf8; box-shadow: 0 2px 10px rgba(0,0,0,0.07); }

  .su-login-row {
    text-align: center;
    margin-top: 18px;
    font-size: 13px;
    color: #64748b;
  }
  .su-login-link { color: #38bdf8; font-weight: 700; cursor: pointer; }
  .su-login-link:hover { text-decoration: underline; }
`;

export default function SignupPage() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // extra display fields (not sent to backend — kept for UI only)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  if (!email || !password || !fullName || !phone || !location) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/add-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role,
        fullName,
        phone,
        location,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Signup failed");

    alert("Account created successfully!");
    navigate("/login");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <>
      <style>{styles}</style>
      <div className="signup-root">

        {/* ── LEFT PANEL ── */}
        <div className="su-left">
          <div className="su-brand-icon">🔧</div>

          <h1 className="su-headline">Join UtilitY Today!</h1>
          <p className="su-subtext">
            Create your account and start connecting with trusted professionals.
          </p>

          <div className="su-features">
            <div className="su-feature-item">
              <div className="su-feature-icon su-fi-yellow">⚡</div>
              <div className="su-feature-text">
                <strong>Quick Registration</strong>
                <span>Get started in minutes</span>
              </div>
            </div>
            <div className="su-feature-item">
              <div className="su-feature-icon su-fi-orange">🔒</div>
              <div className="su-feature-text">
                <strong>Secure Platform</strong>
                <span>Your data is protected</span>
              </div>
            </div>
            <div className="su-feature-item">
              <div className="su-feature-icon su-fi-red">🎯</div>
              <div className="su-feature-text">
                <strong>Find Experts Fast</strong>
                <span>Connect with verified professionals</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="su-right">
          <div className="su-card">
            <h2 className="su-card-title">Create Your Account</h2>
            <p className="su-card-sub">Join thousands of satisfied users</p>

            {/* Role Toggle */}
            <div className="su-role-toggle">
              <button
                className={`su-role-btn ${role === "customer" ? "active" : ""}`}
                onClick={() => setRole("customer")}
              >
                👤 I Need a Service
              </button>
              <button
                className={`su-role-btn ${role === "provider" ? "active" : ""}`}
                onClick={() => setRole("provider")}
              >
                🏗️ I Provide Services
              </button>
            </div>

            <form onSubmit={handleSignup}>

              {/* Full Name (UI only) */}
              <label className="su-field-label">Full Name *</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">👤</span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email */}
              <label className="su-field-label">Email Address *</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>

              {/* Phone (UI only) */}
              <label className="su-field-label">Phone Number *</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">📞</span>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Location (UI only) */}
              <label className="su-field-label">Location *</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">📍</span>
                <input
                  type="text"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Password */}
              <label className="su-field-label">Password *</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="su-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Confirm Password (UI only) */}
              <label className="su-field-label">Confirm Password *</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">🔒</span>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="su-eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>

              <button type="submit" className="su-submit-btn">
                Create Account
              </button>
            </form>

            <div className="su-divider">OR CONTINUE WITH</div>

            <button className="su-google-btn">
              <span style={{ fontWeight: 700, fontSize: 16 }}>G</span>
              Continue with Google
            </button>

            <p className="su-login-row">
              Already have an account?{" "}
              <span className="su-login-link" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}