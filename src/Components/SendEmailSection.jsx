import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function SendEmailSection({ structuredData }) {
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}send-pdf`, {
        structuredData,
        email,
      });

      if (response.data.success) {
        toast.success("Email sent successfully!");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">Send PDF Summary</h2>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient email"
          className="w-full sm:w-96 px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={() => window.generatePDF(structuredData)}
          className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white font-medium rounded-md shadow hover:bg-purple-700 transition">
          Download PDF Summary
        </button>

        <button
          onClick={handleSendEmail}
          disabled={isSendingEmail}
          className={`w-full sm:w-auto px-5 py-2.5 text-white font-medium rounded-md shadow transition
            ${isSendingEmail ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
          {isSendingEmail ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Sending...
            </span>
          ) : (
            "Send PDF via Email"
          )}
        </button>
      </div>
    </div>
  );
}
