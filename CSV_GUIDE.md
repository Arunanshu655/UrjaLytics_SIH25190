# CSV Upload & FRA Analysis Implementation Guide

## Quick Start

### 1. Upload CSV Files

- Navigate to **Upload** tab
- Click "Browse Files" or drag & drop CSV files
- System automatically detects frequency and magnitude columns
- Support for flexible column naming (freq, frequency, hz, mag, magnitude, db, etc.)

### 2. Fill Transformer Information

- Transformer Serial ID (required)
- Manufacturing date
- Transformer make/manufacturer
- Primary & secondary voltage ratings
- File format (CSV/XML/PDF/BIN)

### 3. Analyze

- Click "Upload & Analyze"
- Wait for processing
- Switch to **Analysis** tab to see results

### 4. View Recommendations

- Switch to **Recommendations** tab
- Review AI-powered fault detection insights
- Follow suggested maintenance actions

---

## Downsampling Algorithm Explained

When CSV files have too many rows (> 30 points), the algorithm:

1. **Counts total data points** in CSV
2. **Calculates step size:** `step = ceil(rows / 30)`
3. **Samples every nth point:** Takes row[0], row[step], row[2*step], ..., row[last]
4. **Preserves endpoints:** Always includes first and last data points
5. **Sorts by frequency:** Ensures X-axis is in order

**Example:** 1000-row CSV becomes 33 points (1000/30 = 33.3)

---

## Semantic Column Matching

### Frequency Column Detection

The system looks for these column names (case-insensitive):

- `freq`
- `frequency`
- `hz`
- `f (hz)`
- `f(hz)`
- `frequency (hz)`

### Magnitude Column Detection

The system looks for these column names (case-insensitive):

- `mag`
- `magnitude`
- `db`
- `dB`
- `mag(dB)`
- `magnitude(db)`
- `magnitude (db)`

If exact column names don't exist, semantic matching finds the closest match.

---

## CSV File Format Requirements

### Minimum CSV Structure

```csv
frequency,magnitude
50.0,-45.2
100.0,-42.8
200.0,-38.5
...
```

### Flexible Formats Supported

```csv
freq,mag
Hz,dB
Frequency (Hz),Magnitude (dB)
F(Hz),Mag(dB)
```

### Validation Rules

- ✓ At least 2 rows (header + 1 data row)
- ✓ Frequency must be numeric (Hz)
- ✓ Magnitude must be numeric (dB)
- ✗ No missing frequency/magnitude columns
- ✓ Can have additional columns (ignored)

---

## Two-File Upload Workflow

### Purpose

Compare FRA responses from two different measurements or transformers

### How It Works

1. Upload first CSV (e.g., test_date_1.csv)
2. Upload second CSV (e.g., test_date_2.csv)
3. Both displayed on same chart with different colors
   - **Blue** = First file
   - **Red** = Second file
4. Statistics shown side-by-side
5. Comparative analysis in recommendations

### Example Use Cases

- Before/after maintenance comparison
- Multiple phase measurements (Phase R vs Phase B)
- Baseline vs current measurement
- Different test equipment comparison

---

## Statistics Displayed

For each file, the system calculates:

| Metric           | Purpose                              |
| ---------------- | ------------------------------------ |
| **Data Points**  | Number of samples after downsampling |
| **Freq Min/Max** | Frequency range in Hz                |
| **Mag Min/Max**  | Magnitude range in dB                |
| **Mag Avg**      | Average magnitude value              |
| **Mag Range**    | Max - Min (indicator of anomalies)   |

---

## Risk Assessment Levels

### Healthy (Green)

- **Range:** < 10 dB
- **Action:** Continue routine maintenance
- **Meaning:** Normal transformer condition

### Monitor (Yellow)

- **Range:** 10-20 dB
- **Action:** Continue regular monitoring
- **Meaning:** Minor variations, establish baseline

### At Risk (Red)

- **Range:** > 20 dB
- **Action:** Schedule detailed inspection
- **Meaning:** Possible winding deformations or core issues

---

## File Structure

```
frontend/src/
├── components/
│   ├── Uploads.jsx              # Main container (refactored)
│   ├── UploadTab.jsx            # CSV upload & metadata form
│   ├── AnalysisTab.jsx          # Chart visualization
│   ├── RecommendationsTab.jsx   # AI insights
│   ├── RecentItem.jsx           # Test list item
│   └── StatCard.jsx             # Stat display card
├── hooks/
│   └── useCSVUpload.js          # CSV parsing & downsampling logic
└── ... (other components)
```

---

## Common Issues & Solutions

### Issue: "CSV file too small"

**Solution:** Your CSV has less than 2 rows (needs header + data)

### Issue: "No valid data points found"

**Solution:** Frequency or magnitude columns contain non-numeric values

### Issue: "Maximum 2 CSV files allowed"

**Solution:** Remove one file before uploading another

### Issue: "CSV must contain columns for frequency and magnitude"

**Solution:** Ensure column headers match semantic patterns (freq, magnitude, etc.)

---

## For Developers

### Accessing CSV Hook

```jsx
import { useCSVUpload } from "../hooks/useCSVUpload";

const MyComponent = () => {
  const {
    csvFiles, // File objects
    csvData, // Parsed data points
    zoomRange, // [min, max] zoom
    handleCSVUpload, // File input handler
    removeCSVFile, // Remove by index
    resetZoom, // Reset zoom state
    parseCSVData, // Manual parse function
  } = useCSVUpload();
};
```

### Manual CSV Parsing

```jsx
const { parseCSVData } = useCSVUpload();
const parsed = parseCSVData(csvText, "myfile.csv");
// Returns: [{frequency: 50, magnitude: -45, source: "myfile.csv"}, ...]
```

### Downsampling Details

- **Min points:** 10 (ensures minimum graph resolution)
- **Max points:** 30 (prevents clutter)
- **Algorithm:** Stride-based sampling with first/last preservation
- **Sorting:** By frequency ascending

---

## Performance Notes

- **Max file size:** Limited by browser FileReader API (~500MB)
- **Max data points:** No hard limit (auto-downsampled to 30)
- **Chart rendering:** Optimized with Recharts (handles 10-30 points smoothly)
- **Memory:** Efficient point filtering minimizes memory usage

---

## Testing CSV Upload

### Sample CSV Files to Test

**freq_mag.csv**

```csv
frequency,magnitude
50,-45.2
100,-42.8
500,-40.5
1000,-48.2
5000,-62.1
10000,-68.5
```

**different_headers.csv**

```csv
Hz,dB
50.0,-45.2
100.0,-42.8
500.0,-40.5
```

**large_dataset.csv** (> 100 rows)

- Will be auto-downsampled to ~30 points
- Last point always preserved

---

**Version:** 1.0  
**Last Updated:** 2025-10-10  
**Status:** Production Ready ✅
