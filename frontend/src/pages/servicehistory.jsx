import {
  Filter,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Star
} from "lucide-react";
import { useState } from "react";

const serviceHistory = [
  {
    id: "SRV-001",
    serviceType: "Plumbing Repair",
    providerName: "Ahmed Khan",
    rating: 4.9,
    date: "2024-02-15",
    status: "completed",
    amount: 85.0
  },
  {
    id: "SRV-002",
    serviceType: "Electrical Work",
    providerName: "Fatima Ali",
    rating: 4.8,
    date: "2024-02-10",
    status: "completed",
    amount: 120.0
  },
  {
    id: "SRV-003",
    serviceType: "AC Maintenance",
    providerName: "Hassan Malik",
    rating: 4.7,
    date: "2024-02-20",
    status: "cancelled",
    amount: 0
  }
];

const getStatusConfig = (status) => {
  switch (status) {
    case "completed":
      return {
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Completed"
      };

    case "cancelled":
      return {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Cancelled"
      };

    default:
      return {
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        label: "Pending"
      };
  }
};

export default function ServiceHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredServices = serviceHistory
    .filter((service) => {
      if (filter === "all") return true;
      return service.status === filter;
    })
    .filter((service) =>
      service.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalSpent = serviceHistory
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">Service History</h1>
          <p className="text-gray-500 text-sm">
            View and manage your past service requests
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>

      </div>

      {/* Filters + Search */}
      <div className="flex justify-between items-center mb-6">

        {/* Tabs */}
        <div className="flex gap-3">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === "completed"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === "cancelled"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Cancelled
          </button>

        </div>

        {/* Search + Filter */}
        <div className="flex gap-3">

          <input
            className="border rounded-lg px-4 py-2 w-64"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg">
            <Filter className="w-4 h-4" />
            Filter
          </button>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left">Service Details</th>
              <th className="p-4 text-left">Provider</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredServices.map((service) => {

              const statusConfig = getStatusConfig(service.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={service.id} className="border-t hover:bg-gray-50">

                  {/* Service Details */}
                  <td className="p-4">
                    <div className="font-semibold">
                      {service.serviceType}
                    </div>
                    <div className="text-xs text-gray-500">
                      {service.id}
                    </div>
                  </td>

                  {/* Provider */}
                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-8 h-8 rounded-full bg-gray-300" />

                      <div>
                        <p className="text-sm font-medium">
                          {service.providerName}
                        </p>

                        <p className="flex items-center text-xs text-gray-500 gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {service.rating}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Date */}
                  <td className="p-4 text-sm">
                    {new Date(service.date).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="p-4">

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>

                  </td>

                  {/* Amount */}
                  <td className="p-4 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {service.amount.toFixed(2)}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <button className="flex items-center gap-1 text-blue-600 text-sm">
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}