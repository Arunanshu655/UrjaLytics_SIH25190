import React from "react";
import { Upload, X, CheckCircle } from "lucide-react";

/**
 * UploadTab Component
 * Handles CSV file upload (up to 2 files) and transformer metadata form
 */
const UploadTab = ({
  csvFiles = [],
  csvData = [],
  handleCSVUpload = () => {},
  removeCSVFile = () => {},
  analyzeCSVData = () => {},
  onDrop = () => {},
  onDragOver = () => {},
  // Form state
  transformerId = "",
  setTransformerId = () => {},
  transformerMake = "",
  setTransformerMake = () => {},
  primaryVoltageRating = "",
  setPrimaryVoltageRating = () => {},
  secondaryVoltageRating = "",
  setSecondaryVoltageRating = () => {},
  uploadDate = "",
  setUploadDate = () => {},
  fileType = "",
  setFileType = () => {},
  confirmUpload = false,
  setConfirmUpload = () => {},
  uploadedFile = null,
  handleUploadSubmit = () => {},
  analyzing = false,
  progress = 0,
  // Recent tests
  filteredTests,
  query,
  setQuery,
  handleTestClick,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Main Upload Card */}
        <div
          className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-lg bg-linear-to-br from-blue-50 to-white flex items-center justify-center border">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Upload FRA Data
                  </h2>
                  <p className="text-sm text-gray-500">
                    Upload up to 2 CSV files with frequency and magnitude
                    columns
                  </p>
                </div>
              </div>

              {/* CSV Upload Section */}
              <div className="mt-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV Files (Frequency Response Analysis Data)
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 mb-3">
                  <input
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleCSVUpload}
                    disabled={csvFiles.length >= 2}
                    className="block w-full text-sm text-gray-600 cursor-pointer"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Supports columns: frequency/freq/hz, magnitude/mag/db
                  </p>
                </div>

                {/* File Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {csvFiles.map((file, idx) => (
                    <div
                      key={file.name}
                      className="flex items-center bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-sm text-blue-900"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span className="font-medium">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeCSVFile(idx)}
                        className="ml-2 hover:text-red-600"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {csvFiles.length === 0 && (
                    <span className="text-sm text-gray-500">
                      No files selected
                    </span>
                  )}
                </div>

                {/* Data Summary */}
                {csvData.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      <strong>✓ Loaded:</strong> {csvFiles.length} file(s) •{" "}
                      {csvData.length} data point(s)
                    </p>
                  </div>
                )}

                {/* Analyze Button */}
                {csvFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={analyzeCSVData}
                    className="w-full mb-4 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                  >
                    📊 Analyze & Plot
                  </button>
                )}
              </div>

              {/* Metadata Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Transformer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transformer Serial
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g., TR-B-Phase-R"
                      value={transformerId}
                      onChange={(e) => setTransformerId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturing Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={uploadDate}
                      onChange={(e) => setUploadDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transformer Make
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g., Siemens"
                      value={transformerMake}
                      onChange={(e) => setTransformerMake(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Format
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                    >
                      <option value="">Select format</option>
                      <option value="csv">CSV</option>
                      <option value="xml">XML</option>
                      <option value="bin">BIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Voltage Rating
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g., 220 kV"
                      value={primaryVoltageRating}
                      onChange={(e) => setPrimaryVoltageRating(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Voltage Rating
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g., 33 kV"
                      value={secondaryVoltageRating}
                      onChange={(e) =>
                        setSecondaryVoltageRating(e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Upload Confirmation */}
                <div className="mt-6 flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={confirmUpload}
                      onChange={(e) => setConfirmUpload(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm the uploaded data and metadata are correct
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleUploadSubmit}
                  disabled={!confirmUpload || !transformerId || !fileType}
                  className={`mt-4 w-full px-6 py-3 rounded-lg text-white font-semibold transition-all ${
                    confirmUpload && transformerId && fileType
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  🚀 Upload & Analyze
                </button>

                {/* Progress Bar */}
                {analyzing && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-400 shadow-inner transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Processing {progress}%...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Recent Tests */}
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-fit sticky top-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Recent Tests
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Tap to analyze immediately
          </p>

          <div className="relative mb-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-3 pr-10 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-2 p-1"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filteredTests.length > 0 ? (
              filteredTests.map((test, idx) => (
                <div
                  key={idx}
                  onClick={() => handleTestClick(test.name)}
                  className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-200"
                >
                  <div className="font-medium text-sm text-gray-800 truncate">
                    {test.name}
                  </div>
                  <div className="text-xs text-gray-500">{test.date}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-3 text-center">
                No matching tests
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default UploadTab;
