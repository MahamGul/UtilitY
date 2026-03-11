import { Link } from "react-router-dom";
import { Clock, CheckCircle, Star, DollarSign, User, TrendingUp, MessageSquare, ClipboardList } from "lucide-react";

/* Button component */
function Button({ children, variant = "default", onClick, className }) {
  const base = "flex items-center justify-center gap-2 p-2 rounded transition font-semibold";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 hover:bg-gray-100",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
    >
      {children}  {/* fixed: only once */}
    </button>
  );
}

const stats = [
  { icon: Clock, label: "Active Jobs", value: 2, color: "bg-purple-100 text-purple-600" },
  { icon: CheckCircle, label: "Completed", value: 24, color: "bg-green-100 text-green-600" },
  { icon: Star, label: "Rating", value: 4.8, color: "bg-yellow-100 text-yellow-600" },
  { icon: DollarSign, label: "This Month", value: "Rs. 32k", color: "bg-blue-100 text-blue-600" },
];

const performance = [
  { label: "Response Rate", value: "92%", icon: TrendingUp },
  { label: "Completion Rate", value: "96%", icon: CheckCircle },
  { label: "Client Satisfaction", value: "4.8/5", icon: Star },
];

export default function ProviderDashboard() {
  const totalEarnings = 29000;

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo / Brand */}
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            U
          </div>
          <span className="font-bold text-xl text-gray-800">UtilitY</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="#"
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 text-blue-700 font-semibold"
          >
            <Clock size={18} /> Home
          </Link>

          <Link
            to="#"
            className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={18} /> Messages
            </div>
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              5
            </span>
          </Link>

          <Link
            to="/bids-history" // <-- set the actual route for your Bids History page
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
            <ClipboardList size={18} /> Bids History
            </Link>
          <Link
            to="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TrendingUp size={18} /> Available Bids
          </Link>

          <Link
            to="/provider-profile"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
            <User size={18} /> Profile
            </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back, Usman!</h1>
            <p className="text-gray-500">Manage your jobs and grow your business</p>
          </div>
          <div className="text-right bg-white shadow p-4 rounded flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-xl font-bold">Rs. {totalEarnings}</p>
            </div>
            <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center font-bold text-white">U</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((s, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-4 bg-white rounded shadow`}>
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

        {/* New Job Opportunities Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-200 to-green-100 rounded shadow flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">New Job Opportunities</h2>
            <p className="text-gray-600">3 new requests in your area matching your skills</p>
          </div>
          <Button>View Opportunities</Button>
        </div>

        {/* Performance Overview */}
        <h2 className="text-2xl font-bold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-3 gap-6">
          {performance.map((p, idx) => (
            <div key={idx} className="bg-white p-6 rounded shadow flex items-center gap-4">
              <p className="p-3 bg-blue-100 rounded"><p.icon size={24} /></p>
              <div>
                <h3 className="text-xl font-bold">{p.value}</h3>
                <p className="text-gray-500">{p.label}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}