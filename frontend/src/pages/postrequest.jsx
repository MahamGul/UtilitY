// import { Link, useNavigate } from "react-router-dom";
// import { useState, useCallback } from "react";
// import {
//   ArrowLeft,
//   Wrench,
//   Droplet,
//   Zap,
//   Car,
//   Hammer,
//   Upload,
//   Check,
//   ChevronDown,
//   X,
//   Calendar,
//   Clock,
//   MapPin,
// } from "lucide-react";

// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// const categories = [
//   { id: "plumbing", name: "Plumbing", icon: Droplet },
//   { id: "electrical", name: "Electrical", icon: Zap },
//   { id: "mechanical", name: "Mechanical", icon: Car },
//   { id: "carpentry", name: "Carpentry", icon: Hammer },
//   { id: "general", name: "General Repair", icon: Wrench },
// ];

// const containerStyle = {
//   width: "100%",
//   height: "300px",
// };

// const defaultCenter = {
//   lat: 24.8607,
//   lng: 67.0011, // Default to Karachi
// };

// export function PostRequestPage() {
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [budget, setBudget] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [additionalNotes, setAdditionalNotes] = useState("");

//   const [markerPosition, setMarkerPosition] = useState(defaultCenter);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // replace with your key
//   });

//   const handleImageUpload = (e) => {
//     const files = e.target.files;
//     if (files) {
//       const newImages = Array.from(files).map((file) => ({
//         url: URL.createObjectURL(file),
//         name: file.name,
//       }));
//       setUploadedImages([...uploadedImages, ...newImages]);
//     }
//   };

//   const removeImage = (index) => {
//     setUploadedImages(uploadedImages.filter((_, i) => i !== index));
//   };

//   const handleLocationChange = (e) => {
//     setLocation(e.target.value);
//     // Optional: You could use Google Maps Geocoding API to get lat/lng
//     // For now, marker stays at default
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Submit form data here
//     navigate("/customer-dashboard");
//   };

//   const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);
//   const CategoryIcon = selectedCategoryData?.icon;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200 px-8 py-6">
//         <div className="max-w-4xl mx-auto">
//           <Link
//             to="/customer-dashboard"
//             className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Dashboard
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900">Post New Service Request</h1>
//           <p className="text-gray-500 mt-2">
//             Fill in the details below to get offers from verified professionals
//           </p>
//         </div>
//       </header>

//       <main className="px-8 py-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Category */}
//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-gray-900">
//                   Select Service Category *
//                 </label>
//                 <div className="relative">
//                   <button
//                     type="button"
//                     className="w-full h-14 px-4 bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-600 transition-colors"
//                     onClick={(e) => {
//                       const menu = e.currentTarget.nextElementSibling;
//                       menu?.classList.toggle("hidden");
//                     }}
//                   >
//                     {selectedCategory ? (
//                       <div className="flex items-center gap-3">
//                         {CategoryIcon && <CategoryIcon className="w-5 h-5 text-blue-600" />}
//                         <span className="font-medium text-gray-900">
//                           {selectedCategoryData?.name}
//                         </span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-400">Choose a category</span>
//                     )}
//                     <ChevronDown className="w-5 h-5 text-gray-400" />
//                   </button>

//                   <div className="hidden absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
//                     {categories.map((category) => {
//                       const Icon = category.icon;
//                       return (
//                         <button
//                           key={category.id}
//                           type="button"
//                           className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
//                           onClick={(e) => {
//                             setSelectedCategory(category.id);
//                             e.currentTarget.parentElement?.classList.add("hidden");
//                           }}
//                         >
//                           <Icon className="w-5 h-5 text-blue-600" />
//                           <span className="font-medium text-gray-900">{category.name}</span>
//                           {selectedCategory === category.id && (
//                             <Check className="w-5 h-5 text-blue-600 ml-auto" />
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-gray-900">Description *</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Describe the work you need done..."
//                   className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
//                   rows={4}
//                 />
//               </div>

//               {/* Upload Images */}
//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   Upload Images
//                   <Upload className="w-5 h-5 text-gray-500" />
//                 </label>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
//                 />
//                 {uploadedImages.length > 0 && (
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     {uploadedImages.map((img, index) => (
//                       <div key={index} className="relative w-24 h-24 border rounded-xl overflow-hidden">
//                         <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
//                         >
//                           <X className="w-4 h-4 text-red-500" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Location + Map */}
//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   Location *
//                   <MapPin className="w-5 h-5 text-gray-500" />
//                 </label>
//                 <input
//                   value={location}
//                   onChange={handleLocationChange}
//                   placeholder="Enter your location"
//                   className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 />

//                 {isLoaded && (
//                   <GoogleMap
//                     mapContainerStyle={containerStyle}
//                     center={markerPosition}
//                     zoom={12}
//                     onClick={(e) =>
//                       setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
//                     }
//                   >
//                     <Marker position={markerPosition} />
//                   </GoogleMap>
//                 )}
//               </div>

//               {/* Budget, Date, Time, Additional Notes */}
//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-gray-900">Budget (Rs.)</label>
//                 <input
//                   value={budget}
//                   onChange={(e) => setBudget(e.target.value)}
//                   placeholder="E.g., 3000 - 5000"
//                   className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-3">
//                   <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     Select Date
//                     <Calendar className="w-5 h-5 text-gray-500" />
//                   </label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     Select Time
//                     <Clock className="w-5 h-5 text-gray-500" />
//                   </label>
//                   <input
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-gray-900">Additional Notes</label>
//                 <textarea
//                   value={additionalNotes}
//                   onChange={(e) => setAdditionalNotes(e.target.value)}
//                   placeholder="Add any extra details or instructions..."
//                   className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
//                   rows={3}
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
//                 >
//                   Submit Request
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }






// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { ArrowLeft, Droplet, Zap, Car, Hammer, Wrench, Check } from "lucide-react";

// // Leaflet imports
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix default marker icon issue in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Categories for service request
// const categories = [
//   { id: "plumbing", name: "Plumbing", icon: Droplet },
//   { id: "electrical", name: "Electrical", icon: Zap },
//   { id: "mechanical", name: "Mechanical", icon: Car },
//   { id: "carpentry", name: "Carpentry", icon: Hammer },
//   { id: "general", name: "General Repair", icon: Wrench },
// ];

// // Leaflet interactive marker component
// function LocationPicker({ location, setLocation }) {
//   const [marker, setMarker] = useState(location);

//   useMapEvents({
//     click(e) {
//       setMarker(e.latlng);
//       setLocation(`${e.latlng.lat}, ${e.latlng.lng}`);
//     }
//   });

//   return marker ? <Marker position={marker} /> : null;
// }

// export function PostRequestPage() {
//   const navigate = useNavigate();

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState(null);
//   const [budget, setBudget] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [additionalNotes, setAdditionalNotes] = useState("");

//   const handleImageUpload = (e) => {
//     const files = e.target.files;
//     if (files) {
//       const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
//       setUploadedImages([...uploadedImages, ...newImages]);
//     }
//   };

//   const removeImage = (index) => {
//     setUploadedImages(uploadedImages.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({
//       category: selectedCategory,
//       description,
//       location,
//       budget,
//       date,
//       time,
//       additionalNotes,
//       images: uploadedImages
//     });
//     navigate("/offers"); // Redirect after submission
//   };

//   const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
//   const CategoryIcon = selectedCategoryData?.icon;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b px-8 py-6">
//         <Link to="/customer-dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-2">
//           <ArrowLeft className="w-4 h-4" /> Back to Dashboard
//         </Link>
//         <h1 className="text-3xl font-bold text-gray-900">Post New Service Request</h1>
//         <p className="text-gray-600 mt-1">Fill in the details below to get offers from verified professionals</p>
//       </header>

//       {/* Form */}
//       <main className="px-8 py-8 max-w-4xl mx-auto">
//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* Select Category */}
//           <div>
//             <label className="font-semibold text-gray-900 mb-1 block">Service Category *</label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="w-full border rounded-xl p-3"
//             >
//               <option value="">Select Category</option>
//               {categories.map(cat => (
//                 <option key={cat.id} value={cat.id}>{cat.name}</option>
//               ))}
//             </select>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="font-semibold text-gray-900 mb-1 block">Description *</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Describe the service you need"
//               className="w-full border rounded-xl p-3 resize-none"
//               rows={4}
//             />
//           </div>

//           {/* Upload Images */}
//           <div>
//             <label className="font-semibold text-gray-900 mb-1 block">Upload Images</label>
//             <input type="file" multiple onChange={handleImageUpload} className="mb-2" />
//             <div className="flex gap-2 flex-wrap">
//               {uploadedImages.map((img, i) => (
//                 <div key={i} className="relative">
//                   <img src={img} alt={`upload-${i}`} className="w-24 h-24 object-cover rounded-xl" />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(i)}
//                     className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-800"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Location */}
//           <div>
//             <label className="font-semibold text-gray-900 mb-1 block">Location *</label>
//             <input
//               value={location || ""}
//               onChange={(e) => setLocation(e.target.value)}
//               placeholder="Enter address or click on map"
//               className="w-full border rounded-xl p-3 mb-3"
//             />
//             {/* Leaflet Map */}
//             <div className="h-64 w-full rounded-xl overflow-hidden">
//               <MapContainer center={[24.8607, 67.0011]} zoom={13} className="h-full w-full">
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <LocationPicker location={location} setLocation={setLocation} />
//               </MapContainer>
//             </div>
//             <p className="text-gray-500 mt-1 text-sm">Click on the map to select your location</p>
//           </div>

//           {/* Budget */}
//           <div>
//             <label className="font-semibold text-gray-900 mb-1 block">Budget (Rs.) *</label>
//             <input
//               value={budget}
//               onChange={(e) => setBudget(e.target.value)}
//               placeholder="Enter budget range"
//               className="w-full border rounded-xl p-3"
//             />
//           </div>

//           {/* Date & Time */}
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="font-semibold text-gray-900 mb-1 block">Preferred Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full border rounded-xl p-3"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="font-semibold text-gray-900 mb-1 block">Preferred Time</label>
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className="w-full border rounded-xl p-3"
//               />
//             </div>
//           </div>

//           {/* Additional Notes */}
//           <div>
//             <label className="font-semibold text-gray-900 mb-1 block">Additional Notes</label>
//             <textarea
//               value={additionalNotes}
//               onChange={(e) => setAdditionalNotes(e.target.value)}
//               placeholder="Any extra instructions or details"
//               className="w-full border rounded-xl p-3 resize-none"
//               rows={3}
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
//           >
//             Post Request
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// }










import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Droplet, Zap, Car, Hammer, Wrench, Check } from "lucide-react";

// Leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Categories for service request with icons
const categories = [
  { id: "plumbing", name: "Plumbing", icon: Droplet },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "mechanical", name: "Mechanical", icon: Car },
  { id: "carpentry", name: "Carpentry", icon: Hammer },
  { id: "general", name: "General Repair", icon: Wrench },
];

// Leaflet interactive marker component
function LocationPicker({ location, setLocation }) {
  const [marker, setMarker] = useState(location);

  useMapEvents({
    click(e) {
      setMarker(e.latlng);
      setLocation(`${e.latlng.lat}, ${e.latlng.lng}`);
    }
  });

  return marker ? <Marker position={marker} /> : null;
}

export function PostRequestPage() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      category: selectedCategory,
      description,
      location,
      budget,
      date,
      time,
      additionalNotes,
      images: uploadedImages
    });
    navigate("/customer-dashboard"); // Redirect after submission
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const CategoryIcon = selectedCategoryData?.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-8 py-6">
        <Link to="/customer-dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Post New Service Request</h1>
        <p className="text-gray-600 mt-1">Fill in the details below to get offers from verified professionals</p>
      </header>

      {/* Form */}
      <main className="px-8 py-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Select Category with icons */}
          <div>
            <label className="font-semibold text-gray-900 mb-2 block">Service Category *</label>
            <div className="flex gap-3 flex-wrap">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                      isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-900 border-gray-300"
                    } hover:bg-blue-100 transition-colors`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-gray-900 mb-1 block">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the service you need"
              className="w-full border rounded-xl p-3 resize-none"
              rows={4}
            />
          </div>

          {/* Upload Images */}
          <div>
            <label className="font-semibold text-gray-900 mb-1 block">Upload Images</label>
            <input type="file" multiple onChange={handleImageUpload} className="mb-2" />
            <div className="flex gap-2 flex-wrap">
              {uploadedImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`upload-${i}`} className="w-24 h-24 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="font-semibold text-gray-900 mb-1 block">Location *</label>
            <input
              value={location || ""}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter address or click on map"
              className="w-full border rounded-xl p-3 mb-3"
            />
            <div className="h-64 w-full rounded-xl overflow-hidden">
              <MapContainer center={[24.8607, 67.0011]} zoom={13} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker location={location} setLocation={setLocation} />
              </MapContainer>
            </div>
            <p className="text-gray-500 mt-1 text-sm">Click on the map to select your location</p>
          </div>

          {/* Budget */}
          <div>
            <label className="font-semibold text-gray-900 mb-1 block">Budget (Rs.) *</label>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget range"
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* Date & Time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold text-gray-900 mb-1 block">Preferred Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold text-gray-900 mb-1 block">Preferred Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="font-semibold text-gray-900 mb-1 block">Additional Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any extra instructions or details"
              className="w-full border rounded-xl p-3 resize-none"
              rows={3}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Post Request
          </button>
        </form>
      </main>
    </div>
  );
}