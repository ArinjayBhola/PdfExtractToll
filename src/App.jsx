import { useState, useEffect } from "react";
import FileUpload from "./Components/FileUpload.jsx";
import ActionButtons from "./Components/ActionButtons.jsx";
import RawTextViewer from "./Components/RawTextViewer.jsx";
import StructuredDataViewer from "./Components/StructuredDataViewer.jsx";
import FormInput from "./Components/FormInput.jsx";
import PasswordPage from "./Components/PasswordPage.jsx";
import { extractStructuredDataFromGemini } from "./utils/gemini.jsx";
import { generateStructuredPDF } from "./utils/generatePdf";

export default function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [structuredData, setStructuredData] = useState(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (password) => {
    const correctPassword = import.meta.env.VITE_PASSWORD;
    if (password === correctPassword) {
      localStorage.setItem("authenticated", "true");
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    setIsAuthenticated(false);
    setPdfFile(null);
    setRawText("");
    setStructuredData(null);
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setRawText("");
      setStructuredData(null);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setRawText("");
    setStructuredData(null);
    setError("");
  };

  const extractTextFromPDF = async () => {
    if (!pdfFile) return setError("No PDF selected.");
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) return setError("pdf.js is not available.");

    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    setIsLoadingText(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(pdfFile);
      reader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items
            .map((item) => item.str)
            .join(" ")
            .replace(/\s{2,}/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\n\s+/g, "\n");

          fullText += `Page ${i}:\n${text}\n\n`;
        }

        fullText = fullText.replace(
          /(\d{1,2} \w+ \d{4})\s+Check-?in\s+(\d{1,2} \w+ \d{4})\s+Check-?out/i,
          "Check-in: $1\nCheck-out: $2",
        );

        const keywords = [
          "Check-in",
          "Check-out",
          "Room",
          "Confirmation",
          "Includes",
          "Reserved for",
          "Guest Name",
          "Hotel Name",
          "Address",
          "Booking Date",
          "Contact",
        ];
        keywords.forEach((word) => {
          const regex = new RegExp(`\\s*${word}`, "g");
          fullText = fullText.replace(regex, `\n${word}`);
        });

        setRawText(fullText);
        setIsLoadingText(false);
      };
    } catch (err) {
      console.error(err);
      setError("Failed to extract text from PDF.");
      setIsLoadingText(false);
    }
  };

  const extractStructuredDataWithGemini = async (text) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    setIsLoadingGemini(true);
    setError("");

    try {
      const parsed = await extractStructuredDataFromGemini(text, apiKey);
      setStructuredData(parsed);
    } catch (err) {
      console.error("Gemini Error:", err);
      setError("Failed to extract structured data.");
    } finally {
      setIsLoadingGemini(false);
    }
  };

  if (!isAuthenticated) {
    return <PasswordPage onLogin={handleLogin} />;
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-4xl mx-auto font-sans relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition cursor-pointer text-sm sm:text-base">
        Logout
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        📄 PDF Data Extractor
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => setShowForm(false)}
          className={`px-4 py-2 rounded w-full sm:w-auto ${
            !showForm ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}>
          Upload PDF
        </button>
        <button
          onClick={() => setShowForm(true)}
          className={`px-4 py-2 rounded w-full sm:w-auto ${
            showForm ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}>
          Fill Form
        </button>
      </div>

      {showForm ? (
        <div className="animate-fade-in">
          <FormInput onSubmit={(data) => generateStructuredPDF(data)} />
        </div>
      ) : (
        <>
          <FileUpload
            handleFileChange={handleFileChange}
            pdfFile={pdfFile}
            handleRemoveFile={handleRemoveFile}
          />

          <div className="mt-4">
            <ActionButtons
              extractTextFromPDF={extractTextFromPDF}
              extractStructuredDataWithGemini={extractStructuredDataWithGemini}
              pdfFile={pdfFile}
              rawText={rawText}
              isLoadingText={isLoadingText}
              isLoadingGemini={isLoadingGemini}
            />
          </div>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <div className="mt-6 overflow-x-auto">
            <RawTextViewer rawText={rawText} />
          </div>

          <div className="mt-6 overflow-x-auto">
            <StructuredDataViewer structuredData={structuredData} />
          </div>

          {structuredData && (
            <button
              onClick={() => generateStructuredPDF(structuredData)}
              className="mt-6 w-full sm:w-auto px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
              Download PDF Summary
            </button>
          )}
        </>
      )}
    </div>
  );
}
