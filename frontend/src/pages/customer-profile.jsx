import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

export function CustomerProfilePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("User not logged in. Please login again.");
      setLoading(false);
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      setError("Invalid session. Please login again.");
      setLoading(false);
      return;
    }

    if (!user?.email) {
      setError("Invalid user data. Please login again.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/customer-profile/${user.email}`)
      .then((res) => {
        setData(res.data || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(
          err?.response?.data?.detail || "Failed to load profile data"
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <p className="text-gray-500 text-lg">No profile data found.</p>
      </div>
    );
  }

  const user = data?.user || {};
  const profile = data?.profile || {};
  const activity = profile?.activitySummary || {};

  // Derive initials for avatar
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // Derive member since from profile if available
  const memberSince = profile?.memberSince || "N/A";

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
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

      {/* Profile Header Card */}
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
              <h2 className="text-3xl font-bold mb-2">
                {user.fullName || "No Name"}
              </h2>
              <p className="text-lg opacity-90 mb-3">Customer Account</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Member Since</p>
                  <p className="font-bold">{memberSince}</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Account Status</p>
                  <p className="font-bold">
                    {profile?.accountStatus || "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex justify-end gap-3 mb-6">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium px-6">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-200 hover:bg-gray-100 rounded-xl font-medium px-6"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={<User />}
            label="Full Name"
            value={user.fullName}
          />
          <InfoItem
            icon={<Mail />}
            label="Email Address"
            value={user.email}
          />
          <InfoItem
            icon={<Phone />}
            label="Phone Number"
            value={user.phone}
          />
          <InfoItem
            icon={<MapPin />}
            label="Location"
            value={user.location}
          />
        </div>

        {user.address && (
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Address</p>
            <div className="p-4 bg-gray-50 rounded-xl">{user.address}</div>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <ActivityItem
            icon={<ClipboardList />}
            label="Total Requests"
            value={activity.totalRequests ?? 0}
            bg="bg-blue-100"
          />
          <ActivityItem
            icon={<CheckCircle />}
            label="Completed"
            value={activity.completed ?? 0}
            bg="bg-green-100"
          />
          <ActivityItem
            icon={<XCircle />}
            label="Cancelled"
            value={activity.cancelled ?? 0}
            bg="bg-red-100"
          />
          <ActivityItem
            icon={<DollarSign />}
            label="Total Spent"
            value={`Rs. ${activity.totalSpent ?? 0}`}
            bg="bg-purple-100"
          />
          <ActivityItem
            icon={<Star />}
            label="Avg Rating Given"
            value={activity.avgRatingGiven ?? 0}
            bg="bg-yellow-100"
          />
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
        <div className="space-y-4">
          <ToggleItem
            label="Email Notifications"
            description="Receive updates about your requests"
            defaultChecked
          />
          <ToggleItem
            label="SMS Notifications"
            description="Get SMS updates for important events"
            defaultChecked
          />
          <ToggleItem
            label="Marketing Communications"
            description="Receive promotional offers and updates"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h3>
        <div className="space-y-4">
          <DangerItem
            label="Deactivate Account"
            description="Temporarily disable your account"
            buttonLabel="Deactivate"
          />
          <DangerItem
            label="Delete Account"
            description="Permanently delete your account and data"
            buttonLabel="Delete"
            danger
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL REUSABLE COMPONENTS ---------------- */

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

function ToggleItem({ label, description, defaultChecked }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          defaultChecked={defaultChecked}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
      </label>
    </div>
  );
}

function DangerItem({ label, description, buttonLabel, danger }) {
  return (
    <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
      <div>
        <p className={`font-semibold ${danger ? "text-red-600" : ""}`}>
          {label}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Button
        className={`${
          danger
            ? "bg-red-600 text-white hover:bg-red-700"
            : "border-2 border-red-300 text-red-600 hover:bg-red-50"
        } rounded-xl`}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}