import { useState } from "react";
import FileUpload from "./Components/FileUpload.jsx";
import ActionButtons from "./Components/ActionButtons.jsx";
import RawTextViewer from "./Components/RawTextViewer.jsx";
import StructuredDataViewer from "./Components/StructuredDataViewer.jsx";
import { extractStructuredDataFromGemini } from "./utils/gemini.jsx";
import { generateStructuredPDF } from "./utils/generatePdf";

export default function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [structuredData, setStructuredData] = useState(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [error, setError] = useState("");

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
            .join("")
            .replace(/\s{2,}/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\n\s+/g, "\n");
          fullText += `Page ${i}:\n${text}\n\n`;
        }

        setRawText(fullText);
        setIsLoadingText(false);
      };
    } catch (err) {
      console.log(err);
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

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📄 PDF Data Extractor</h1>

      <FileUpload
        handleFileChange={handleFileChange}
        pdfFile={pdfFile}
        handleRemoveFile={handleRemoveFile}
      />

      <ActionButtons
        extractTextFromPDF={extractTextFromPDF}
        extractStructuredDataWithGemini={extractStructuredDataWithGemini}
        pdfFile={pdfFile}
        rawText={rawText}
        isLoadingText={isLoadingText}
        isLoadingGemini={isLoadingGemini}
      />

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <RawTextViewer rawText={rawText} />
      <StructuredDataViewer structuredData={structuredData} />
      {structuredData && (
        <button
          onClick={() => generateStructuredPDF(structuredData)}
          className="mt-4 px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
          Download PDF Summary
        </button>
      )}
    </div>
  );
}
