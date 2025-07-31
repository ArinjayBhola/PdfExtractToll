import { useState } from "react";

const defaultData = {
  "Hotel Name": "",
  Address: "",
  Contact: "",
  "Booking Date": "",
  "Hotel Confirmation": "",
  "Guest Name": "",
  Adults: "",
  Child: "",
  Rooms: "",
  Nights: "",
  "Check in": "",
  "Check out": "",
  "Room Category": "",
  Inclusions: "",
};

export default function FormInput({ onSubmit }) {
  const [formData, setFormData] = useState(defaultData);

  const requiredFields = [
    "Hotel Name",
    "Hotel Confirmation",
    "Adults",
    "Check in",
    "Check out",
    "Room Category",
    "Nights",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = { ...formData };

    if (!processedData["Booking Date"]) {
      const today = new Date();
      processedData["Booking Date"] = formatDate(today);
    }

    Object.keys(processedData).forEach((key) => {
      if (!processedData[key]) {
        processedData[key] = "N/A";
      }
    });

    const missingRequired = requiredFields.filter((field) => processedData[field] === "N/A");

    if (missingRequired.length > 0) {
      alert(`Please fill in the required fields:\n${missingRequired.join(", ")}`);
      return;
    }

    onSubmit(processedData);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the form?")) {
      setFormData(defaultData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-100 p-4 sm:p-6 rounded-lg shadow w-full">
      <h2 className="sm:col-span-2 text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center sm:text-left">
        🏨 Hotel Booking Form
      </h2>

      {Object.keys(formData).map((key) => (
        <div
          key={key}
          className="flex flex-col">
          <label
            htmlFor={key}
            className="font-medium text-gray-700 mb-1">
            {key}
            {requiredFields.includes(key) && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={`Enter ${key.toLowerCase()}`}
          />
        </div>
      ))}

      <div className="sm:col-span-2 mt-4 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="w-full sm:w-auto flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition">
          Generate PDF
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full sm:w-auto flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition">
          Clear Form
        </button>
      </div>
    </form>
  );
}
