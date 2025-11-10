# 🌍 AHP Landslide Susceptibility Tool – Yaoundé

A **lightweight, mobile-friendly web tool** for rapid field estimation of landslide susceptibility using the **Analytic Hierarchy Process (AHP)** methodology.  
Developed as part of the 2025 Yaoundé Landslide Hazard Assessment project.

This app allows local officers and field engineers to input **measured terrain and environmental parameters** and obtain a **normalized susceptibility score** and **qualitative class** (Very Low → Very High).  
All AHP weights and parameter thresholds are preloaded from the official **Annex_Weights.xlsx** dataset — no uploads or internet connection required once deployed.

---

## 🚀 Features

- ✅ **Offline, single-page web app** (HTML + JavaScript only)  
- 📱 **Responsive design** for mobile and tablet field use  
- ⚙️ **10 AHP parameters** (Slope, Rainfall, Curvature, Distance to Streams, Elevation, Aspect, TWI, Landuse, Pedology, Geology)  
- 🔢 Auto-detects **numeric vs categorical** parameters  
- 🧮 Auto-assigns subclass weights based on measured value (editable override)  
- 📊 Outputs **normalized susceptibility (%)** and **qualitative hazard class**  
- 💾 Runs locally or via **GitHub Pages** — no backend, no server

---

## 🧭 Parameters Used

| # | Parameter | Type | Description |
|---|------------|------|--------------|
| 1 | Slope (°) | Numeric | Derived from DTM |
| 2 | Rainfall Intensity (mm/hr) | Numeric | Triggering factor |
| 3 | Distance to Streams (m) | Numeric | Proxy for hydrological saturation |
| 4 | Curvature | Numeric | Slope form influence |
| 5 | Aspect (° from North) | Numeric | Slope exposure control |
| 6 | Elevation (m) | Numeric | Relief and erosion proxy |
| 7 | Topographic Wetness Index (TWI) | Numeric | Infiltration and drainage proxy |
| 8 | Land Use / Cover | Categorical | Derived from ESA WorldCover |
| 9 | Pedology (Soil Type) | Categorical | From national soil maps |
| 10 | Geology | Categorical | From INC regional geological map |

---

## 🧩 How It Works

1. **Enter or select** observed field values for each factor:
   - Numeric factors (e.g., *Slope = 32°*, *Distance = 300 m*, *Rainfall = 60 mm/hr*)
   - Categorical factors (e.g., *Landuse = Cropland*, *Geology = Embrechitic gneiss*)
2. The tool **automatically assigns AHP subclass weights** based on the predefined thresholds from `Annex_Weights.xlsx`.
3. Weights can be **manually adjusted** in the editable boxes.
4. When all inputs are entered, click **“Calculate Susceptibility”**.
5. The tool outputs:
   - **Normalized susceptibility score (%)**
   - **Qualitative hazard class**:
     - `<50%` → Very Low  
     - `50–60%` → Low  
     - `60–70%` → Moderate  
     - `70–80%` → High  
     - `>80%` → Very High

---

## 💻 Deployment (GitHub Pages)

You can host the tool directly on GitHub Pages in 2 minutes:

1. Create a new public repository — e.g. `yaounde-ahp-tool`
2. Add these files to the root directory:
