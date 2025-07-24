import { useState } from "react";

const RawTextViewer = ({ rawText }) => {
  const [showAll, setShowAll] = useState(false);

  if (!rawText) return null;

  const lines = rawText.split("\n");
  const preview = lines.slice(0, 3).join("\n");

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded text-sm text-gray-700">
      <h3 className="font-semibold mb-2 text-gray-800">Raw Text:</h3>

      <pre
        className={`whitespace-pre-wrap break-words font-mono transition-all duration-300 overflow-x-hidden ${
          showAll ? "max-h-[1000px]" : "max-h-[80px]"
        }`}>
        <code className="block">{showAll ? rawText : preview}</code>
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

export default RawTextViewer;
