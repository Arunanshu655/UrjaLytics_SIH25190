import React, { useState } from "react";
import {
  Upload,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  Database,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Uploads = (props) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [includeBaseline, setIncludeBaseline] = useState(false);

  // FRA data
  const fraData = [
    { freq: 20, magnitude: -45, baseline: -46 },
    { freq: 50, magnitude: -42, baseline: -45 },
    { freq: 100, magnitude: -38, baseline: -44 },
    { freq: 200, magnitude: -35, baseline: -38 },
    { freq: 500, magnitude: -40, baseline: -40 },
    { freq: 1000, magnitude: -48, baseline: -47 },
    { freq: 2000, magnitude: -55, baseline: -54 },
    { freq: 5000, magnitude: -62, baseline: -61 },
    { freq: 10000, magnitude: -68, baseline: -67 },
    { freq: 20000, magnitude: -72, baseline: -70 },
    { freq: 50000, magnitude: -78, baseline: -76 },
    { freq: 100000, magnitude: -82, baseline: -80 },
  ];
 
  const noBaselineData = [
  { freq: 20, magnitude: -47 },
  { freq: 50, magnitude: -43 },
  { freq: 100, magnitude: -39 },
  { freq: 200, magnitude: -37 },
  { freq: 500, magnitude: -46 },
  { freq: 1000, magnitude: -56 },
  { freq: 2000, magnitude: -64 },
  { freq: 5000, magnitude: -72 },
  { freq: 10000, magnitude: -78 },
  { freq: 20000, magnitude: -82 },
  { freq: 50000, magnitude: -86 },
  { freq: 100000, magnitude: -90 },
];
  // Dynamic fault detections
  const faultDetections = includeBaseline
    ? [
        {
          type: "Axial Displacement",
          severity: "High",
          confidence: 89,
          description: "Detected winding shift relative to baseline reference",
          action: "Immediate internal inspection required",
        },
        {
          type: "Core Loosening",
          severity: "Medium",
          confidence: 64,
          description: "Deviation in mid-frequency zone indicates core vibration",
          action: "Tighten core bolts during maintenance",
        },
      ]
    : [
        {
          type: "Radial Deformation",
          severity: "Medium",
          confidence: 68,
          description: "Possible winding buckling in FRA trace",
          action: "Schedule inspection within next maintenance cycle",
        },
        {
          type: "Tap Changer Irregularity",
          severity: "Low",
          confidence: 48,
          description: "Minor variation near 100Hz zone",
          action: "Monitor performance, check tap alignment",
        },
      ];

  // Dynamic recommendations
  const recommendations = includeBaseline
    ? [
        "Baseline comparison shows significant deviation — perform visual inspection of windings.",
        "High-frequency drop (>5dB) suggests possible axial movement; schedule dielectric test.",
        "Run DGA to confirm mechanical stress correlation with FRA anomaly.",
      ]
    : [
        "No baseline data found — only pattern-based FRA analysis performed.",
        "Slight resonance shift detected; monitor transformer over next 30 days.",
        "Consider obtaining baseline FRA data for more accurate diagnostics.",
      ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) triggerAnalysis(file);
  };

  const handleTestClick = (fileName) => {
    const file = { name: fileName };
    triggerAnalysis(file);
  };

  const triggerAnalysis = (file) => {
    setUploadedFile(file);
    setIncludeBaseline(file.name === "TR-B-Phase-R.xml");
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      props.setActiveTab("analysis");
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {["upload", "analysis", "recommendations"].map((tab) => (
              <button
                key={tab}
                onClick={() => props.setActiveTab(tab)}
                className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Tab */}
        {props.activeTab === "upload" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Upload FRA Data
              </h2>

              <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors bg-gray-50">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".csv,.xml,.bin,.fra"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Drop FRA file here or click to browse
                  </p>
                  <p className="text-gray-500">Maximum file size: 50MB</p>
                </label>
              </div>

              {analyzing && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-900 font-medium">
                      Analyzing FRA signature with AI models...
                    </span>
                  </div>
                </div>
              )}

              {uploadedFile && !analyzing && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-900 font-medium">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <span className="text-green-700 text-sm">
                      Ready for analysis
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Tests */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Recent Tests
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Transformer-A-Unit5.csv", date: "2025-10-10" },
                  { name: "TR-B-Phase-R.xml", date: "2025-10-09" },
                  { name: "PowerTrans-223.csv", date: "2025-10-08" },
                ].map((test, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTestClick(test.name)}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {test.name}
                        </div>
                        <div className="text-sm text-gray-500">{test.date}</div>
                      </div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      Tap to Analyze
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {props.activeTab === "analysis" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Frequency Response Analysis
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={!includeBaseline? noBaselineData : fraData}>
                  <defs>
                    <linearGradient id="magGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="freq"
                    label={{
                      value: "Frequency (Hz)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    scale="log"
                  />
                  <YAxis
                    label={{
                      value: "Magnitude (dB)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="magnitude"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#magGradient)"
                    name="Measured FRA"
                  />
                  {includeBaseline && (
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#baseGradient)"
                      name="Baseline"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Faults */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                AI Fault Detection
              </h2>
              <div className="grid gap-4">
                {faultDetections.map((fault, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-lg border-2 ${getSeverityColor(
                      fault.severity
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6" />
                        <div>
                          <h3 className="font-bold text-lg">{fault.type}</h3>
                          <p className="text-sm opacity-80">
                            {fault.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {fault.confidence}%
                        </div>
                        <div className="text-xs opacity-75">Confidence</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-current opacity-30"></div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        Severity: {fault.severity}
                      </span>
                      <span className="text-sm italic">{fault.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {props.activeTab === 'recommendations' && (
  <div className="space-y-8 animate-fadeIn">
    {/* Section Title */}
    <div className="text-center">
      <h2 className="text-3xl font-bold text-blue-700 tracking-wide mb-2">
        ⚙️ AI Fault Detection & Insights
      </h2>
      <p className="text-gray-500">
        Our AI model has analyzed your FRA data and generated actionable insights below.
      </p>
    </div>

    {/* Fault Detection Summary */}
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-md border border-blue-200 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
        AI Fault Detection Summary
      </h3>
      <p className="text-gray-700 leading-relaxed">
        The system detected slight deviations in mid-frequency response, possibly indicating **inter-turn insulation degradation** or **core looseness**.
        These anomalies are consistent with **early-stage mechanical shifts** in windings.
      </p>
    </div>

    {/* Recommendations */}
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
        Recommendations
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h4 className="ml-4 text-lg font-semibold text-gray-800">
              Perform Partial Discharge (PD) Test
            </h4>
          </div>
          <p className="text-gray-600">
            Verify insulation condition by performing a PD test. Early discharge detection can prevent insulation failure.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
              🧲
            </div>
            <h4 className="ml-4 text-lg font-semibold text-gray-800">
              Check Core Clamping
            </h4>
          </div>
          <p className="text-gray-600">
            Inspect the transformer’s core clamping and ensure all mechanical joints are properly tightened to minimize vibration.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
              🌡️
            </div>
            <h4 className="ml-4 text-lg font-semibold text-gray-800">
              Monitor Temperature & Load
            </h4>
          </div>
          <p className="text-gray-600">
            Review historical load and temperature logs. Excessive heat can accelerate insulation aging and cause winding distortion.
          </p>
        </div>

        {/* Card 4 */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h4 className="ml-4 text-lg font-semibold text-gray-800">
              Schedule Follow-up FRA Test
            </h4>
          </div>
          <p className="text-gray-600">
            Perform a comparative FRA after 3 months to track any progressive deviation and confirm fault development trends.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default Uploads;
