// src/pages/BidsHistoryPage.jsx
import { Link, useLocation } from "react-router";
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

/* ---------------- MOCK DATA ---------------- */

const allJobs = [
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
  }
];

/* ---------------- STATUS COLOR ---------------- */

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

/* ---------------- MAIN PAGE ---------------- */

export function BidsHistoryPage() {

  const [filterStatus, setFilterStatus] = useState("All");

  const filteredJobs =
    filterStatus === "All"
      ? allJobs
      : allJobs.filter((job) => job.status === filterStatus);

  const activeJobs = allJobs.filter(
    (job) => job.status === "In Progress" || job.status === "Accepted"
  );

  const completedJobs = allJobs.filter(
    (job) => job.status === "Completed"
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">

      {/* SIDEBAR */}

      <aside className="w-full lg:w-64 bg-white border-r border-border flex flex-col shadow-sm">

        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white"/>
            </div>
            <span className="text-xl font-bold text-foreground">
              UtilitY
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <SidebarLink
            to="/provider-dashboard"
            icon={<LayoutDashboard />}
            label="Home"
          />

          <SidebarLink
            to="/provider-messages"
            icon={<MessageSquare />}
            label="Messages"
            badge="5"
          />

          <SidebarLink
            to="/bids-history"
            icon={<History />}
            label="Bids History"
          />

          <SidebarLink
            to="/my-bids"
            icon={<ClipboardList />}
            label="Available Bids"
          />

          <SidebarLink
            to="/provider-profile"
            icon={<User />}
            label="Profile"
          />

        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            <LogOut className="w-5 h-5"/>
            Logout
          </Link>
        </div>

      </aside>

      {/* MAIN */}

      <main className="flex-1 overflow-y-auto">

        {/* HEADER */}

        <header className="bg-white border-b border-border px-8 py-6">

          <h1 className="text-3xl font-bold mb-2">
            Bids History
          </h1>

          <p className="text-muted-foreground">
            View all your jobs
          </p>

        </header>

        <div className="p-8 space-y-8">

          <StatsCards
            activeJobs={activeJobs}
            completedJobs={completedJobs}
          />

          <FilterBar
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          <JobsList jobs={filteredJobs}/>

        </div>

      </main>

    </div>
  );
}

/* ---------------- SIDEBAR LINK ---------------- */

function SidebarLink({ to, icon, label, badge }) {

  const location = useLocation();

  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >

      {icon}

      {label}

      {badge && (
        <span className="ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}

    </Link>
  );
}

/* ---------------- STATS ---------------- */

function StatsCards({ activeJobs, completedJobs }) {

  return (

    <div className="grid md:grid-cols-3 gap-6">

      <Card
        icon={<Clock className="w-6 h-6 text-purple-600"/>}
        label="Active Jobs"
        value={activeJobs.length}
      />

      <Card
        icon={<CheckCircle className="w-6 h-6 text-green-600"/>}
        label="Completed Jobs"
        value={completedJobs.length}
      />

      <Card
        icon={<Star className="w-6 h-6 text-yellow-500"/>}
        label="Average Rating"
        value="4.8"
      />

    </div>

  );

}

/* ---------------- CARD ---------------- */

function Card({ icon, label, value }) {

  return (

    <div className="bg-white rounded-2xl border p-6">

      <div className="flex gap-4 items-center">

        {icon}

        <div>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>

          <p className="text-2xl font-bold">
            {value}
          </p>

        </div>

      </div>

    </div>

  );

}

/* ---------------- FILTER ---------------- */

function FilterBar({ filterStatus, setFilterStatus }) {

  const statuses = [
    "All",
    "In Progress",
    "Accepted",
    "Completed"
  ];

  return (

    <div className="bg-white rounded-2xl border p-6 flex justify-between items-center">

      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5"/>
        Filter
      </div>

      <div className="flex gap-2">

        {statuses.map((status) => (

          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl ${
              filterStatus === status
                ? "bg-primary text-white"
                : "bg-accent"
            }`}
          >
            {status}
          </button>

        ))}

      </div>

    </div>

  );

}

/* ---------------- JOB LIST ---------------- */

function JobsList({ jobs }) {

  return (

    <div className="space-y-4">

      {jobs.map((job) => (

        <div
          key={job.id}
          className="bg-white rounded-2xl border p-6"
        >

          <JobItem job={job}/>

        </div>

      ))}

    </div>

  );

}

/* ---------------- JOB ITEM ---------------- */

function JobItem({ job }) {

  return (

    <div>

      <div className="flex justify-between mb-4">

        <div>

          <h3 className="text-xl font-bold">
            {job.title}
          </h3>

          <p className="text-muted-foreground">
            {job.description}
          </p>

        </div>

        <span
          className={`px-3 py-1 text-xs rounded-lg border ${getStatusColor(
            job.status
          )}`}
        >
          {job.status}
        </span>

      </div>

      <div className="flex gap-4 text-sm">

        <span className="flex items-center gap-1">
          <User className="w-4 h-4"/>
          {job.client}
        </span>

        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4"/>
          {job.location}
        </span>

        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <DollarSign className="w-4 h-4"/>
          {job.agreedPrice}
        </span>

        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4"/>
          {job.date}
        </span>

      </div>

      <div className="flex gap-3 pt-4 border-t mt-4">

        <Button className="bg-primary text-white">
          <Eye className="w-4 h-4 mr-2"/>
          View Details
        </Button>

        <Link to="/provider-messages">

          <Button variant="outline">

            <MessageSquare className="w-4 h-4 mr-2"/>

            Contact Client

          </Button>

        </Link>

      </div>

    </div>

  );

}