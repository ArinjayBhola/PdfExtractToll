const StructuredDataViewer = ({ structuredData }) => {
  if (!structuredData) return null;

  return (
    <div className="mt-6 p-4 bg-white border rounded text-sm shadow">
      <h3 className="font-semibold mb-2 text-gray-800">Structured Data:</h3>
      <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(structuredData, null, 2)}</pre>
    </div>
  );
};

export default StructuredDataViewer;
