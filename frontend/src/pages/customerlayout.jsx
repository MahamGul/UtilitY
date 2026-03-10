import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, User, PlusCircle, ClipboardList } from "lucide-react";

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <Link to="/customer-dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">UtilitY</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/customer-dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/customer-dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>

          <Link
            to="/customer-dashboard/post-request"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            Post Request
          </Link>

          <Link
            to="/customer-dashboard/my-requests"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <ClipboardList className="w-5 h-5" />
            My Requests
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8">
        {/* THIS IS IMPORTANT: nested route content will render here */}
        <Outlet />
      </main>
    </div>
  );
}