import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  Clock,
  CloudUpload,
  X,
  Download,
  Zap,
  BarChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RecentItem = ({ test, onClick }) => (
  <div
    onClick={() => onClick(test.name)}
    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
    title={`${test.name} — ${test.date}`}
  >
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-white border flex items-center justify-center shadow-sm">
        <FileText className="w-5 h-5 text-gray-500" />
      </div>
      <div className="min-w-0">
        <div className="font-medium text-gray-800 truncate">{test.name}</div>
        <div className="text-sm text-gray-500">{test.date}</div>
      </div>
    </div>
    <div className="text-sm text-green-600 font-medium">Analyze</div>
  </div>
);

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
    <div className="text-xs text-gray-400">{label}</div>
    <div className="text-xl font-semibold text-gray-800">{value}</div>
    {sub && <div className="text-xs text-gray-500">{sub}</div>}
  </div>
);

const Uploads = (props) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [includeBaseline, setIncludeBaseline] = useState(false);
  const [query, setQuery] = useState("");
  const chartRef = useRef(null);
  const inputRef = useRef(null);

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

  const availableTests = [
    { name: "Transformer-A-Unit5.csv", date: "2025-10-10" },
    { name: "TR-B-Phase-R.xml", date: "2025-10-09" },
    { name: "PowerTrans-223.csv", date: "2025-10-08" },
    { name: "LoadTest-01.fra", date: "2025-09-30" },
    { name: "FactoryBaseline.xml", date: "2025-09-15" },
    { name: "FieldSweep-07.csv", date: "2025-08-02" },
  ];

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

  useEffect(() => {
    let t;
    if (analyzing) {
      setProgress(8);
      t = setInterval(() => {
        setProgress((p) => Math.min(98, p + Math.floor(Math.random() * 12)));
      }, 400);
    } else {
      setProgress(0);
    }
    return () => clearInterval(t);
  }, [analyzing]);

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
    setTimeout(() => setProgress(100), 900);
    setTimeout(() => {
      setAnalyzing(false);
      props.setActiveTab("analysis");
    }, 1200);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) triggerAnalysis(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const filteredTests = availableTests.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  // helper for CSV export
  const exportCSV = () => {
    const src = includeBaseline ? fraData : noBaselineData;
    if (!src || src.length === 0) return;
    const rows = src.map((r) => [r.freq, r.magnitude, r.baseline ?? ""].join(","));
    const csv = ["freq,magnitude,baseline", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(uploadedFile && uploadedFile.name) || "fra"}-export.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // export chart PNG - serialize SVG
  const downloadChartPNG = async () => {
    try {
      const svg = chartRef.current?.querySelector("svg");
      if (!svg) return alert("Chart not found");
      
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      
      // add namespaces if missing
      if (!source.match(/xmlns="http:\/\/www.w3.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/xmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      
      // Get SVG dimensions
      const svgRect = svg.getBoundingClientRect();
      const width = Math.ceil(svgRect.width * 2) || 1200;
      const height = Math.ceil(svgRect.height * 2) || 600;
      
      const svg64 = btoa(unescape(encodeURIComponent(source)));
      const img = new Image();
      
      img.onerror = () => {
        console.error("Failed to load SVG image");
        alert("Failed to render chart. Please try again.");
      };
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) return alert("Could not get canvas context");
          
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the image at the proper size
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (!blob) return alert("Failed to create image blob");
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(uploadedFile && uploadedFile.name) || "fra"}-chart.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, "image/png", 1.0);
        } catch (canvasErr) {
          console.error("Canvas error:", canvasErr);
          alert("Failed to process canvas");
        }
      };
      
      img.src = "data:image/svg+xml;base64," + svg64;
    } catch (err) {
      console.error("PNG export error:", err);
      alert("Failed to export chart image: " + err.message);
    }
  };

  const maxMagnitude = Math.max(...fraData.map((d) => d.magnitude), ...noBaselineData.map((d) => d.magnitude));
  const minMagnitude = Math.min(...fraData.map((d) => d.magnitude), ...noBaselineData.map((d) => d.magnitude));

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
                  {tab === "upload" && <Upload className="w-4 h-4 inline mr-2" />}
                  {tab === "analysis" && <Activity className="w-4 h-4 inline mr-2" />}
                  {tab === "recommendations" && <FileText className="w-4 h-4 inline mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Quick upload button */}
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-sm hover:opacity-95"
                onClick={() => inputRef.current && inputRef.current.click()}
              >
                <CloudUpload className="w-4 h-4" />
                Quick Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload tab */}
        {props.activeTab === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100"
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-50 to-white flex items-center justify-center border">
                      <Upload className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Upload FRA Data</h2>
                        <p className="text-gray-500">Drag & drop your FRA file here, or click to browse. Supported: .csv, .xml, .fra, .bin</p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">Max 50MB</div>
                        <div className="text-xs text-gray-400">Recommended: include baseline file</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <input
                        ref={inputRef}
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".csv,.xml,.bin,.fra"
                      />

                      <label
                        htmlFor="file-upload"
                        onClick={() => inputRef.current && inputRef.current.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Browse Files</span>
                      </label>

                      <button
                        onClick={() => handleTestClick("TR-B-Phase-R.xml")}
                        className="px-3 py-2 text-sm bg-gray-50 border rounded-lg hover:bg-gray-100"
                      >
                        Use Sample Baseline
                      </button>

                      <div className="ml-auto text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Last scanned: <span className="font-medium text-gray-700">2025-10-10</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      {analyzing ? (
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 shadow-inner" style={{ width: `${progress}%` }} />
                        </div>
                      ) : uploadedFile ? (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <div className="font-medium text-gray-800">{uploadedFile.name}</div>
                            <div className="text-sm text-gray-500">Ready for analysis</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No file selected</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">Quick Tests</h4>
                  <p className="text-sm text-gray-500">Run example files to preview how the analysis looks.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleTestClick("Transformer-A-Unit5.csv")} className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-50">Transformer-A</button>
                  <button onClick={() => handleTestClick("TR-B-Phase-R.xml")} className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-50">TR-B Baseline</button>
                  <button onClick={() => handleTestClick("PowerTrans-223.csv")} className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-50">PowerTrans</button>
                </div>
              </div>
            </div>

            {/* Right: recent */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-full flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Tests</h3>
                    <p className="text-sm text-gray-500">Tap a file to analyze immediately</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-50 rounded-md">
                      <Search className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 relative">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search recent..."
                    className="w-full pl-3 pr-10 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="absolute right-2 top-2 p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="mt-4 overflow-auto max-h-80 pr-2">
                  {filteredTests.length ? (
                    filteredTests.map((test, idx) => (
                      <RecentItem key={idx} test={test} onClick={handleTestClick} />
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 p-3">No matching tests</div>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tip: Use the search box to quickly find a recent test.
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Analysis tab */}
        {props.activeTab === "analysis" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 grid grid-cols-3 gap-4">
                <StatCard label="Max (dB)" value={Math.max(...fraData.map(d=>d.magnitude), ...noBaselineData.map(d=>d.magnitude))} />
                <StatCard label="Min (dB)" value={Math.min(...fraData.map(d=>d.magnitude), ...noBaselineData.map(d=>d.magnitude))} />
                <StatCard label="AI Confidence" value={`${Math.round(faultDetections.reduce((s,f)=>s+f.confidence,0)/faultDetections.length)}%`} />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button onClick={downloadChartPNG} className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md">
                  <Zap className="w-4 h-4" /> Download PNG
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div ref={chartRef} className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">FRA Spectrum</h3>
                  <div className="text-sm text-gray-500">Log axis · Magnitude (dB)</div>
                </div>

                <div style={{ height: 420 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={!includeBaseline ? noBaselineData : fraData} margin={{ top: 6, right: 20, left: -10, bottom: 6 }}>
                      <defs>
                        <linearGradient id="magGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
                      <XAxis dataKey="freq" scale="log" tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                      <YAxis label={{ value: "Magnitude (dB)", angle: -90, position: "insideLeft" }} domain={[Math.min(...fraData.map(d=>d.magnitude), ...noBaselineData.map(d=>d.magnitude)) - 10, Math.max(...fraData.map(d=>d.magnitude), ...noBaselineData.map(d=>d.magnitude)) + 5]} />
                      <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                      <Legend verticalAlign="top" />

                      <Area type="monotone" dataKey="magnitude" stroke="#3b82f6" strokeWidth={2.5} fill="url(#magGradient)" name="Measured" />
                      {includeBaseline && <Area type="monotone" dataKey="baseline" stroke="#10b981" strokeWidth={2} fill="url(#baseGradient)" name="Baseline" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 text-sm text-gray-500">Tip: use the export buttons to get CSV or PNG for reports.</div>
              </div>

              <aside className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">Insights & Actions</h4>
                <div className="space-y-3">
                  {faultDetections.map((f, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${getSeverityColor(f.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{f.type}</div>
                          <div className="text-xs text-gray-600">{f.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{f.confidence}%</div>
                          <div className="text-xs">Confidence</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs italic">Action: {f.action}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Quick Controls</h5>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center justify-between text-sm">
                      <span>Include baseline</span>
                      <input type="checkbox" checked={includeBaseline} onChange={() => setIncludeBaseline((s) => !s)} className="accent-blue-600" />
                    </label>

                    <label className="flex items-center justify-between text-sm">
                      <span>Show legend</span>
                      <input type="checkbox" checked={true} readOnly className="accent-blue-600 opacity-60" />
                    </label>

                    <button onClick={exportCSV} className="mt-2 flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>

                    <button onClick={downloadChartPNG} className="mt-2 flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md">
                      <Download className="w-4 h-4" /> Download PNG
                    </button>
                  </div>
                </div>
              </aside>
            </div>

            {/* Fault cards */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">Detailed Faults</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {faultDetections.map((fault, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${getSeverityColor(fault.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">{fault.type}</div>
                          <div className="text-sm text-gray-600">{fault.description}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-xl">{fault.confidence}%</div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    </div>

                    <div className="mt-2 text-sm">Recommended action: <strong>{fault.action}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations unchanged */}
        {props.activeTab === "recommendations" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-700 tracking-wide mb-2">⚙️ AI Fault Detection & Insights</h2>
              <p className="text-gray-500">Our AI model has analyzed your FRA data and generated actionable insights below.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-md border border-blue-200 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
                AI Fault Detection Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The system detected slight deviations in mid-frequency response, possibly indicating <strong>inter-turn insulation degradation</strong> or <strong>core looseness</strong>. These anomalies are consistent with <strong>early-stage mechanical shifts</strong> in windings.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
                Recommendations
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">⚡</div>
                    <h4 className="ml-4 text-lg font-semibold text-gray-800">Perform Partial Discharge (PD) Test</h4>
                  </div>
                  <p className="text-gray-600">Verify insulation condition by performing a PD test. Early discharge detection can prevent insulation failure.</p>
                </div>

                <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">🧲</div>
                    <h4 className="ml-4 text-lg font-semibold text-gray-800">Check Core Clamping</h4>
                  </div>
                  <p className="text-gray-600">Inspect the transformer’s core clamping and ensure all mechanical joints are properly tightened to minimize vibration.</p>
                </div>

                <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">🌡️</div>
                    <h4 className="ml-4 text-lg font-semibold text-gray-800">Monitor Temperature & Load</h4>
                  </div>
                  <p className="text-gray-600">Review historical load and temperature logs. Excessive heat can accelerate insulation aging and cause winding distortion.</p>
                </div>

                <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">🔍</div>
                    <h4 className="ml-4 text-lg font-semibold text-gray-800">Schedule Follow-up FRA Test</h4>
                  </div>
                  <p className="text-gray-600">Perform a comparative FRA after 3 months to track any progressive deviation and confirm fault development trends.</p>
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
