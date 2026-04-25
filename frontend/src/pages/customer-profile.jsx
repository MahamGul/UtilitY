import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Camera,
  Star,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ClipboardList,
  XCircle,
  Save,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export function CustomerProfilePage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", location: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Change password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    marketingCommunications: false,
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState("");

  // Deactivate modal
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // ----------------------------------------------------------------
  // Load profile
  // ----------------------------------------------------------------
  const fetchProfile = (email) => {
    axios
      .get(`${API}/customer-profile/${email}`)
      .then((res) => {
        const d = res.data;
        setData(d);
        setLoading(false);
        // Pre-fill notification toggles from DB
        const prefs = d?.profile?.preferences || {};
        setNotifications({
          emailNotifications: prefs.emailNotifications ?? true,
          smsNotifications: prefs.smsNotifications ?? true,
          marketingCommunications: prefs.marketingCommunications ?? false,
        });
      })
      .catch((err) => {
        setError(err?.response?.data?.detail || "Failed to load profile data");
        setLoading(false);
      });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { setError("User not logged in. Please login again."); setLoading(false); return; }
    let user;
    try { user = JSON.parse(storedUser); } catch { setError("Invalid session. Please login again."); setLoading(false); return; }
    if (!user?.email) { setError("Invalid user data. Please login again."); setLoading(false); return; }
    setUserEmail(user.email);
    fetchProfile(user.email);
  }, []);

  // ----------------------------------------------------------------
  // Edit Profile handlers
  // ----------------------------------------------------------------
  const openEditModal = () => {
    const u = data?.user || {};
    setEditForm({ fullName: u.fullName || "", phone: u.phone || "", location: u.location || "" });
    setEditError("");
    setEditSuccess("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    setEditError("");
    setEditSuccess("");
    if (!editForm.fullName.trim()) { setEditError("Full name is required."); return; }
    setEditLoading(true);
    try {
      await axios.put(`${API}/customer-profile/update/${userEmail}`, editForm);
      setEditSuccess("Profile updated successfully!");
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, fullName: editForm.fullName, phone: editForm.phone, location: editForm.location }));
      fetchProfile(userEmail);
      setTimeout(() => setShowEditModal(false), 1200);
    } catch (err) {
      setEditError(err?.response?.data?.detail || "Failed to update profile.");
    } finally {
      setEditLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Change Password handlers
  // ----------------------------------------------------------------
  const openPasswordModal = () => {
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordForm.oldPassword) { setPasswordError("Please enter your current password."); return; }
    if (!passwordForm.newPassword) { setPasswordError("Please enter a new password."); return; }
    if (passwordForm.newPassword.length < 4) { setPasswordError("New password must be at least 4 characters."); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError("New passwords do not match."); return; }
    setPasswordLoading(true);
    try {
      await axios.put(`${API}/customer/change-password/${userEmail}`, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setTimeout(() => setShowPasswordModal(false), 1200);
    } catch (err) {
      setPasswordError(err?.response?.data?.detail || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Notification toggle handlers
  // ----------------------------------------------------------------
  const handleNotifToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveNotificationSettings = async () => {
    setNotifSaving(true);
    setNotifSuccess("");
    try {
      await axios.put(`${API}/customer/settings/${userEmail}`, notifications);
      setNotifSuccess("Settings saved!");
      setTimeout(() => setNotifSuccess(""), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setNotifSaving(false);
    }
  };

  // ----------------------------------------------------------------
  // Deactivate handlers
  // ----------------------------------------------------------------
  const handleDeactivate = async () => {
    setDeactivateLoading(true);
    try {
      await axios.put(`${API}/customer/deactivate/${userEmail}`);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setDeactivateLoading(false);
      setShowDeactivateModal(false);
    }
  };

  // ----------------------------------------------------------------
  // Delete handlers
  // ----------------------------------------------------------------
  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API}/customer/delete/${userEmail}`);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // ----------------------------------------------------------------
  // Render guards
  // ----------------------------------------------------------------
  if (loading) return <div className="p-8 flex items-center justify-center min-h-64"><p className="text-gray-500 text-lg">Loading profile...</p></div>;
  if (error) return <div className="p-8 flex items-center justify-center min-h-64"><p className="text-red-500 text-lg">{error}</p></div>;
  if (!data) return <div className="p-8 flex items-center justify-center min-h-64"><p className="text-gray-500 text-lg">No profile data found.</p></div>;

  const user = data?.user || {};
  const profile = data?.profile || {};
  const activity = profile?.activitySummary || {};

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const memberSince = profile?.memberSince || "N/A";

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">

      {/* ============ EDIT PROFILE MODAL ============ */}
      {showEditModal && (
        <Modal title="Edit Profile" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <FormField label="Full Name" required>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </FormField>
            <FormField label="Phone Number">
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </FormField>
            <FormField label="Location">
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="Enter your city / location"
              />
            </FormField>
            {editError && <p className="text-red-500 text-sm">{editError}</p>}
            {editSuccess && <p className="text-green-600 text-sm font-medium">{editSuccess}</p>}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                onClick={handleEditSubmit}
                disabled={editLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============ CHANGE PASSWORD MODAL ============ */}
      {showPasswordModal && (
        <Modal title="Change Password" onClose={() => setShowPasswordModal(false)}>
          <div className="space-y-4">
            <FormField label="Current Password">
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowOld(!showOld)}>
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>
            <FormField label="New Password">
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>
            <FormField label="Confirm New Password">
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-600 text-sm font-medium">{passwordSuccess}</p>}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                onClick={handlePasswordSubmit}
                disabled={passwordLoading}
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============ DEACTIVATE CONFIRM MODAL ============ */}
      {showDeactivateModal && (
        <Modal title="Deactivate Account" onClose={() => setShowDeactivateModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Your account will be temporarily disabled. You can contact support to reactivate it. You will be logged out.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600 rounded-xl"
                onClick={handleDeactivate}
                disabled={deactivateLoading}
              >
                {deactivateLoading ? "Deactivating..." : "Yes, Deactivate"}
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeactivateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============ DELETE CONFIRM MODAL ============ */}
      {showDeleteModal && (
        <Modal title="Delete Account Permanently" onClose={() => setShowDeleteModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">
                This action is <strong>irreversible</strong>. All your data including requests and profile will be permanently deleted.
              </p>
            </div>
            <FormField label={`Type DELETE to confirm`}>
              <input
                className="w-full border border-red-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
              />
            </FormField>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-xl disabled:opacity-50"
                onClick={handleDelete}
                disabled={deleteLoading || deleteConfirmText !== "DELETE"}
              >
                {deleteLoading ? "Deleting..." : "Delete Permanently"}
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============ HEADER ============ */}
      <header className="flex items-center gap-4 mb-8">
        <Link to="/customer-dashboard">
          <Button variant="outline" className="rounded-xl border-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
      </header>

      {/* ============ PROFILE HEADER CARD ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-bold text-5xl">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{user.fullName || "No Name"}</h2>
              <p className="text-lg opacity-90 mb-3">Customer Account</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Member Since</p>
                  <p className="font-bold">{memberSince}</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Account Status</p>
                  <p className="font-bold">{profile?.accountStatus || "Active"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex justify-end gap-3 mb-6">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium px-6"
            onClick={openEditModal}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-200 hover:bg-gray-100 rounded-xl font-medium px-6"
            onClick={openPasswordModal}
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* ============ PERSONAL INFORMATION ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<User />} label="Full Name" value={user.fullName} />
          <InfoItem icon={<Mail />} label="Email Address" value={user.email} />
          <InfoItem icon={<Phone />} label="Phone Number" value={user.phone} />
          <InfoItem icon={<MapPin />} label="Location" value={user.location} />
        </div>
      </div>

      {/* ============ ACTIVITY SUMMARY ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <ActivityItem icon={<ClipboardList />} label="Total Requests" value={activity.totalRequests ?? 0} bg="bg-blue-100" />
          <ActivityItem icon={<CheckCircle />} label="Completed" value={activity.completed ?? 0} bg="bg-green-100" />
          <ActivityItem icon={<XCircle />} label="Cancelled" value={activity.cancelled ?? 0} bg="bg-red-100" />
          <ActivityItem icon={<DollarSign />} label="Total Spent" value={`Rs. ${activity.totalSpent ?? 0}`} bg="bg-purple-100" />
          <ActivityItem icon={<Star />} label="Avg Rating Given" value={activity.avgRatingGiven ?? 0} bg="bg-yellow-100" />
        </div>
      </div>

      {/* ============ ACCOUNT SETTINGS ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Account Settings</h3>
          <div className="flex items-center gap-3">
            {notifSuccess && <span className="text-green-600 text-sm font-medium">{notifSuccess}</span>}
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-5"
              onClick={saveNotificationSettings}
              disabled={notifSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {notifSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <ToggleItem
            label="Email Notifications"
            description="Receive updates about your requests"
            checked={notifications.emailNotifications}
            onChange={() => handleNotifToggle("emailNotifications")}
          />
          <ToggleItem
            label="SMS Notifications"
            description="Get SMS updates for important events"
            checked={notifications.smsNotifications}
            onChange={() => handleNotifToggle("smsNotifications")}
          />
          <ToggleItem
            label="Marketing Communications"
            description="Receive promotional offers and updates"
            checked={notifications.marketingCommunications}
            onChange={() => handleNotifToggle("marketingCommunications")}
          />
        </div>
      </div>

      {/* ============ DANGER ZONE ============ */}
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h3>
        <div className="space-y-4">
          <DangerItem
            label="Deactivate Account"
            description="Temporarily disable your account. You will be logged out."
            buttonLabel="Deactivate"
            onClick={() => setShowDeactivateModal(true)}
          />
          <DangerItem
            label="Delete Account"
            description="Permanently delete your account and all data. This cannot be undone."
            buttonLabel="Delete"
            danger
            onClick={() => { setDeleteConfirmText(""); setShowDeleteModal(true); }}
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MODAL WRAPPER
================================================================ */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ================================================================
   SMALL REUSABLE COMPONENTS
================================================================ */
function InfoItem({ icon, label, value }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        {icon}
        <p className="font-semibold">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, label, value, bg }) {
  return (
    <div className={`p-6 ${bg} rounded-xl`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ToggleItem({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer" onClick={onChange}>
        <input type="checkbox" className="sr-only peer" checked={checked} readOnly />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
      </label>
    </div>
  );
}

function DangerItem({ label, description, buttonLabel, danger, onClick }) {
  return (
    <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
      <div>
        <p className={`font-semibold ${danger ? "text-red-600" : ""}`}>{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Button
        className={`${
          danger
            ? "bg-red-600 text-white hover:bg-red-700"
            : "border-2 border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
        } rounded-xl`}
        onClick={onClick}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}