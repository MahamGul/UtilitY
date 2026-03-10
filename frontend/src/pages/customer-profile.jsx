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
  ClipboardList  // <-- Add this
} from "lucide-react";
import { Button } from "../ui/button";

export function CustomerProfilePage() {
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
                A
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Ahmed Khan</h2>
              <p className="text-lg opacity-90 mb-3">Customer Account</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Member Since</p>
                  <p className="font-bold">January 2024</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Account Status</p>
                  <p className="font-bold">Active</p>
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
          <Button variant="outline" className="border-2 border-gray-200 hover:bg-gray-100 rounded-xl font-medium px-6">
            Change Password
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<User />} label="Full Name" value="Ahmed Khan" />
          <InfoItem icon={<Mail />} label="Email Address" value="ahmed.khan@example.com" />
          <InfoItem icon={<Phone />} label="Phone Number" value="+92 300 1234567" />
          <InfoItem icon={<MapPin />} label="Location" value="Gulberg, Lahore, Pakistan" />
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Address</p>
          <div className="p-4 bg-gray-50 rounded-xl">
            House #123, Street 45, Gulberg III, Lahore, Punjab, Pakistan
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ActivityItem icon={<ClipboardList />} label="Total Requests" value="5" bg="bg-blue-100" />
          <ActivityItem icon={<CheckCircle />} label="Completed" value="2" bg="bg-green-100" />
          <ActivityItem icon={<DollarSign />} label="Total Spent" value="Rs. 42,500" bg="bg-purple-100" />
          <ActivityItem icon={<Star />} label="Avg Rating Given" value="4.5" bg="bg-yellow-100" />
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
        <div className="space-y-4">
          <ToggleItem label="Email Notifications" description="Receive updates about your requests" defaultChecked />
          <ToggleItem label="SMS Notifications" description="Get SMS updates for important events" defaultChecked />
          <ToggleItem label="Marketing Communications" description="Receive promotional offers and updates" />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h3>
        <div className="space-y-4">
          <DangerItem label="Deactivate Account" description="Temporarily disable your account" buttonLabel="Deactivate" />
          <DangerItem label="Delete Account" description="Permanently delete your account and data" buttonLabel="Delete" danger />
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
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, label, value, bg }) {
  return (
    <div className={`p-6 ${bg} rounded-xl`}>
      <div className="flex items-center gap-3 mb-3">{icon}<p className="text-sm text-gray-500">{label}</p></div>
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
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
      </label>
    </div>
  );
}

function DangerItem({ label, description, buttonLabel, danger }) {
  return (
    <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
      <div>
        <p className={`font-semibold ${danger ? "text-red-600" : ""}`}>{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Button className={`${danger ? "bg-red-600 text-white hover:bg-red-700" : "border-2 border-red-300 text-red-600 hover:bg-red-50"} rounded-xl`}>
        {buttonLabel}
      </Button>
    </div>
  );
}