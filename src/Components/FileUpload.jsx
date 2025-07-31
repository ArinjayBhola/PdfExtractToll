import { UploadCloud, XCircle } from "lucide-react";
import { useState } from "react";

const FileUpload = ({ handleFileChange, handleRemoveFile, pdfFile }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleFileChange({ target: { files: [file] } });
    }
  };

  return (
    <div className="mb-6 w-full">
      <h2 className="text-gray-700 font-medium mb-2 text-base sm:text-lg">Upload PDF</h2>

      <label
        htmlFor="file-upload"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full cursor-pointer border-2 border-dashed rounded-lg px-4 py-8 sm:px-8 flex flex-col items-center justify-center text-center transition duration-200
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:border-blue-500"}`}>
        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
        <span className="text-blue-600 font-medium">Upload a file</span> or drag and drop
        <p className="text-xs text-gray-400 mt-1">PDF up to 10MB</p>
        <input
          type="file"
          id="file-upload"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {pdfFile && (
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-green-50 border border-green-200 rounded px-4 py-2">
          <p className="text-sm text-green-600 break-words truncate w-full">Selected file: {pdfFile.name}</p>
          <button
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700 transition self-start sm:self-auto"
            title="Remove file">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
