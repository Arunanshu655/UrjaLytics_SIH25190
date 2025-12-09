import React, { useState, useRef, useEffect } from "react";
import { Upload, Activity, FileText, Search, X, Clock } from "lucide-react";
import UploadTab from "./UploadTab";
import AnalysisTab from "./AnalysisTab";
import RecommendationsTab from "./RecommendationsTab";
import { useCSVUpload } from "../hooks/useCSVUpload";

/**
 * Refactored Uploads Component
 * Uses modular sub-components and custom hooks for CSV handling
 */
const Uploads = (props) => {
  // CSV upload states from custom hook
  const {
    csvFiles,
    csvData,
    zoomRange,
    handleCSVUpload,
    removeCSVFile,
    resetZoom,
  } = useCSVUpload();

  // UI states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState("");
  const [chartHeight, setChartHeight] = useState(420);
  const [transformerId, setTransformerId] = useState("");
  const [transformerMake, setTransformerMake] = useState("");
  const [primaryVoltageRating, setPrimaryVoltageRating] = useState("");
  const [secondaryVoltageRating, setSecondaryVoltageRating] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [fileType, setFileType] = useState("");
  const [confirmUpload, setConfirmUpload] = useState(false);
  const inputRef = useRef(null);

  // Available test files for quick access
  const availableTests = [
    { name: "Transformer-A-Unit5.csv", date: "2025-10-10" },
    { name: "TR-B-Phase-R.xml", date: "2025-10-09" },
    { name: "PowerTrans-223.csv", date: "2025-10-08" },
    { name: "LoadTest-01.fra", date: "2025-09-30" },
    { name: "FactoryBaseline.xml", date: "2025-09-15" },
    { name: "FieldSweep-07.csv", date: "2025-08-02" },
  ];

  const filteredTests = availableTests.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  // Handle progress bar simulation
  useEffect(() => {
    let interval;
    if (analyzing) {
      setProgress(8);
      interval = setInterval(() => {
        setProgress((p) => Math.min(98, p + Math.floor(Math.random() * 12)));
      }, 400);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  // Analyze CSV data
  const analyzeCSVData = () => {
    if (csvData.length === 0) {
      alert("Please upload at least one CSV file");
      return;
    }
    setAnalyzing(true);
    setTimeout(() => setProgress(100), 900);
    setTimeout(() => {
      setAnalyzing(false);
      props.setActiveTab("analysis");
    }, 1200);
  };

  // Handle file upload from browser
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!fileType) {
        const name = file.name.toLowerCase();
        if (name.endsWith(".xml")) setFileType("xml");
        else if (name.endsWith(".bin")) setFileType("bin");
        else if (name.endsWith(".pdf")) setFileType("prfa");
      }
    }
  };

  // Handle drag and drop
  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!fileType) {
        const name = file.name.toLowerCase();
        if (name.endsWith(".xml")) setFileType("xml");
        else if (name.endsWith(".bin")) setFileType("bin");
        else if (name.endsWith(".pdf")) setFileType("prfa");
      }
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Handle test click from recent tests
  const handleTestClick = (fileName) => {
    setTransformerId(fileName.split("-")[0] || "Sample");
    setUploadDate("2025-10-10");
    setFileType(fileName.split(".").pop());
    setUploadedFile({ name: fileName });
    setConfirmUpload(true);
    setTimeout(() => analyzeCSVData(), 200);
  };

  // Handle upload form submission
  const handleUploadSubmit = () => {
    if (!transformerId || !fileType || !confirmUpload) {
      return;
    }

    const fileObj =
      uploadedFile ||
      new File(
        [""],
        `${transformerId}.${fileType === "prfa" ? "pdf" : fileType}`,
        { type: "application/octet-stream" }
      );

    setUploadedFile(fileObj);
    setAnalyzing(true);
    setProgress(8);
    setTimeout(() => setProgress(100), 900);
    setTimeout(() => {
      setAnalyzing(false);
      props.setActiveTab("analysis");
    }, 1200);
  };

  return (
    <>
      {/* Tabs Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              {["upload", "analysis", "recommendations"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => props.setActiveTab(tab)}
                  className={`py-4 px-3 font-semibold border-b-2 transition-colors rounded-t ${
                    props.activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "upload" && (
                    <Upload className="w-4 h-4 inline mr-2" />
                  )}
                  {tab === "analysis" && (
                    <Activity className="w-4 h-4 inline mr-2" />
                  )}
                  {tab === "recommendations" && (
                    <FileText className="w-4 h-4 inline mr-2" />
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Tab */}
        {props.activeTab === "upload" && (
          <UploadTab
            csvFiles={csvFiles}
            csvData={csvData}
            handleCSVUpload={handleCSVUpload}
            removeCSVFile={removeCSVFile}
            analyzeCSVData={analyzeCSVData}
            onDrop={onDrop}
            onDragOver={onDragOver}
            // Form states
            transformerId={transformerId}
            setTransformerId={setTransformerId}
            transformerMake={transformerMake}
            setTransformerMake={setTransformerMake}
            primaryVoltageRating={primaryVoltageRating}
            setPrimaryVoltageRating={setPrimaryVoltageRating}
            secondaryVoltageRating={secondaryVoltageRating}
            setSecondaryVoltageRating={setSecondaryVoltageRating}
            uploadDate={uploadDate}
            setUploadDate={setUploadDate}
            fileType={fileType}
            setFileType={setFileType}
            confirmUpload={confirmUpload}
            setConfirmUpload={setConfirmUpload}
            uploadedFile={uploadedFile}
            handleUploadSubmit={handleUploadSubmit}
            analyzing={analyzing}
            progress={progress}
            // Recent tests
            filteredTests={filteredTests}
            query={query}
            setQuery={setQuery}
            handleTestClick={handleTestClick}
          />
        )}

        {/* Analysis Tab */}
        {props.activeTab === "analysis" && (
          <AnalysisTab
            csvFiles={csvFiles}
            csvData={csvData}
            chartHeight={chartHeight}
            setChartHeight={setChartHeight}
            zoomRange={zoomRange}
            resetZoom={resetZoom}
          />
        )}

        {/* Recommendations Tab */}
        {props.activeTab === "recommendations" && (
          <RecommendationsTab
            csvData={csvData}
            csvFiles={csvFiles}
            transformerId={transformerId}
          />
        )}
      </div>
    </>
  );
};

export default Uploads;
