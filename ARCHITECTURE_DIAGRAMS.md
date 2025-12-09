# UrjaLytics Architecture Diagram

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    Uploads.jsx (245 lines)                  │
│                  Main Container Component                   │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├─ Uses: useCSVUpload() Hook ────────────────────┐
       │                                                 │
       ├─ Conditionally Renders:                        │
       │                                                 │
       ├──→ UploadTab.jsx (213 lines)                   │
       │    ├── CSV File Input (drag & drop)            │
       │    ├── Metadata Form                           │
       │    │   ├── Transformer ID                      │
       │    │   ├── Date                                │
       │    │   ├── Make                                │
       │    │   ├── Voltages                            │
       │    │   └── File Type                           │
       │    └── Recent Tests Sidebar                    │
       │                                                 │
       ├──→ AnalysisTab.jsx (229 lines)                 │
       │    ├── Recharts AreaChart                      │
       │    │   ├── Logarithmic X-axis (Frequency)      │
       │    │   ├── Linear Y-axis (Magnitude)           │
       │    │   └── Two colored Area series             │
       │    ├── Statistics Sidebar                      │
       │    │   ├── Data Point Count                    │
       │    │   ├── Frequency Range                     │
       │    │   ├── Magnitude Stats                     │
       │    │   └── Color-coded by file                 │
       │    └── Control Buttons                         │
       │        ├── Height Adjustment                   │
       │        ├── Reset Zoom                          │
       │        └── Export Report                       │
       │                                                 │
       └──→ RecommendationsTab.jsx (154 lines)          │
            ├── Risk Level Indicator                    │
            │   ├── Red (High) > 20dB                   │
            │   ├── Amber (Medium) 10-20dB              │
            │   └── Green (Low) < 10dB                  │
            └── Recommendation Cards                    │
                ├── PD Test Recommendation              │
                ├── Core Check                          │
                ├── Temperature Monitoring              │
                └── Follow-up FRA Test                  │
       │
       └─────────────────────────────────────────────────┘
                              ▼
               ┌──────────────────────────────┐
               │  useCSVUpload() Hook (206)    │
               │  Centralized CSV Logic       │
               ├──────────────────────────────┤
               │ State:                       │
               │ - csvFiles[]                 │
               │ - csvData[]                  │
               │ - zoomRange[min,max]         │
               ├──────────────────────────────┤
               │ Functions:                   │
               │ - parseCSVData()             │
               │ - intelligentDownsample()    │
               │ - handleCSVUpload()          │
               │ - removeCSVFile()            │
               │ - resetZoom()                │
               └──────────────────────────────┘
```

---

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│ User Action: Select CSV File(s) via Upload UI                 │
└─────────────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
                  ┌──────────────────────────────┐
                  │ handleCSVUpload(e)           │
                  │ (from useCSVUpload hook)     │
                  └──────────────────┬───────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │ Validation                      │
                    ├─────────────────────────────────┤
                    │ ✓ File count ≤ 2               │
                    │ ✓ File type .csv               │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌──────────────────────────────┐
                    │ FileReader.readAsText()      │
                    │ Convert file to text         │
                    └────────────────┬─────────────┘
                                     │
                                     ▼
                    ┌──────────────────────────────┐
                    │ parseCSVData(text, fileName) │
                    └────────────────┬─────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
        ┌─────────────────────┐         ┌──────────────────────┐
        │ Parse Headers       │         │ Extract Data Rows    │
        │ - Split by comma    │         │ - Parse floats       │
        │ - Lowercase names   │         │ - Validate numbers   │
        └──────────┬──────────┘         └──────────┬───────────┘
                   │                               │
                   └───────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │ Semantic Column Matching     │
                    ├──────────────────────────────┤
                    │ Frequency Index Search:      │
                    │ ✓ freq, frequency, hz...     │
                    │                              │
                    │ Magnitude Index Search:      │
                    │ ✓ mag, magnitude, db...      │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │ Build Data Array             │
                    │ - freq → frequency (number)  │
                    │ - mag → magnitude (number)   │
                    │ - source → file name         │
                    │ - Sort by frequency          │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │ intelligentDownsample()      │
                    │ (if data.length > 30)        │
                    ├──────────────────────────────┤
                    │ 1. Calculate step size       │
                    │    step = ceil(len/30)       │
                    │ 2. Sample every nth point    │
                    │    [0, step, 2*step, ...]    │
                    │ 3. Always add last point     │
                    │ 4. Result: 10-30 points      │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │ Update State (csvData[])     │
                    │ setCsvData([...data])        │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────┐
│ AnalysisTab Receives csvData → Renders Chart                  │
│ - Recharts AreaChart with all data points                     │
│ - Statistics calculated from data                             │
│ - Risk level assessed (magnitude range)                       │
└────────────────────────────────────────────────────────────────┘
```

---

## CSV Parsing State Machine

```
┌──────────────────┐
│   START: File    │
│   Selected       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ Validate File                │
│ - Is .csv format?            │
│ - File count ≤ 2?            │
└─────┬────────────────┬───────┘
      │ ✓              │ ✗
      │                └─→ Show Error & Exit
      ▼
┌──────────────────────────────┐
│ Read File as Text            │
│ Using FileReader API         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Parse CSV Structure          │
│ - Split by newline           │
│ - Headers = first row        │
│ - Data = remaining rows      │
└─────┬────────────────┬───────┘
      │ ✓              │ ✗
      │                └─→ "CSV too small" Error
      ▼
┌──────────────────────────────┐
│ Find Column Indices          │
│ - Semantic match: freq       │
│ - Semantic match: magnitude  │
└─────┬────────────────┬───────┘
      │ ✓              │ ✗
      │                └─→ "Missing columns" Error
      ▼
┌──────────────────────────────┐
│ Extract Data Points          │
│ - Parse floats              │
│ - Validate numbers          │
└─────┬────────────────┬───────┘
      │ ✓              │ ✗
      │                └─→ "No valid data" Error
      ▼
┌──────────────────────────────┐
│ Sort by Frequency            │
│ (X-axis order)               │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Downsample if Needed         │
│ (if length > 30)             │
│ - Calculate step             │
│ - Stride sampling            │
│ - Preserve first/last        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ SUCCESS: Data Ready          │
│ csvData updated              │
│ Charts render                │
└──────────────────────────────┘
```

---

## Two-File Comparison Data Structure

```
Upload File 1: test_phase_r.csv
┌─────────────────────────────────┐
│ frequency, magnitude            │
│ 50, -45.2                       │
│ 100, -42.8                      │
│ ...                             │
│ 10000, -68.5                    │
└────────────────┬────────────────┘
                 │ parseCSVData()
                 ▼
        csvData Array (Downsampled)
        ┌─────────────────────────────────┐
        │ File 1 Points (after step = 50) │
        │ {freq: 50, mag: -45.2,          │
        │  source: "test_phase_r.csv"}    │
        │ {freq: 100, mag: -42.8,         │
        │  source: "test_phase_r.csv"}    │
        │ ...                             │
        │ {freq: 10000, mag: -68.5,       │
        │  source: "test_phase_r.csv"}    │
        │ (≈ 20 points downsampled)       │
        └──────────────┬────────────────┘
                       │
Upload File 2: test_phase_b.csv   │
┌─────────────────────────────────┐│
│ frequency, magnitude            ││
│ 50, -46.1                       ││
│ 100, -43.5                      ││
│ ...                             ││
│ 10000, -69.2                    ││
└────────────────┬────────────────┘│
                 │ parseCSVData()   │
                 ▼                  │
        csvData Array (Continued)   │
        ┌─────────────────────────────────┐
        │ File 2 Points (after step = 50) │
        │ {freq: 50, mag: -46.1,          │
        │  source: "test_phase_b.csv"}    │
        │ {freq: 100, mag: -43.5,         │
        │  source: "test_phase_b.csv"}    │
        │ ...                             │
        │ {freq: 10000, mag: -69.2,       │
        │  source: "test_phase_b.csv"}    │
        │ (≈ 20 points downsampled)       │
        └─────────────────────────────────┘
                       │
                       ▼
            Total: ~40 points in csvData[]
            (divided into 2 series by source)
                       │
                       ▼
        ┌──────────────────────────────┐
        │ AnalysisTab.jsx              │
        │ Maps over csvFiles           │
        │ Filters by source for each   │
        │ Area component               │
        │                              │
        │ Area 1: Blue (File 1)        │
        │ Area 2: Red (File 2)         │
        │                              │
        │ Overlaid on same chart       │
        └──────────────────────────────┘
```

---

## Downsampling Algorithm Detail

### Example: 1000-row CSV

```
Original Data: 1000 points
                │
                ▼ Check: > 30?
                │ YES
                │
                ▼ Calculate step size
        step = ceil(1000 / 30)
             = ceil(33.33)
             = 34
                │
    ┌───────────┴───────────┐
    │ Stride Sampling        │
    │ Sample every 34th row  │
    │                        │
    │ row[0]    ✓            │ Always include first
    │ row[34]   ✓            │
    │ row[68]   ✓            │
    │ row[102]  ✓            │
    │ ...                    │
    │ row[966]  ✓            │
    │ row[999]  ✓            │ Always include last
    │                        │
    └───────────┬────────────┘
                │
                ▼
        Result: 30 points
        (1000 / 34 ≈ 29.4, rounded to 30)
                │
                ▼
        ✓ Perfect graph visibility
        ✓ Data distribution preserved
        ✓ No browser lag
        ✓ Accuracy maintained
```

---

## Risk Assessment Algorithm

```
Collect All Magnitude Values
        │
        ▼
Calculate Statistics
  - min_mag = MIN(magnitudes)
  - max_mag = MAX(magnitudes)
  - range = max_mag - min_mag
        │
        ▼
   Branch by Range
        │
    ┌───┼───┬───┐
    │   │   │   │
    ▼   ▼   ▼   ▼
  <10  10  15   >20
  dB   dB  dB   dB
    │   │   │   │
    ▼   ▼   ▼   ▼
  GREEN YELLOW ORANGE RED
  (Low) (Low)  (Med) (High)
    │     │     │     │
    ▼     ▼     ▼     ▼
  Continue Monitor Investigate
  Normal  Trends  Closely    Immediate
  Routine               Action

Output:
  - Risk Level Badge
  - Color Code
  - Recommendation Set
  - Priority Level
```

---

## State Management Layers

```
┌─────────────────────────────────────────────────────────┐
│             Global State: Uploads.jsx                   │
│  (React.useState for UI, tab, progress, etc.)           │
│                                                          │
│  • activeTab: 'upload' | 'analysis' | 'recommendations' │
│  • analyzing: boolean (progress bar)                    │
│  • progress: 0-100% (upload animation)                  │
│  • query: search string for test list                   │
│  • transformerId, uploadDate, fileType, etc.            │
│  • uploadedFile: File object                            │
└──────────────────────┬──────────────────────────────────┘
                       │ useCSVUpload() Hook
                       │ ┌─────────────────────────────────┐
                       │ │ Hook State (Shared CSV Logic)   │
                       │ │                                 │
                       │ │ csvFiles[]   ──→ File objects   │
                       │ │ csvData[]    ──→ Data points    │
                       │ │ zoomRange    ──→ Zoom state     │
                       │ │ All handlers ──→ Logic          │
                       │ └────────────┬────────────────────┘
                       │              │
                       ▼              ▼
        ┌─────────────────────────────────────────┐
        │ Sub-Component Props                     │
        ├─────────────────────────────────────────┤
        │                                         │
        │ UploadTab:                              │
        │   csvFiles, csvData                     │
        │   handleCSVUpload, removeCSVFile        │
        │   analyzeCSVData                        │
        │   Form states (transformerId, etc.)     │
        │   filteredTests, handleTestClick        │
        │                                         │
        │ AnalysisTab:                            │
        │   csvFiles, csvData                     │
        │   chartHeight, setChartHeight           │
        │   zoomRange, resetZoom                  │
        │                                         │
        │ RecommendationsTab:                     │
        │   csvData, csvFiles                     │
        │   transformerId                         │
        │                                         │
        └─────────────────────────────────────────┘
```

---

## Error Handling Flow

```
User Action: Upload CSV
        │
        ▼
  ┌─────────────┐
  │ Try Block   │
  └──────┬──────┘
         │
    ┌────┴──────────┬──────────┬─────────────┐
    │               │          │             │
    ▼               ▼          ▼             ▼
 Validate     Parse CSV   Find Columns  Extract Data
    │               │          │             │
    └─ ✓ ─────┬──── ✓ ───┬──── ✓ ────┬──── ✓ ──┐
              │          │          │         │
              └──────────┴──────────┴─────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Catch Block Error   │
              │  (any exception)     │
              └──────────┬───────────┘
                         │
        ┌────────────────┴─────────────────┐
        ▼                                  ▼
   alert(error message)            setCsvData([])
   Return empty array              Return early

Error Types Handled:
  • "CSV file too small" (< 2 rows)
  • "No columns found" (no freq/mag)
  • "No valid data points" (parse fails)
  • "Maximum 2 CSV files" (limit exceeded)
  • Generic "Error parsing" (catch-all)
```

---

## Import/Export Dependencies

```
                Uploads.jsx
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
   react      lucide-react  hooks/
   (hooks)    (icons)      useCSVUpload
                │
    ┌───────────┼──────────────┐
    │           │              │
    ▼           ▼              ▼
  Upload   Activity        (custom hook)
  Activity FileText            │
           Search          ┌────┴────┐
           X               │         │
           Clock      useState  (React)
                │
            UploadTab.jsx
            AnalysisTab.jsx
      RecommendationsTab.jsx
            │
        ┌───┼───┐
        │   │   │
        ▼   ▼   ▼
     recharts  lucide  Custom
                react     UI
                icons    (Tailwind)
```

---

This architecture ensures clean separation of concerns, easy testing, and future extensibility.
