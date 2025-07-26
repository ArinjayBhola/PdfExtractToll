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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-100 p-6 rounded-lg shadow">
      {Object.keys(formData).map((key) => (
        <div
          key={key}
          className="flex flex-col">
          <label
            htmlFor={key}
            className="font-semibold text-gray-700">
            {key}
          </label>
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="mt-1 p-2 rounded border border-gray-300"
          />
        </div>
      ))}

      <div className="sm:col-span-2 mt-4">
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded">
          Generate PDF
        </button>
      </div>
    </form>
  );
}
