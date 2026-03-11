// src/pages/BidsHistoryPage.jsx
import { Link } from "react-router";
import { useState } from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare, 
  History, 
  User, 
  LogOut, 
  Wrench,
  Clock,
  CheckCircle,
  Eye,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Filter
} from "lucide-react";
import { Button } from "../ui/button";

// Mock data for all jobs (Active + Completed)
const allJobs = [
  // Active Jobs
  {
    id: 1,
    title: "Fix leaking kitchen sink",
    serviceType: "Plumbing",
    client: "Ahmed Khan",
    location: "Gulberg, Lahore",
    budget: "Rs. 3,000 - Rs. 5,000",
    agreedPrice: "Rs. 4,200",
    status: "In Progress",
    date: "Dec 28, 2024",
    scheduledDate: "Tomorrow, 2 PM",
    clientPhone: "+92 300 1234567",
    description: "Kitchen sink has a leak under the basin"
  },
  {
    id: 2,
    title: "Install ceiling fan in bedroom",
    serviceType: "Electrical",
    client: "Fatima Malik",
    location: "DHA Phase 5, Lahore",
    budget: "Rs. 4,000 - Rs. 7,000",
    agreedPrice: "Rs. 5,500",
    status: "Accepted",
    date: "Dec 27, 2024",
    scheduledDate: "Dec 30, 11 AM",
    clientPhone: "+92 321 7654321",
    description: "Need ceiling fan installation in master bedroom"
  },
  // Completed Jobs
  {
    id: 3,
    title: "Bathroom shower head replacement",
    serviceType: "Plumbing",
    client: "Ayesha Raza",
    location: "Bahria Town, Rawalpindi",
    budget: "Rs. 2,000 - Rs. 3,500",
    agreedPrice: "Rs. 3,000",
    status: "Completed",
    date: "Dec 26, 2024",
    completedDate: "Dec 26, 2024",
    rating: 5,
    review: "Excellent work! Very professional and quick.",
    earnings: "Rs. 3,000"
  },
  {
    id: 4,
    title: "Fix water pipe leak",
    serviceType: "Plumbing",
    client: "Imran Khan",
    location: "F-7 Markaz, Islamabad",
    budget: "Rs. 3,500 - Rs. 6,000",
    agreedPrice: "Rs. 4,500",
    status: "Completed",
    date: "Dec 23, 2024",
    completedDate: "Dec 23, 2024",
    rating: 4,
    review: "Good service, arrived on time.",
    earnings: "Rs. 4,500"
  },
  {
    id: 5,
    title: "Kitchen sink pipe replacement",
    serviceType: "Plumbing",
    client: "Zainab Ali",
    location: "Clifton, Karachi",
    budget: "Rs. 5,000 - Rs. 8,000",
    agreedPrice: "Rs. 6,000",
    status: "Completed",
    date: "Dec 21, 2024",
    completedDate: "Dec 21, 2024",
    rating: 5,
    review: "Highly skilled and reliable professional!",
    earnings: "Rs. 6,000"
  },
  {
    id: 6,
    title: "Water heater repair",
    serviceType: "Plumbing",
    client: "Usman Ahmed",
    location: "Gulberg, Lahore",
    budget: "Rs. 2,500 - Rs. 4,500",
    agreedPrice: "Rs. 3,500",
    status: "Completed",
    date: "Dec 18, 2024",
    completedDate: "Dec 18, 2024",
    rating: 5,
    review: "Great job, will hire again.",
    earnings: "Rs. 3,500"
  },
  {
    id: 7,
    title: "Bathroom renovation plumbing",
    serviceType: "Plumbing",
    client: "Sara Khan",
    location: "Model Town, Lahore",
    budget: "Rs. 10,000 - Rs. 15,000",
    agreedPrice: "Rs. 12,000",
    status: "Completed",
    date: "Dec 13, 2024",
    completedDate: "Dec 15, 2024",
    rating: 4,
    review: "Professional work, took slightly longer than expected.",
    earnings: "Rs. 12,000"
  }
];

// Status color helper
const getStatusColor = (status) => {
  switch (status) {
    case "In Progress":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Accepted":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export function BidsHistoryPage() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredJobs = filterStatus === "All" 
    ? allJobs 
    : allJobs.filter(job => job.status === filterStatus);

  const activeJobs = allJobs.filter(job => job.status === "In Progress" || job.status === "Accepted");
  const completedJobs = allJobs.filter(job => job.status === "Completed");

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-border flex flex-col shadow-sm">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">UtilitY</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink to="/provider-dashboard" icon={<LayoutDashboard />} label="Home" />
          <SidebarLink to="/provider-messages" icon={<MessageSquare />} label="Messages" badge="5" />
          <SidebarLink to="/bids-history" icon={<History />} label="Bids History" active />
          <SidebarLink to="/my-bids" icon={<ClipboardList />} label="Available Bids" />
          <SidebarLink to="/provider-profile" icon={<User />} label="Profile" />
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Bids History</h1>
              <p className="text-muted-foreground">View all your jobs - active and completed</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold text-foreground">{allJobs.length}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats */}
          <StatsCards activeJobs={activeJobs} completedJobs={completedJobs} />

          {/* Filters */}
          <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

          {/* Jobs List */}
          <JobsList jobs={filteredJobs} />
        </div>
      </main>
    </div>
  );
}

/* Sidebar link */
function SidebarLink({ to, icon, label, active, badge }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
        active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      {badge && <span className="ml-auto bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">{badge}</span>}
    </Link>
  );
}

/* Stats Cards */
function StatsCards({ activeJobs, completedJobs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card icon={<Clock className="w-6 h-6 text-purple-600" />} color="bg-purple-100" label="Active Jobs" value={activeJobs.length} />
      <Card icon={<CheckCircle className="w-6 h-6 text-green-600" />} color="bg-green-100" label="Completed Jobs" value={completedJobs.length} />
      <Card icon={<Star className="w-6 h-6 text-yellow-600" />} color="bg-yellow-100" label="Average Rating" value="4.8" extra={<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />} />
    </div>
  );
}

/* Single Card */
function Card({ icon, color, label, value, extra }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
            {value}
            {extra}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Filter Bar */
function FilterBar({ filterStatus, setFilterStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <p className="font-semibold text-foreground">Filter by Status:</p>
      </div>
      <div className="flex gap-2">
        {["All", "In Progress", "Accepted", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filterStatus === status ? "bg-primary text-white" : "bg-accent text-foreground hover:bg-accent/70"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Jobs List */
function JobsList({ jobs }) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <JobItem job={job} />
        </div>
      ))}
    </div>
  );
}

/* Single Job Item */
function JobItem({ job }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Info icon={<User className="w-4 h-4 text-muted-foreground" />} label="Client" value={job.client} />
            <Info icon={<MapPin className="w-4 h-4 text-muted-foreground" />} label="Location" value={job.location} />
            <Info icon={<DollarSign className="w-4 h-4 text-muted-foreground" />} label="Agreed Price" value={job.agreedPrice} valueClass="text-green-600" />
            <Info icon={<Calendar className="w-4 h-4 text-muted-foreground" />} label="Date" value={job.date} />
          </div>

          {/* Completed Job Extra */}
          {job.status === "Completed" && job.rating && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-muted-foreground mr-2">Client Rating:</p>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < job.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  ))}
                  <span className="ml-2 font-bold text-foreground">{job.rating}/5</span>
                </div>
                <p className="text-sm font-bold text-green-600">Earned: {job.earnings}</p>
              </div>
              {job.review && <p className="text-sm text-foreground italic">"{job.review}"</p>}
            </div>
          )}

          {/* Active Job Extra */}
          {(job.status === "In Progress" || job.status === "Accepted") && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <p className="text-muted-foreground">Scheduled for:</p>
                <p className="font-semibold text-foreground">{job.scheduledDate}</p>
              </div>
              <p className="text-sm text-muted-foreground">Contact: {job.clientPhone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl font-medium">
          <Eye className="w-4 h-4 mr-2" /> View Details
        </Button>
        {(job.status === "In Progress" || job.status === "Accepted") && (
          <Link to="/provider-messages">
            <Button variant="outline" className="border-2 border-border hover:bg-accent rounded-xl font-medium">
              <MessageSquare className="w-4 h-4 mr-2" /> Contact Client
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

/* Info Item */
function Info({ icon, label, value, valueClass }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`font-semibold text-foreground ${valueClass || ""}`}>{value}</p>
      </div>
    </div>
  );
}