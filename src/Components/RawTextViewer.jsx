import { useState } from "react";

const RawTextViewer = ({ rawText }) => {
  const [showAll, setShowAll] = useState(false);

  if (!rawText) return null;

  const lines = rawText.split("\n");
  const preview = lines.slice(0, 3).join("\n");

  return (
    <div className="mt-6 bg-gray-100 p-4 sm:p-5 rounded-lg shadow-sm text-sm text-gray-700 max-w-full overflow-hidden">
      <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-3">Raw Text Preview</h3>

      <pre
        className={`whitespace-pre-wrap break-words font-mono transition-all duration-300 overflow-y-auto px-2 py-1 rounded border border-gray-200 bg-white shadow-inner ${
          showAll ? "max-h-[400px]" : "max-h-[96px]"
        }`}>
        <code>{showAll ? rawText : preview}</code>
      </pre>

      <div className="text-center mt-3">
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition">
          {showAll ? "Read less ▲" : "Read more ▼"}
        </button>
      </div>
    </div>
  );
};

export default RawTextViewer;
