// src/pages/provider_profile.jsx

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  History,
  User,
  LogOut,
  Wrench,
  Mail,
  Phone,
  MapPin,
  Edit,
  Camera,
  Star,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  TrendingUp,
  Briefcase,
  X,
  Save,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import api from "../services/api";

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(storedUser);
      const res = await api.get(`/provider/profile/${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 min-h-screen bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">UtilitY</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            to="/provider-dashboard"
            icon={<LayoutDashboard />}
            label="Home"
          />
          <NavItem
            to="/provider-messages"
            icon={<MessageSquare />}
            label="Messages"
            badge="5"
          />
          <NavItem to="/bids-history" icon={<History />} label="Bids History" />
          <NavItem
            to="/my-bids"
            icon={<ClipboardList />}
            label="Available Bids"
          />
          <NavItem
            to="/provider-profile"
            icon={<User />}
            label="Profile"
            active
          />
        </nav>
        <div className="p-4 border-t">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" /> Logout
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <header className="bg-white border-b px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/provider-dashboard">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-gray-500">Manage your professional account</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {profile?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
          )}
          {error && <p className="text-center text-red-500 py-20">{error}</p>}
          {!loading && profile && (
            <>
              <ProfileHeader
                profile={profile}
                onProfileUpdated={fetchProfile}
              />
              <PersonalInfo profile={profile} />
              <ProfessionalInfo profile={profile} />
              <PerformanceStats profile={profile} />
              <Reviews profile={profile} />
              <AccountSettings
                profile={profile}
                onSettingsUpdated={fetchProfile}
              />
              <DangerZone navigate={navigate} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─── NAV ITEM ──────────────────────────────────────────────── */
function NavItem({ to, icon, label, badge, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active ? "bg-sky-100 text-black" : "text-gray-600 hover:bg-gray-100"}`}
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
      {badge && (
        <span className="ml-auto bg-sky-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ─── PROFILE HEADER ────────────────────────────────────────── */
function ProfileHeader({ profile, onProfileUpdated }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const initials = profile.fullName?.[0]?.toUpperCase() || "?";

  return (
    <>
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-sky-300 p-8 flex items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center text-sky-500 text-5xl font-bold shadow">
              {initials}
            </div>
            <button
              className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow cursor-not-allowed opacity-50"
              title="Photo upload coming soon"
            >
              <Camera className="w-4 h-4 text-sky-500" />
            </button>
          </div>
          <div className="text-white flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold">{profile.fullName || "—"}</h2>
              {profile.isVerified && (
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="opacity-90 mb-4">
              {profile.serviceType || "Service Provider"} •{" "}
              {profile.experience || 0} years experience
            </p>
            <div className="flex gap-4 flex-wrap">
              <StatCard
                title="Member Since"
                value={profile.memberSince || "—"}
              />
              <StatCard
                title="Rating"
                value={
                  <span className="flex items-center gap-1">
                    {profile.rating || "N/A"}{" "}
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  </span>
                }
              />
              <StatCard
                title="Jobs Completed"
                value={profile.jobsCompleted ?? 0}
              />
            </div>
          </div>
        </div>
        <div className="p-6 flex justify-end gap-4 bg-white">
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6"
            onClick={() => setShowEditModal(true)}
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false);
            onProfileUpdated();
          }}
        />
      )}
      {showPasswordModal && (
        <ChangePasswordModal
          profile={profile}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
      <p className="text-sm opacity-90">{title}</p>
      <div className="font-bold">{value}</div>
    </div>
  );
}

/* ─── EDIT PROFILE MODAL ────────────────────────────────────── */
function EditProfileModal({ profile, onClose, onSaved }) {
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    serviceArea: profile.serviceArea || "",
    address: profile.address || "",
    serviceType: profile.serviceType || "",
    experience: profile.experience || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        experience: Number(form.experience),
      };
      const res = await api.get(`/provider/profile/update/${profile.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <div className="space-y-4">
        <Field
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
        <Field
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Field
          label="Service Area"
          name="serviceArea"
          value={form.serviceArea}
          onChange={handleChange}
        />
        <Field
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        <Field
          label="Skill / Service Type"
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
        />
        <Field
          label="Experience (years)"
          name="experience"
          type="number"
          value={form.experience}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── CHANGE PASSWORD MODAL ─────────────────────────────────── */
function ChangePasswordModal({ profile, onClose }) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setError(null);
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.get(`/provider/change-password/${profile.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to change password");
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Change Password" onClose={onClose}>
      {success ? (
        <p className="text-green-600 font-semibold text-center py-4">
          ✓ Password updated successfully!
        </p>
      ) : (
        <div className="space-y-4">
          <PasswordField
            label="Current Password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            show={showOld}
            onToggle={() => setShowOld(!showOld)}
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
          />
          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Update Password
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ─── PERSONAL INFO ─────────────────────────────────────────── */
function PersonalInfo({ profile }) {
  return (
    <Section title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<User />}
          label="Full Name"
          value={profile.fullName || "—"}
        />
        <InfoCard
          icon={<Mail />}
          label="email Address"
          value={profile.email || "—"}
        />
        <InfoCard
          icon={<Phone />}
          label="Phone Number"
          value={profile.phone || "—"}
        />
        <InfoCard
          icon={<MapPin />}
          label="Service Area"
          value={profile.serviceArea || "—"}
        />
      </div>
      <div className="mt-6">
        <label className="text-sm text-gray-500">Address</label>
        <div className="p-4 bg-sky-100 rounded-xl">
          {profile.address || "No address provided"}
        </div>
      </div>
    </Section>
  );
}

/* ─── PROFESSIONAL INFO ─────────────────────────────────────── */
function ProfessionalInfo({ profile }) {
  return (
    <Section title="Professional Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<Briefcase />}
          label="Service Type / Skill"
          value={profile.serviceType || "—"}
        />
        <InfoCard
          icon={<Briefcase />}
          label="Experience"
          value={profile.experience ? `${profile.experience} Years` : "—"}
        />
      </div>
    </Section>
  );
}

/* ─── PERFORMANCE STATS ─────────────────────────────────────── */
function PerformanceStats({ profile }) {
  const stats = [
    {
      title: "Jobs Completed",
      value: profile.jobsCompleted ?? 0,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bg: "bg-sky-100",
    },
    {
      title: "Average Rating",
      value: profile.rating ?? "N/A",
      icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />,
      bg: "bg-sky-100",
    },
    {
      title: "Total Earned",
      value: `Rs. ${(profile.totalEarned ?? 0).toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5 text-purple-600" />,
      bg: "bg-sky-100",
    },
    {
      title: "Success Rate",
      value: `${profile.successRate ?? 0}%`,
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      bg: "bg-sky-100",
    },
  ];
  return (
    <Section title="Performance Statistics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={`p-6 ${stat.bg} rounded-xl`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── REVIEWS ───────────────────────────────────────────────── */
function Reviews({ profile }) {
  const reviews = profile.reviews || [];
  return (
    <Section title="Recent Reviews">
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, i) => (
            <div key={i} className="p-4 bg-sky-100 rounded-xl">
              <p className="font-semibold">{review.name || "Anonymous"}</p>
              <div className="flex mb-2">
                {Array.from({ length: review.rating || 0 }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm">"{review.comment}"</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No reviews yet.</p>
        )}
      </div>
    </Section>
  );
}

/* ─── ACCOUNT SETTINGS ──────────────────────────────────────── */
function AccountSettings({ profile }) {
  const initial = profile.settings || {
    emailNotifications: true,
    smsNotifications: true,
    showProfile: true,
  };
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSaving(true);
    setSaved(false);
    try {
      await api.get(`/provider/settings/${profile.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updated }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Account Settings">
      <div className="space-y-3">
        <Toggle
          label="email Notifications"
          checked={settings.emailNotifications}
          onChange={() => handleToggle("emailNotifications")}
        />
        <Toggle
          label="SMS Notifications"
          checked={settings.smsNotifications}
          onChange={() => handleToggle("smsNotifications")}
        />
        <Toggle
          label="Show Profile to Clients"
          checked={settings.showProfile}
          onChange={() => handleToggle("showProfile")}
        />
      </div>
      {saving && <p className="text-xs text-gray-400">Saving...</p>}
      {saved && <p className="text-xs text-green-600">✓ Settings saved</p>}
    </Section>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex justify-between items-center p-4 bg-sky-100 rounded-xl">
      <p>{label}</p>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none ${checked ? "bg-sky-500" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

/* ─── DANGER ZONE ───────────────────────────────────────────── */
function DangerZone({ navigate }) {
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const email = localStorage.getItem("email");

  const handleDeactivate = async () => {
    const res = await api.get(`/provider/deactivate/${email}`, {
      method: "PUT",
    });
    if (res.ok) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };
  const handleDelete = async () => {
    const res = await api.get(`/provider/delete/${email}`, {
      method: "DELETE",
    });
    if (res.ok) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <>
      <Section title="Danger Zone">
        <div className="p-4 border border-red-300 rounded-xl flex justify-between items-center bg-red-100">
          <div>
            <p className="font-medium">Deactivate Account</p>
            <p className="text-sm text-gray-500">
              Temporarily hide your profile from clients.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-400 text-red-600 hover:bg-red-50"
            onClick={() => setShowDeactivate(true)}
          >
            Deactivate
          </Button>
        </div>
        <div className="p-4 border border-red-300 rounded-xl flex justify-between items-center bg-red-100">
          <div>
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-gray-500">
              Permanently remove your account. This cannot be undone.
            </p>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowDelete(true)}
          >
            Delete
          </Button>
        </div>
      </Section>

      {showDeactivate && (
        <ConfirmModal
          title="Deactivate Account"
          message="Your profile will be hidden from clients and you won't receive new bids. You can reactivate by contacting support."
          confirmLabel="Yes, Deactivate"
          confirmClass="bg-orange-500 hover:bg-orange-600 text-white"
          onConfirm={handleDeactivate}
          onClose={() => setShowDeactivate(false)}
        />
      )}
      {showDelete && (
        <ConfirmModal
          title="Delete Account Permanently"
          message="This will permanently delete your account, profile, and all associated data. This action CANNOT be undone."
          confirmLabel="Yes, Delete Forever"
          confirmClass="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
          dangerous
        />
      )}
    </>
  );
}

/* ─── REUSABLE COMPONENTS ───────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onClose,
  dangerous,
}) {
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState("");
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };
  const canConfirm = !dangerous || typed === "DELETE";
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {dangerous && (
          <div>
            <label className="text-sm text-gray-600">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="DELETE"
            />
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className={confirmClass}
            onClick={handleConfirm}
            disabled={loading || !canConfirm}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-sky-50"
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-sky-50"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow border p-8 space-y-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      {children}
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="flex items-center gap-3 p-4 bg-sky-100 rounded-xl">
        {icon}
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
