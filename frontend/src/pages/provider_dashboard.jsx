import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Clock, CheckCircle, Star, DollarSign, User,
  MessageSquare, ClipboardList,
  LayoutDashboard, History, Wrench, LogOut
} from "lucide-react";

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
        <span className="ml-auto bg-sky-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function ProviderDashboard() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [activeJobs, setActiveJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) return;

    const localName =
      user?.fullName ||
      user?.name ||
      user?.email?.split("@")[0] ||
      "User";
    setName(localName);

    const email = user.email;

    // Fetch provider profile
    fetch(`http://127.0.0.1:8000/provider/profile/${email}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        if (data?.fullName) setName(data.fullName);
        if (data?.rating) setRating(data.rating);
      })
      .catch(err => console.error("Profile fetch error:", err));

    // Fetch bids to calculate real stats
    fetch(`http://127.0.0.1:8000/bids/provider/${email}`)
      .then(res => res.json())
      .then(bids => {
        const active = bids.filter(b =>
          b.status === "accepted" || b.status === "in_progress"
        ).length;

        const completed = bids.filter(b => b.status === "completed");
        const earned = completed.reduce((sum, b) => sum + (b.bid_amount || 0), 0);

        const ratedBids = completed.filter(b => b.rating && b.rating > 0);
        if (ratedBids.length > 0) {
          const avgRating = ratedBids.reduce((sum, b) => sum + b.rating, 0) / ratedBids.length;
          setRating(Math.round(avgRating * 10) / 10);
        }

        setActiveJobs(active);
        setCompletedJobs(completed.length);
        setTotalEarned(earned);
      })
      .catch(err => console.error("Bids fetch error:", err));

  }, []);

  const stats = [
    {
      icon: Clock,
      label: "Active Jobs",
      value: activeJobs,
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completedJobs,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Star,
      label: "Rating",
      value: rating > 0 ? rating : (profile?.rating || 0),
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: DollarSign,
      label: "Earnings",
      value: `Rs. ${totalEarned > 0 ? totalEarned : (profile?.totalEarned || 0)}`,
      color: "bg-blue-100 text-blue-600"
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">UtilitY</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/provider-dashboard" icon={<LayoutDashboard />} label="Home"            active />
          <NavItem to="/provider-messages"  icon={<MessageSquare />}   label="Messages"        badge="5" />
          <NavItem to="/bids-history"       icon={<History />}         label="Bids History" />
          <NavItem to="/my-bids"            icon={<ClipboardList />}   label="Available Bids" />
          <NavItem to="/provider-profile"   icon={<User />}            label="Profile" />
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
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome Back, {name || "User"}!
            </h1>
            <p className="text-gray-500">Manage your jobs and grow your business</p>
          </div>
          <div className="text-right bg-white shadow p-4 rounded flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-xl font-bold">
                Rs. {totalEarned > 0 ? totalEarned : (profile?.totalEarned || 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center font-bold text-white">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((s, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded shadow">
              <div className={`p-3 rounded ${s.color}`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="font-bold text-lg">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

      </main>

  
    </div>
  );
}