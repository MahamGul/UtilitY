// src/pages/provider_profile.jsx

import { Link } from "react-router-dom";
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
  Briefcase
} from "lucide-react";

import { Button } from "../ui/button";

export default function ProviderProfilePage() {
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
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1">

        {/* HEADER */}
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
            U
          </div>

        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">

          <ProfileHeader />

          <PersonalInfo />

          <ProfessionalInfo />

          <PerformanceStats />

          <Reviews />

          <AccountSettings />

          <DangerZone />

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
        active
          ? "bg-sky-100 text-black"
          : "text-gray-600 hover:bg-gray-100"
      }`}
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

/* PROFILE HEADER */
function ProfileHeader() {
  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden">

      <div className="bg-gradient-to-r from-sky-500 to-sky-300 p-8 flex items-center gap-6">

        <div className="relative">

          <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center text-sky-500 text-5xl font-bold shadow">
            U
          </div>

          <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow">
            <Camera className="w-4 h-4 text-sky-500" />
          </button>

        </div>

        <div className="text-white flex-1">

          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-bold">Usman Ahmed</h2>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">✓ Verified</span>
          </div>

          <p className="opacity-90 mb-4">Professional Plumber • 5 years experience</p>

          <div className="flex gap-4 flex-wrap">
            <StatCard title="Member Since" value="March 2023" />
            <StatCard
              title="Rating"
              value={<span className="flex items-center gap-1">4.8 <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" /></span>}
            />
            <StatCard title="Jobs Completed" value="24" />
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
function PersonalInfo() {
  return (
    <Section title="Personal Information">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={<User />} label="Full Name" value="Usman Ahmed" />
        <InfoCard icon={<Mail />} label="Email Address" value="usman.ahmed@example.com" />
        <InfoCard icon={<Phone />} label="Phone Number" value="+92 321 9876543" />
        <InfoCard icon={<MapPin />} label="Service Area" value="Lahore, Pakistan" />
      </div>

      <div className="mt-6">
        <label className="text-sm text-gray-500">Address</label>
        <div className="p-4 bg-sky-100 rounded-xl">
          House #456, Street 12, Model Town, Lahore, Punjab, Pakistan
        </div>
      </div>

    </Section>
  );
}

/* PROFESSIONAL INFO */
function ProfessionalInfo() {
  return (
    <Section title="Professional Information">
      <InfoCard icon={<Wrench />} label="Specialization" value="Plumbing Services" />
      <InfoCard icon={<Briefcase />} label="Experience" value="5 Years" />

      <div>
        <label className="text-sm text-gray-500">Skills</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {["Pipe Installation","Leak Repair","Water Heater","Drain Cleaning"].map((skill) => (
            <span key={skill} className="px-3 py-1 bg-sky-500 text-white rounded-lg text-sm">{skill}</span>
          ))}
        </div>
      </div>

    </Section>
  );
}

/* PERFORMANCE STATS - Blue cards */
function PerformanceStats() {
  const stats = [
    { title: "Jobs Completed", value: "24", icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: "bg-sky-100" },
    { title: "Average Rating", value: "4.8", icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />, bg: "bg-sky-100" },
    { title: "Total Earned", value: "Rs. 95k", icon: <DollarSign className="w-5 h-5 text-purple-600" />, bg: "bg-sky-100" },
    { title: "Success Rate", value: "96%", icon: <TrendingUp className="w-5 h-5 text-blue-600" />, bg: "bg-sky-100" }
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

/* REVIEWS - Blue cards */
function Reviews() {
  const reviews = [
    { name: "Ayesha Raza", rating: 5, comment: "Excellent work!" },
    { name: "Imran Khan", rating: 4, comment: "Good service." }
  ];

  return (
    <Section title="Recent Reviews">
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="p-4 bg-sky-100 rounded-xl">
            <p className="font-semibold">{review.name}</p>
            <div className="flex mb-2">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ACCOUNT SETTINGS - Blue toggles */
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

/* DANGER ZONE - Red cards */
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

/* REUSABLE SECTIONS */
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