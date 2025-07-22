import { UploadCloud } from "lucide-react";

const FileUpload = ({ handleFileChange, pdfFile }) => {
  return (
    <div className="mb-6">
      <h2 className="text-gray-700 font-medium mb-2">Upload PDF</h2>

      <label
        htmlFor="file-upload"
        className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-white hover:border-blue-500 transition duration-200">
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

      {pdfFile && <p className="text-sm text-green-600 mt-2">Selected file: {pdfFile.name}</p>}
    </div>
  );
};

export default FileUpload;
