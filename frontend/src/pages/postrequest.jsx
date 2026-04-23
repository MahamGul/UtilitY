import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Droplet, Zap, Car, Hammer, Wrench } from "lucide-react";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const categories = [
  { id: "plumber", name: "Plumbing", icon: Droplet },
  { id: "electrician", name: "Electrical", icon: Zap },
  { id: "mechanic", name: "Mechanical", icon: Car },
  { id: "carpenter", name: "Carpentry", icon: Hammer },
  { id: "general repair", name: "General Repair", icon: Wrench },
];

// Cloudinary
const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dajgdjgki/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "utility_upload";

// ---------------- LOCATION PICKER ----------------
function LocationPicker({ setLocation, setLocationName }) {
  const [marker, setMarker] = useState(null);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      return (
        data.display_name ||
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      );
    } catch (err) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  useMapEvents({
    click: async (e) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };

      setMarker(coords);
      setLocation(coords);

      const name = await reverseGeocode(coords.lat, coords.lng);
      setLocationName(name);
    },
  });

  return marker ? <Marker position={marker} /> : null;
}

// ---------------- MAIN PAGE ----------------
export function PostRequestPage() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");   // ✅ NEW
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreview((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles((p) => p.filter((_, i) => i !== index));
    setImagePreview((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return alert("Login required");
      if (!location) return alert("Select location");

      setUploading(true);

      let cloudUrls = [];

      for (let file of imageFiles) {
        const url = await uploadToCloudinary(file);
        cloudUrls.push(url);
      }

      const requestData = {
        user_email: user.email,
        user_name: user.fullName,

        category: selectedCategory,
        description,

        image_url: cloudUrls[0] || "",

        latitude: location.lat,
        longitude: location.lng,

        location_name: locationName,   // ✅ NEW (IMPORTANT UX FIELD)

        location_link: `https://www.google.com/maps?q=${location.lat},${location.lng}`,

        budget,
        date,
        time,
        note: additionalNotes,
      };

      const response = await fetch("http://localhost:8000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Request posted successfully");
        navigate("/customer-dashboard");
      } else {
        alert(data.detail || "Error");
      }
    } catch (err) {
      console.error(err);
      alert("Upload or server error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b px-8 py-6">
        <Link to="/customer-dashboard" className="text-blue-600 flex gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold">Post Service Request</h1>
      </header>

      <main className="px-8 py-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CATEGORY */}
          <div>
            <label className="font-semibold mb-2 block">Category</label>

            <div className="flex gap-3 flex-wrap">
              {categories.map((cat) => {
                const Icon = cat.icon;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex gap-2 px-4 py-2 rounded-xl border ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            className="w-full border p-3 rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* IMAGES */}
          <input type="file" multiple onChange={handleImageUpload} />

          <div className="flex gap-2 mt-2">
            {imagePreview.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>

          {/* LOCATION NAME (NEW UX FIELD) */}
          <input
            className="w-full border p-3 rounded-xl"
            value={locationName}
            readOnly
            placeholder="Click map to select location"
          />

          {/* MAP */}
          <div className="h-64">
            <MapContainer
              center={[31.5204, 74.3587]}
              zoom={12}
              className="h-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <LocationPicker
                setLocation={setLocation}
                setLocationName={setLocationName}
              />
            </MapContainer>
          </div>

          {/* REST SAME */}
          <input
            className="w-full border p-3 rounded-xl"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
          />

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

          <textarea
            className="w-full border p-3 rounded-xl"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Notes"
          />

          <button
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {uploading ? "Uploading..." : "Post Request"}
          </button>
        </form>
      </main>
    </div>
  );
}