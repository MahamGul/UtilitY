import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Wrench,
  Droplet,
  Zap,
  Car,
  Hammer,
  Upload,
  Check,
  ChevronDown,
  X,
  Calendar,
  Clock,
} from "lucide-react";

const categories = [
  { id: "plumbing", name: "Plumbing", icon: Droplet },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "mechanical", name: "Mechanical", icon: Car },
  { id: "carpentry", name: "Carpentry", icon: Hammer },
  { id: "general", name: "General Repair", icon: Wrench },
];

export function PostRequestPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send form data to backend
    navigate("/customer-dashboard");
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);
  const CategoryIcon = selectedCategoryData?.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/customer-dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Post New Service Request</h1>
          <p className="text-gray-500 mt-2">
            Fill in the details below to get offers from verified professionals
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Select Category */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">
                  Select Service Category *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full h-14 px-4 bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-600 transition-colors"
                    onClick={(e) => {
                      const menu = e.currentTarget.nextElementSibling;
                      menu?.classList.toggle("hidden");
                    }}
                  >
                    {selectedCategory ? (
                      <div className="flex items-center gap-3">
                        {CategoryIcon && <CategoryIcon className="w-5 h-5 text-blue-600" />}
                        <span className="font-medium text-gray-900">
                          {selectedCategoryData?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Choose a category</span>
                    )}
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>

                  <div className="hidden absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                          onClick={(e) => {
                            setSelectedCategory(category.id);
                            e.currentTarget.parentElement?.classList.add("hidden");
                          }}
                        >
                          <Icon className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900">{category.name}</span>
                          {selectedCategory === category.id && (
                            <Check className="w-5 h-5 text-blue-600 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the work you need done..."
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={4}
                />
              </div>

              {/* Upload Images */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Upload Images
                  <Upload className="w-5 h-5 text-gray-500" />
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative w-24 h-24 border rounded-xl overflow-hidden">
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">Location *</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Budget */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">Budget (Rs.)</label>
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="E.g., 3000 - 5000"
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Select Date
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Select Time
                    <Clock className="w-5 h-5 text-gray-500" />
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">Additional Notes</label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Add any extra details or instructions..."
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}