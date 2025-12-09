import { useState } from "react";

/**
 * Custom hook for handling CSV file uploads with semantic column matching and downsampling
 * Supports up to 2 CSV files
 * Automatically detects frequency and magnitude columns (or semantic equivalents)
 * Downsamples large datasets to ~10-30 points for clean graph rendering
 */
export const useCSVUpload = () => {
  const [csvFiles, setCsvFiles] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [zoomRange, setZoomRange] = useState([null, null]);

  /**
   * Parse CSV text with semantic column matching
   * Looks for columns matching: freq/frequency/hz for X-axis
   * Looks for columns matching: mag/magnitude/db for Y-axis
   * Automatically downsamples data if > 30 points to maintain graph readability
   */
  const parseCSVData = (csvText, fileName) => {
    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) throw new Error("CSV file too small");

      // Semantic header matching
      const headers = lines[0]
        .toLowerCase()
        .split(",")
        .map((h) => h.trim());

      // Acceptable header names for frequency (X-axis)
      const freqHeaders = [
        "freq",
        "frequency",
        "hz",
        "f (hz)",
        "f(hz)",
        "frequency (hz)",
      ];

      // Acceptable header names for magnitude (Y-axis)
      const magHeaders = [
        "mag",
        "magnitude",
        "db",
        "dB",
        "mag(dB)",
        "magnitude(db)",
        "magnitude (db)",
      ];

      const findSemanticIndex = (headerList) => {
        for (let i = 0; i < headers.length; i++) {
          for (let h of headerList) {
            if (headers[i].includes(h.toLowerCase())) return i;
          }
        }
        return -1;
      };

      const freqIndex = findSemanticIndex(freqHeaders);
      const magIndex = findSemanticIndex(magHeaders);

      if (freqIndex === -1 || magIndex === -1) {
        throw new Error(
          "CSV must contain columns for frequency and magnitude (e.g., 'frequency', 'magnitude', 'hz', 'db')"
        );
      }

      const data = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(",").map((v) => v.trim());
        const freq = parseFloat(values[freqIndex]);
        const mag = parseFloat(values[magIndex]);

        if (!isNaN(freq) && !isNaN(mag)) {
          data.push({ frequency: freq, magnitude: mag, source: fileName });
        }
      }

      if (data.length === 0) throw new Error("No valid data points found");

      // Sort by frequency
      data.sort((a, b) => a.frequency - b.frequency);

      // Detect and normalize magnitude scale if needed
      // If magnitudes are > 1000 and look like raw integers, they're likely incorrectly parsed
      const magnitudes = data.map((d) => d.magnitude).filter((m) => !isNaN(m));
      const maxMag = Math.max(...magnitudes);
      const minMag = Math.min(...magnitudes);

      // If range is unusually large (> 10000), likely a data format issue
      if (maxMag > 10000 && minMag > 0) {
        console.warn(
          `Warning: Magnitudes in ${fileName} have unusual range (${minMag}-${maxMag}). Data may need verification.`
        );
      }

      // Intelligent downsampling algorithm
      // Keep data points evenly distributed across the frequency range
      // Ensures minimum of 10 points, maximum of 30 for optimal visualization
      const downsampled = intelligentDownsample(data, 10, 30);

      return downsampled;
    } catch (error) {
      alert(`Error parsing ${fileName}: ${error.message}`);
      return [];
    }
  };

  /**
   * Intelligent downsampling algorithm
   * Ensures data is evenly distributed across the frequency range
   * @param {Array} data - Array of {freq, magnitude, source} objects
   * @param {number} minPoints - Minimum points to keep (default 10)
   * @param {number} maxPoints - Maximum points to keep (default 30)
   * @returns {Array} Downsampled data
   */
  const intelligentDownsample = (data, minPoints = 10, maxPoints = 30) => {
    if (data.length <= maxPoints) {
      return data; // Data is already small enough
    }

    const result = [];
    const step = Math.ceil(data.length / maxPoints);

    // Always include first point
    result.push(data[0]);

    // Add evenly spaced points
    for (let i = step; i < data.length - 1; i += step) {
      result.push(data[i]);
    }

    // Always include last point
    if (result[result.length - 1] !== data[data.length - 1]) {
      result.push(data[data.length - 1]);
    }

    // Ensure minimum points
    if (result.length < minPoints) {
      // If we still have too few points, add more evenly spaced ones
      const needed = minPoints - result.length;
      const indicesToAdd = [];
      for (let i = 0; i < needed; i++) {
        const idx = Math.floor(((i + 1) * data.length) / (needed + 2));
        if (!result.find((p) => p === data[idx])) {
          indicesToAdd.push(idx);
        }
      }
      indicesToAdd.forEach((idx) => result.push(data[idx]));
      result.sort((a, b) => a.freq - b.freq);
    }

    return result;
  };

  /**
   * Handle multiple CSV file uploads
   * Validates max 2 files, reads and parses them
   */
  const handleCSVUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;
    if (csvFiles.length + files.length > 2) {
      alert(
        "Maximum 2 CSV files allowed. Please remove one before adding another."
      );
      return;
    }

    const newCsvFiles = [...csvFiles];
    const newCsvData = [...csvData];
    let filesProcessed = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          const parsed = parseCSVData(text, file.name);
          if (parsed.length > 0) {
            newCsvFiles.push(file);
            newCsvData.push(...parsed);
            filesProcessed++;

            // Update state after all files are processed
            if (filesProcessed === files.length) {
              setCsvFiles(newCsvFiles);
              setCsvData(newCsvData);
            }
          }
        }
      };
      reader.readAsText(file);
    });
  };

  /**
   * Remove a CSV file by index and its associated data
   */
  const removeCSVFile = (index) => {
    const fileToRemove = csvFiles[index];
    setCsvFiles(csvFiles.filter((_, i) => i !== index));
    setCsvData(csvData.filter((d) => d.source !== fileToRemove.name));
    setZoomRange([null, null]);
  };

  /**
   * Reset zoom to show full data range
   */
  const resetZoom = () => {
    setZoomRange([null, null]);
  };

  return {
    csvFiles,
    csvData,
    zoomRange,
    handleCSVUpload,
    removeCSVFile,
    resetZoom,
    parseCSVData,
  };
};
