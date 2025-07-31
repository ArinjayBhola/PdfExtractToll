import { useState } from "react";

export default function PasswordPage({ onLogin }) {
  const [input, setInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onLogin(input);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 sm:px-6">
      <div className="bg-white w-full max-w-sm p-6 sm:p-10 rounded-xl shadow-2xl text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">🔐 Secure Access</h2>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
        />

        <div className="flex items-center justify-start mt-3 text-sm">
          <input
            id="showPassword"
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2 accent-blue-500"
          />
          <label
            htmlFor="showPassword"
            className="text-gray-600">
            Show Password
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 cursor-pointer text-base">
          Login
        </button>
        <p className="mt-4 text-sm text-gray-500">Authorized users only</p>
      </div>
    </div>
  );
}
