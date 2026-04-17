// src/pages/provider_profile.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, ClipboardList, MessageSquare, History,
  User, LogOut, Wrench, Mail, Phone, MapPin, Edit, Camera,
  Star, DollarSign, CheckCircle, ArrowLeft, TrendingUp, Briefcase
} from "lucide-react";
import { Button } from "../ui/button";

const API_BASE = "http://localhost:8000";

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get logged-in user from localStorage (set during login)
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("Not logged in.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const email = user.email;

        const res = await fetch(`${API_BASE}/provider/profile/${email}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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
          <NavItem to="/provider-dashboard" icon={<LayoutDashboard />} label="Home" />
          <NavItem to="/provider-messages" icon={<MessageSquare />} label="Messages" badge="5" />
          <NavItem to="/bids-history" icon={<History />} label="Bids History" />
          <NavItem to="/my-bids" icon={<ClipboardList />} label="Available Bids" />
          <NavItem to="/provider-profile" icon={<User />} label="Profile" active />
        </nav>

        <div className="p-4 border-t">
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <header className="bg-white border-b px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/provider-dashboard">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
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
          {loading && <p className="text-center text-gray-500 py-20">Loading profile...</p>}
          {error && <p className="text-center text-red-500 py-20">{error}</p>}

          {profile && (
            <>
              <ProfileHeader profile={profile} />
              <PersonalInfo profile={profile} />
              <ProfessionalInfo profile={profile} />
              <PerformanceStats profile={profile} />
              <Reviews profile={profile} />
              <AccountSettings />
              <DangerZone />
            </>
          )}
        </div>
      </main>

    </div>
  );
}

/* NAV ITEM */
function NavItem({ to, icon, label, badge, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        active ? "bg-sky-100 text-black" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
      {badge && (
        <span className="ml-auto bg-sky-500 text-white text-xs px-2 py-1 rounded-full">{badge}</span>
      )}
    </Link>
  );
}

/* PROFILE HEADER */
function ProfileHeader({ profile }) {
  const initials = profile.fullName?.[0]?.toUpperCase() || "?";

  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-sky-300 p-8 flex items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center text-sky-500 text-5xl font-bold shadow">
            {initials}
          </div>
          <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow">
            <Camera className="w-4 h-4 text-sky-500" />
          </button>
        </div>

        <div className="text-white flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-bold">{profile.fullName || "—"}</h2>
            {profile.isVerified && (
              <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">✓ Verified</span>
            )}
          </div>
          <p className="opacity-90 mb-4">
            {profile.serviceType || "Service Provider"} • {profile.experience || 0} years experience
          </p>
          <div className="flex gap-4 flex-wrap">
            <StatCard title="Member Since" value={profile.memberSince || "—"} />
            <StatCard
              title="Rating"
              value={
                <span className="flex items-center gap-1">
                  {profile.rating || "N/A"}{" "}
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                </span>
              }
            />
            <StatCard title="Jobs Completed" value={profile.jobsCompleted ?? 0} />
          </div>
        </div>
      </div>

      <div className="p-6 flex justify-end gap-4 bg-white">
        <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline" className="rounded-full px-6">Change Password</Button>
      </div>
    </div>
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

/* PERSONAL INFO */
function PersonalInfo({ profile }) {
  return (
    <Section title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={<User />} label="Full Name" value={profile.fullName || "—"} />
        <InfoCard icon={<Mail />} label="Email Address" value={profile.email || "—"} />
        <InfoCard icon={<Phone />} label="Phone Number" value={profile.phone || "—"} />
        <InfoCard icon={<MapPin />} label="Service Area" value={profile.serviceArea || "—"} />
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

/* PROFESSIONAL INFO */
function ProfessionalInfo({ profile }) {
  return (
    <Section title="Professional Information">
      <InfoCard icon={<Wrench />} label="Specialization" value={profile.serviceType || "—"} />
      <InfoCard icon={<Briefcase />} label="Experience" value={profile.experience ? `${profile.experience} Years` : "—"} />
      <div>
        <label className="text-sm text-gray-500">Skills</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.skills?.length > 0
            ? profile.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-sky-500 text-white rounded-lg text-sm">{skill}</span>
              ))
            : <span className="text-gray-400 text-sm">No skills listed yet</span>
          }
        </div>
      </div>
    </Section>
  );
}

/* PERFORMANCE STATS */
function PerformanceStats({ profile }) {
  const stats = [
    { title: "Jobs Completed", value: profile.jobsCompleted ?? 0, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: "bg-sky-100" },
    { title: "Average Rating", value: profile.rating ?? "N/A", icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />, bg: "bg-sky-100" },
    { title: "Total Earned", value: `Rs. ${(profile.totalEarned ?? 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-purple-600" />, bg: "bg-sky-100" },
    { title: "Success Rate", value: `${profile.successRate ?? 0}%`, icon: <TrendingUp className="w-5 h-5 text-blue-600" />, bg: "bg-sky-100" }
  ];

  return (
    <Section title="Performance Statistics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={`p-6 ${stat.bg} rounded-xl`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">{stat.icon}</div>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* REVIEWS */
function Reviews({ profile }) {
  const reviews = profile.reviews || [];

  return (
    <Section title="Recent Reviews">
      <div className="space-y-4">
        {reviews.length > 0
          ? reviews.map((review, i) => (
              <div key={i} className="p-4 bg-sky-100 rounded-xl">
                <p className="font-semibold">{review.name || "Anonymous"}</p>
                <div className="flex mb-2">
                  {Array.from({ length: review.rating || 0 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm">"{review.comment}"</p>
              </div>
            ))
          : <p className="text-gray-400 text-sm">No reviews yet.</p>
        }
      </div>
    </Section>
  );
}

/* ACCOUNT SETTINGS */
function AccountSettings() {
  return (
    <Section title="Account Settings">
      <Toggle label="Email Notifications" />
      <Toggle label="SMS Notifications" />
      <Toggle label="Show Profile to Clients" />
    </Section>
  );
}

function Toggle({ label }) {
  return (
    <div className="flex justify-between items-center p-4 bg-sky-100 rounded-xl">
      <p>{label}</p>
      <input type="checkbox" defaultChecked />
    </div>
  );
}

/* DANGER ZONE */
function DangerZone() {
  return (
    <Section title="Danger Zone">
      <div className="p-4 border border-red-300 rounded-xl flex justify-between bg-red-100">
        <p>Deactivate Account</p>
        <Button variant="outline" className="border-red-400 text-red-600">Deactivate</Button>
      </div>
      <div className="p-4 border border-red-300 rounded-xl flex justify-between bg-red-100">
        <p>Delete Account</p>
        <Button className="bg-red-600 text-white">Delete</Button>
      </div>
    </Section>
  );
}

/* REUSABLES */
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