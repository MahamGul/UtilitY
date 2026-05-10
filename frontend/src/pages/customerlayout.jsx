import { Link, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  PlusCircle, 
  ClipboardList, 
  MessageSquare, 
  LogOut,
  History
} from "lucide-react";

export default function CustomerLayout() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">

        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/customer-dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">UtilitY</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">

          <Link
            to="/customer-dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/customer-dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 font-medium"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>

          <Link
            to="/customer-dashboard/post-request"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            Post Request
          </Link>

          <Link
            to="/customer-dashboard/my-requests"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 font-medium"
          >
            <ClipboardList className="w-5 h-5" />
            My Requests
          </Link>

          {/* FIXED: Correct route */}
          <Link
            to="/customer-dashboard/history"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 font-medium"
          >
            <History className="w-5 h-5" />
            Service History
          </Link>

          <Link
            to="/customer-dashboard/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 font-medium"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </Link>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100 text-red-600 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}