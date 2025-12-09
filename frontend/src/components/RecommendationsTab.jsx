import React, { useState, useEffect } from "react";
import {
  Brain,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Zap,
} from "lucide-react";

/**
 * RecommendationsTab Component
 * Displays AI-powered recommendations based on FRA analysis
 */
const RecommendationsTab = ({
  csvData = [],
  csvFiles = [],
  transformerId = "",
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState("low");

  useEffect(() => {
    if (!csvData || csvData.length === 0) return;

    // Simulate AI analysis
    setLoading(true);
    setTimeout(() => {
      const recs = generateRecommendations();
      setRecommendations(recs);
      setLoading(false);
    }, 1000);
  }, [csvData, csvFiles]);

  const generateRecommendations = () => {
    if (!csvData || csvData.length === 0) return [];

    const magnitudes = (csvData || [])
      .map((d) => (d && typeof d.magnitude === "number" ? d.magnitude : 0))
      .filter((m) => m !== 0);

    if (magnitudes.length === 0) return [];

    const avgMag = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    const maxMag = Math.max(...magnitudes);
    const minMag = Math.min(...magnitudes);
    const range = maxMag - minMag;

    const recs = [];

    // Rule-based recommendations
    if (range > 20) {
      recs.push({
        severity: "high",
        title: "Large Magnitude Variation Detected",
        description: `Magnitude variation of ${range.toFixed(
          2
        )} dB detected. This may indicate winding deformations or core issues.`,
        action:
          "Schedule detailed mechanical assessment and core loss measurements.",
        icon: AlertCircle,
      });
      setRiskLevel("high");
    } else if (range > 10) {
      recs.push({
        severity: "medium",
        title: "Moderate Magnitude Variation",
        description: `Magnitude variation of ${range.toFixed(
          2
        )} dB observed. Monitor trends over time.`,
        action:
          "Continue regular monitoring and establish baseline for comparison.",
        icon: AlertCircle,
      });
      setRiskLevel("medium");
    } else {
      recs.push({
        severity: "low",
        title: "Healthy Response Profile",
        description: `Magnitude variation of ${range.toFixed(
          2
        )} dB indicates normal transformer condition.`,
        action: "Continue routine maintenance schedule.",
        icon: CheckCircle,
      });
      setRiskLevel("low");
    }

    if (csvFiles.length === 2) {
      recs.push({
        severity: "info",
        title: "Two-File Comparison Available",
        description:
          "You have uploaded two FRA datasets for comparison analysis.",
        action: "Review the Analysis tab for detailed comparative statistics.",
        icon: TrendingDown,
      });
    }

    if (avgMag > 5) {
      recs.push({
        severity: "medium",
        title: "High Average Magnitude Level",
        description: `Average magnitude of ${avgMag.toFixed(
          2
        )} dB is elevated.`,
        action: "Verify measurement setup and compare against historical data.",
        icon: Zap,
      });
    }

    return recs;
  };

  const severityConfig = {
    high: {
      color: "red",
      icon: AlertCircle,
      bg: "bg-red-50",
      border: "border-red-200",
    },
    medium: {
      color: "amber",
      icon: AlertCircle,
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    low: {
      color: "green",
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border-green-200",
    },
    info: {
      color: "blue",
      icon: TrendingDown,
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
  };

  return (
    <div className="space-y-6">
      {/* Risk Level Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Analysis Report
            </h2>
            <p className="text-gray-600 text-sm">
              {transformerId
                ? `Transformer: ${transformerId}`
                : "FRA Analysis Results"}
            </p>
          </div>
        </div>

        {/* Risk Level Indicator */}
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Overall Health Status</p>
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${
                riskLevel === "high"
                  ? "bg-red-500"
                  : riskLevel === "medium"
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
            />
            <span
              className={`text-lg font-semibold capitalize ${
                riskLevel === "high"
                  ? "text-red-600"
                  : riskLevel === "medium"
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              {riskLevel === "high"
                ? "⚠️ At Risk"
                : riskLevel === "medium"
                ? "⚠️ Monitor"
                : "✓ Healthy"}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, idx) => {
            const config = severityConfig[rec.severity];
            const Icon = rec.icon;

            return (
              <div
                key={idx}
                className={`${config.bg} rounded-2xl shadow-md p-6 border ${config.border}`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Icon className={`w-6 h-6 text-${config.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-semibold text-${config.color}-900 mb-1`}
                    >
                      {rec.title}
                    </h3>
                    <p className={`text-sm text-${config.color}-800 mb-3`}>
                      {rec.description}
                    </p>
                    <div className="flex items-start gap-2">
                      <span
                        className={`text-xs font-semibold text-${config.color}-700 mt-1`}
                      >
                        ACTION:
                      </span>
                      <p className={`text-sm text-${config.color}-700`}>
                        {rec.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-1">No data to analyze</p>
            <p className="text-sm text-gray-500">
              Upload CSV files and run analysis to get AI-powered
              recommendations
            </p>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          About These Recommendations
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Based on FRA magnitude and frequency response analysis</li>
          <li>
            • Recommendations follow IEC 60076-18 and IEEE Std 1415 standards
          </li>
          <li>• Always consult with domain experts for critical decisions</li>
          <li>• Historical trend analysis improves recommendation accuracy</li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationsTab;
