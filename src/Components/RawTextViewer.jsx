import React from "react";

const RawTextViewer = ({ rawText }) => {
  if (!rawText) return null;

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm max-h-[300px] overflow-y-auto">
      <h3 className="font-semibold mb-2 text-gray-800">Raw Text:</h3>
      {rawText}
    </div>
  );
};

export default RawTextViewer;
