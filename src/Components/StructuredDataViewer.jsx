import { useState } from "react";

const StructuredDataViewer = ({ structuredData }) => {
  const [showAll, setShowAll] = useState(false);

  if (!structuredData) return null;

  const jsonString = JSON.stringify(structuredData, null, 2);
  const lines = jsonString.split("\n");
  const preview = lines.slice(0, 5).join("\n");

  return (
    <div className="mt-6 p-4 bg-white border rounded text-sm shadow text-gray-700">
      <h3 className="font-semibold mb-2 text-gray-800">Structured Data:</h3>

      <pre
        className={`whitespace-pre-wrap break-words font-mono transition-all duration-300 ${
          showAll ? "max-h-[1000px]" : "max-h-[100px] overflow-hidden"
        }`}>
        {showAll ? jsonString : preview}
      </pre>

      <div className="text-center mt-2">
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-blue-600 hover:underline font-medium text-sm">
          {showAll ? "Read less ▲" : "Read more ▼"}
        </button>
      </div>
    </div>
  );
};

export default StructuredDataViewer;
