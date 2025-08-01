import React from "react";
import { Loader2, Zap, Sparkles } from "lucide-react";

const ActionButtons = ({
  extractTextFromPDF,
  extractStructuredDataWithGemini,
  pdfFile,
  rawText,
  isLoadingText,
  isLoadingGemini,
}) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
      <button
        onClick={extractTextFromPDF}
        disabled={!pdfFile || isLoadingText}
        className="w-full sm:w-auto min-w-[200px] px-5 py-3 flex items-center justify-center gap-2 rounded-full text-sm bg-gray-400 text-white hover:bg-gray-500 disabled:opacity-50 transition text-center">
        {isLoadingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {isLoadingText ? "Extracting..." : "Extract Raw Text"}
      </button>

      {rawText && (
        <button
          onClick={() => extractStructuredDataWithGemini(rawText)}
          disabled={isLoadingGemini}
          className="w-full sm:w-auto min-w-[220px] px-5 py-3 flex items-center justify-center gap-2 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition text-center">
          {isLoadingGemini ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isLoadingGemini ? "Extracting..." : "Extract Structured Data"}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
