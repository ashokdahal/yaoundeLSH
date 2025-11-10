// ----------------------------------------------------
// FACTOR DEFINITIONS (from Annex_Weights.xlsx)
// ----------------------------------------------------
const factors = [
  {
    name: "Slope (°)",
    subclasses: [
      { range: "0-10", w: 1 },
      { range: "10-20", w: 2 },
      { range: "20-30", w: 3 },
      { range: "30-45", w: 4 },
      { range: ">45", w: 5 }
    ]
  },
  {
    name: "Rainfall Intensity (mm/hr)",
    subclasses: [
      { range: "0-20", w: 1 },
      { range: "20-40", w: 2 },
      { range: "40-60", w: 3 },
      { range: "60-80", w: 4 },
      { range: ">80", w: 5 }
    ]
  },
  {
    name: "Distance to Streams (m)",
    subclasses: [
      { range: "0-50", w: 5 },
      { range: "50-100", w: 4 },
      { range: "100-500", w: 3 },
      { range: "500-1000", w: 2 },
      { range: ">1000", w: 1 }
    ]
  },
  {
    name: "Curvature",
    subclasses: [
      { range: "<-0.5", w: 5 },
      { range: "-0.5-0", w: 4 },
      { range: "0-0.5", w: 2 },
      { range: ">0.5", w: 1 }
    ]
  },
  {
    name: "Aspect (° from North)",
    subclasses: [
      { range: "0-45", w: 3 },
      { range: "45-135", w: 2 },
      { range: "135-225", w: 4 },
      { range: "225-315", w: 5 },
      { range: "315-360", w: 3 }
    ]
  },
  {
    name: "Elevation (m)",
    subclasses: [
      { range: "0-500", w: 1 },
      { range: "500-700", w: 2 },
      { range: "700-900", w: 3 },
      { range: "900-1100", w: 4 },
      { range: ">1100", w: 5 }
    ]
  },
  {
    name: "Topographic Wetness Index (TWI)",
    subclasses: [
      { range: "<5", w: 1 },
      { range: "5-8", w: 2 },
      { range: "8-10", w: 3 },
      { range: "10-12", w: 4 },
      { range: ">12", w: 5 }
    ]
  },
  {
    name: "Land Use / Cover",
    categorical: true,
    subclasses: [
      { range: "Forest / Tree cover", w: 1 },
      { range: "Grassland", w: 2 },
      { range: "Cropland", w: 3 },
      { range: "Built-up / Urban", w: 4 },
      { range: "Bare or sparse vegetation", w: 5 },
      { range: "Wetland", w: 2 },
      { range: "Water body", w: 1 }
    ]
  },
  {
    name: "Rock Types",
    categorical: true,
    subclasses: [
      { range: "Ectinites, migmatites", w: 2 },
      { range: "Embrechites", w: 5 }
    ]
  },
  {
    name: "Geology",
    categorical: true,
    subclasses: [
      { range: "Upper gneisses: garnetiferous with two micas", w: 2 },
      { range: "Gneiss-Embrechite Gneiss-migmatitic", w: 5 }
    ]
  }
];

// ----------------------------------------------------
// Helper functions
// ----------------------------------------------------
function parseRange(label) {
  label = label.trim();
  const m = label.match(/^(\-?\d+(\.\d+)?)-(\-?\d+(\.\d+)?)$/);
  if (m) return { type: "num", min: parseFloat(m[1]), max: parseFloat(m[3]) };
  if (label.startsWith(">")) return { type: "num", min: parseFloat(label.replace(">","")), max: Infinity };
  if (label.startsWith("<")) return { type: "num", min: -Infinity, max: parseFloat(label.replace("<","")) };
  return { type: "cat", val: label.toLowerCase() };
}

function matchSubclass(subs, val) {
  for (const s of subs) {
    const p = parseRange(s.range);
    if (p.type === "num" && val >= p.min && val <= p.max) return s.w;
  }
  return subs.find(s => s.range.toLowerCase() === String(val).toLowerCase())?.w ?? null;
}

// ----------------------------------------------------
// Build dynamic form
// ----------------------------------------------------
const form = document.getElementById("ahpForm");

factors.forEach((f, i) => {
  const card = document.createElement("div");
  card.className = "card shadow-sm mb-3";
  const isCat = !!f.categorical;
  card.innerHTML = `
    <div class="card-body">
      <h6 class="fw-bold mb-2">${f.name}</h6>
      ${isCat
        ? `<label class="form-label small">Select category:</label>
           <select class="form-select val-in" data-i="${i}">
             <option value="">-- choose --</option>
             ${f.subclasses.map(s=>`<option>${s.range}</option>`).join("")}
           </select>`
        : `<label class="form-label small">Enter measured value:</label>
           <input type="number" class="form-control val-in" data-i="${i}" placeholder="numeric value">`
      }
      <div class="mt-3">
        <label class="form-label small">Derived subclass weight (editable):</label>
        <input type="number" class="form-control weight-in" data-i="${i}" value="3">
      </div>
      <div class="small text-muted mt-2">
        <u>Mapping:</u> ${f.subclasses.map(s=>`${s.range}→${s.w}`).join(", ")}
      </div>
    </div>`;
  form.appendChild(card);
});

// ----------------------------------------------------
// Auto-update derived weights when user enters value
// ----------------------------------------------------
form.addEventListener("change", e => {
  const el = e.target;
  if (!el.classList.contains("val-in")) return;
  const i = +el.dataset.i;
  const f = factors[i];
  let derived = 3;
  const v = el.value;
  if (v !== "") {
    const val = parseFloat(v);
    const w = matchSubclass(f.subclasses, isNaN(val) ? v : val);
    if (w !== null) derived = w;
  }
  form.querySelector(`.weight-in[data-i="${i}"]`).value = derived;
});

// ----------------------------------------------------
// Calculate normalized susceptibility + color display
// ----------------------------------------------------
document.getElementById("calcBtn").addEventListener("click", () => {
  const weights = Array.from(document.querySelectorAll(".weight-in")).map(x => +x.value || 0);
  const sum = weights.reduce((a,b)=>a+b,0);
  const norm = weights.map(w => w/sum);
  const score = norm.reduce((acc,n,i)=>acc + n*(weights[i]/5), 0) * 100;
  const pct = score.toFixed(1);

  let cls = "Very Low";
  let color = "#006400"; // dark green
  if (score >= 80) { cls = "Very High"; color = "#d32f2f"; } // red
  else if (score >= 70) { cls = "High"; color = "#ff8c00"; } // orange
  else if (score >= 60) { cls = "Moderate"; color = "#ffd700"; } // yellow
  else if (score >= 50) { cls = "Low"; color = "#008000"; } // green

  const resultCard = document.getElementById("resultCard");
  resultCard.classList.remove("d-none");
  resultCard.style.backgroundColor = color;
  resultCard.style.color = "white";

  document.getElementById("scoreVal").textContent = pct;
  document.getElementById("classVal").textContent = cls;

  resultCard.scrollIntoView({behavior:"smooth"});
});
