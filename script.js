/* ═══════════════════════════════════════════════════════════
   BLOODLINK AI — script.js
═══════════════════════════════════════════════════════════ */

/* ── DATA ─────────────────────────────────────────────────── */
const BG = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const COMPAT = {
  "A+":["A+","A-","O+","O-"],  "A-":["A-","O-"],
  "B+":["B+","B-","O+","O-"],  "B-":["B-","O-"],
  "AB+":["A+","A-","B+","B-","AB+","AB-","O+","O-"], "AB-":["A-","B-","AB-","O-"],
  "O+":["O+","O-"],             "O-":["O-"]
};

const BANKS = [
  { id:1, name:"Apollo Blood Centre",   addr:"MG Road, Churchgate",     dist:0.8, phone:"+91 98765 43210", lat:19.076, lng:72.877, rating:4.8,
    stock:{"A+":15,"O+":8,"B+":3,"AB+":12,"A-":0,"O-":5,"B-":2,"AB-":1} },
  { id:2, name:"Red Cross Society",     addr:"Linking Road, Bandra",    dist:1.2, phone:"+91 98765 43211", lat:19.051, lng:72.826, rating:4.9,
    stock:{"A+":0,"O+":20,"B+":7,"AB+":4,"A-":3,"O-":0,"B-":8,"AB-":2} },
  { id:3, name:"City Blood Bank",       addr:"Andheri West, Mumbai",    dist:2.1, phone:"+91 98765 43212", lat:19.119, lng:72.846, rating:4.5,
    stock:{"A+":25,"O+":15,"B+":0,"AB+":9,"A-":6,"O-":3,"B-":0,"AB-":4} },
  { id:4, name:"Lilavati Hospital BB",  addr:"Bandra West, Mumbai",     dist:3.5, phone:"+91 98765 43213", lat:19.054, lng:72.831, rating:4.7,
    stock:{"A+":5,"O+":2,"B+":18,"AB+":0,"A-":1,"O-":12,"B-":5,"AB-":0} },
  { id:5, name:"Kokilaben Hospital BB", addr:"Andheri West, Mumbai",    dist:4.2, phone:"+91 98765 43214", lat:19.133, lng:72.833, rating:4.9,
    stock:{"A+":30,"O+":25,"B+":12,"AB+":8,"A-":4,"O-":2,"B-":6,"AB-":3} },
  { id:6, name:"Breach Candy Hospital", addr:"Bhulabhai Desai Road",    dist:5.0, phone:"+91 98765 43215", lat:18.972, lng:72.806, rating:4.6,
    stock:{"A+":8,"O+":11,"B+":5,"AB+":2,"A-":0,"O-":7,"B-":1,"AB-":0} },
];

const EM_REQS = [
  { id:1, name:"Rahul Sharma", bg:"O-",  loc:"Bandra, Mumbai",  time:"2 min ago",  status:"Active",    priority:"Critical" },
  { id:2, name:"Priya Patel",  bg:"B+",  loc:"Andheri, Mumbai", time:"18 min ago", status:"Fulfilled", priority:"High" },
  { id:3, name:"Aditya Kumar", bg:"AB-", loc:"Powai, Mumbai",   time:"1 hr ago",   status:"Active",    priority:"Medium" },
  { id:4, name:"Sneha Verma",  bg:"A+",  loc:"Juhu, Mumbai",    time:"2 hr ago",   status:"Active",    priority:"High" },
];

/* ── HELPERS ──────────────────────────────────────────────── */
function statusOf(u) {
  if (u === 0) return { label:"Critical", cls:"status-critical" };
  if (u <= 5)  return { label:"Low",      cls:"status-low" };
  return              { label:"Available", cls:"status-available" };
}

function priorityCls(p) {
  if (p === "Critical") return "priority-critical";
  if (p === "High")     return "priority-high";
  return "priority-medium";
}

/* ── MOBILE SIDEBAR ───────────────────────────────────────── */
function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.remove("hidden");
  sidebar.classList.add("mobile-open");
  overlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  // Animate all hamburgers to open state
  document.querySelectorAll(".hamburger").forEach(h => h.classList.add("open"));
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.remove("mobile-open");
  overlay.classList.remove("visible");
  document.body.style.overflow = "";
  document.querySelectorAll(".hamburger").forEach(h => h.classList.remove("open"));
}

/* ── NAVIGATION ───────────────────────────────────────────── */
let currentPage = "landing";

function navigate(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  const target = document.getElementById("page-" + page);
  if (target) {
    target.classList.remove("hidden");
    target.classList.remove("page-enter");
    void target.offsetWidth;
    target.classList.add("page-enter");
  }

  const sidebar = document.getElementById("sidebar");
  if (page === "landing") {
    sidebar.classList.add("hidden");
  } else {
    // On desktop always show; on mobile it's off-canvas
    if (window.innerWidth > 1024) {
      sidebar.classList.remove("hidden");
    }
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.page === page);
    });
  }

  // Close mobile sidebar on navigate
  closeSidebar();

  document.getElementById("main-content").style.background =
    (page === "landing") ? "transparent" : "#F7F7F8";

  currentPage = page;
  window.scrollTo(0, 0);

  if (page === "dashboard")  initDashboard();
  if (page === "search")     initSearch();
  if (page === "emergency")  initEmergency();
  if (page === "donate")     initDonate();
  if (page === "admin")      initAdmin();
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ── PARTICLES ────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2.5 + 1,
    a: Math.random() * 0.35 + 0.08
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229,57,53,${p.a})`;
      ctx.fill();
    });
    pts.forEach((p1, i) => pts.slice(i + 1).forEach(p2 => {
      const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(229,57,53,${0.12 * (1 - d / 130)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }));
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── DASHBOARD ────────────────────────────────────────────── */
let dashSelectedGroup = null;

function initDashboard() {
  const totalU = BG.reduce((s, g) => s + BANKS.reduce((ss, b) => ss + b.stock[g], 0), 0);
  const critG  = BG.filter(g => BANKS.every(b => b.stock[g] === 0)).length;
  const activeR = EM_REQS.filter(r => r.status === "Active").length;

  document.getElementById("dash-total-units").textContent = totalU;
  document.getElementById("dash-crit-groups").textContent = critG;
  document.getElementById("dash-active-reqs").textContent = activeR;

  renderChips("dash-chips", dashSelectedGroup, g => {
    dashSelectedGroup = (dashSelectedGroup === g) ? null : g;
    filterDashboard();
    renderChips("dash-chips", dashSelectedGroup, arguments.callee);
  });

  renderDashBanks(BANKS);
}

function filterDashboard() {
  const query = (document.getElementById("dash-search").value || "").toLowerCase();
  let filtered = BANKS;
  if (dashSelectedGroup) filtered = filtered.filter(b => b.stock[dashSelectedGroup] > 0);
  if (query) filtered = filtered.filter(b =>
    b.name.toLowerCase().includes(query) || b.addr.toLowerCase().includes(query)
  );
  document.getElementById("dash-count").textContent = filtered.length + " found";
  renderDashBanks(filtered);
}

function renderDashBanks(banks) {
  const grid = document.getElementById("dash-banks-grid");
  grid.innerHTML = "";
  banks.forEach((b, i) => {
    const s = statusOf(dashSelectedGroup ? b.stock[dashSelectedGroup] : 10);
    const stockEntries = Object.entries(b.stock).slice(0, 4);
    const card = document.createElement("div");
    card.className = "card bank-card fade-up";
    card.style.animationDelay = (0.2 + i * 0.06) + "s";
    card.onclick = () => navigate("search");
    card.innerHTML = `
      <div class="bank-card-header">
        <div>
          <div class="bank-card-name">${b.name}</div>
          <div class="bank-card-addr">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${b.addr}
          </div>
        </div>
        <span class="status-pill ${s.cls}">${s.label}</span>
      </div>
      <div class="bank-card-stock">
        ${stockEntries.map(([g,u]) => `<span class="stock-pill ${statusOf(u).cls}">${g}: ${u}</span>`).join("")}
      </div>
      <div class="bank-card-footer">
        <div class="bank-card-meta">
          <span class="bank-meta-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            ${b.dist} km
          </span>
          <span class="bank-meta-item">⭐ ${b.rating}</span>
        </div>
        <button class="bank-call-btn" onclick="event.stopPropagation(); callBank('${b.phone}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Call
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── SEARCH ───────────────────────────────────────────────── */
let searchGroup = "O+";
let selectedBank = null;
let reservedBanks = new Set();

function initSearch() {
  renderChips("search-chips", searchGroup, g => {
    if (g) searchGroup = g;
    renderSearchResults();
    renderMapPins();
    updateCompatBanner();
    renderChips("search-chips", searchGroup, arguments.callee);
  });
  updateCompatBanner();
  renderSearchResults();
  renderMapPins();
}

function updateCompatBanner() {
  const compat = COMPAT[searchGroup] || [searchGroup];
  document.getElementById("search-compat-list").textContent = compat.join(", ");
}

function renderSearchResults() {
  const compat = COMPAT[searchGroup] || [searchGroup];
  const results = BANKS
    .filter(b => compat.some(g => b.stock[g] > 0))
    .sort((a, b) => a.dist - b.dist);

  const container = document.getElementById("search-results");
  container.innerHTML = `<div class="results-meta">${results.length} blood banks with compatible stock</div>`;

  results.forEach((b, i) => {
    const bestG = compat.find(g => b.stock[g] > 0);
    const u  = bestG ? b.stock[bestG] : 0;
    const s  = statusOf(u);
    const isRes = reservedBanks.has(b.id);
    const isSel = selectedBank && selectedBank.id === b.id;

    const card = document.createElement("div");
    card.className = "search-result-card fade-up" + (isSel ? " selected" : "");
    card.style.animationDelay = i * 0.07 + "s";
    card.onclick = () => selectBank(b);
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <div>
          <div style="font-weight:700;font-size:14.5px;color:#1A1A1A;margin-bottom:3px">${b.name}</div>
          <div style="font-size:12px;color:#AAA;display:flex;align-items:center;gap:3px">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${b.dist} km · ${b.addr}
          </div>
        </div>
        <span class="${s.cls}" style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;height:fit-content;flex-shrink:0">${u}u</span>
      </div>
      <div class="result-actions">
        <a href="tel:${b.phone}" class="result-call-btn" onclick="event.stopPropagation()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Call
        </a>
        <button id="reserve-btn-${b.id}"
          class="result-reserve-btn ${isRes ? "reserved" : "btn-red"}"
          onclick="event.stopPropagation(); reserveUnit(${b.id})"
          ${isRes ? "disabled" : ""}>
          ${isRes
            ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Reserved!`
            : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Reserve Unit`}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function reserveUnit(bankId) {
  const btn = document.getElementById("reserve-btn-" + bankId);
  if (!btn || reservedBanks.has(bankId)) return;
  btn.disabled = true;
  btn.innerHTML = `<span class="spin"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.58"/></svg></span> Reserving...`;
  setTimeout(() => {
    reservedBanks.add(bankId);
    renderSearchResults();
    renderMapPins();
    showToast("Unit reserved successfully!");
  }, 1600);
}

function selectBank(bank) {
  selectedBank = bank;
  renderSearchResults();
  renderMapPins();
  showBankDetail(bank);
}

function showBankDetail(bank) {
  const detail = document.getElementById("bank-detail");
  document.getElementById("detail-name").textContent = bank.name;
  document.getElementById("detail-meta").textContent = `${bank.addr} · ${bank.dist} km away · ⭐ ${bank.rating}`;
  document.getElementById("detail-phone-link").href = "tel:" + bank.phone;
  document.getElementById("detail-phone-num").textContent = bank.phone;
  const stockDiv = document.getElementById("detail-stock");
  stockDiv.innerHTML = Object.entries(bank.stock).map(([g,u]) => {
    const s = statusOf(u);
    return `<span class="${s.cls}" style="padding:3px 10px;border-radius:7px;font-size:12px;font-weight:700">${g}: ${u}u</span>`;
  }).join("");
  detail.classList.remove("hidden");
}

function closeBankDetail() {
  selectedBank = null;
  document.getElementById("bank-detail").classList.add("hidden");
  renderSearchResults();
  renderMapPins();
}

function renderMapPins() {
  const pinsDiv = document.getElementById("map-pins");
  pinsDiv.innerHTML = "";
  const lats = BANKS.map(b => b.lat);
  const lngs = BANKS.map(b => b.lng);
  const la0 = Math.min(...lats) - 0.01, la1 = Math.max(...lats) + 0.01;
  const ln0 = Math.min(...lngs) - 0.01, ln1 = Math.max(...lngs) + 0.01;
  const px = lng => ((lng - ln0) / (ln1 - ln0)) * 82 + 9;
  const py = lat => (1 - (lat - la0) / (la1 - la0)) * 78 + 11;

  BANKS.forEach(b => {
    const uForColor = b.stock[searchGroup] !== undefined ? b.stock[searchGroup] : 10;
    const isSel = selectedBank && selectedBank.id === b.id;
    const col = isSel ? "#E53935" : uForColor === 0 ? "#E53935" : uForColor <= 5 ? "#E65100" : "#2E7D32";
    const bgCol = isSel ? "#E53935" : "white";
    const textCol = isSel ? "white" : col;
    const pin = document.createElement("div");
    pin.className = "map-pin";
    pin.style.left = px(b.lng) + "%";
    pin.style.top  = py(b.lat) + "%";
    if (isSel) pin.style.animation = "dotPulse 1.5s ease infinite";
    pin.style.zIndex = isSel ? "10" : "5";
    const shortName = b.name.split(" ").slice(0, 2).join(" ");
    pin.innerHTML = `
      <div class="map-pin-label" style="background:${bgCol};color:${textCol};border:2px solid ${col};box-shadow:${isSel ? "0 4px 16px rgba(229,57,53,0.5)" : "0 2px 10px rgba(0,0,0,0.14)"}">
        ${shortName}
      </div>
      <div class="map-pin-arrow" style="border-top:5px solid ${col}"></div>
    `;
    pinsDiv.appendChild(pin);
  });
}

/* ── EMERGENCY ────────────────────────────────────────────── */
let emBloodGroup = null;
let emUrgency = "Critical";

function initEmergency() {
  emBloodGroup = null;
  emUrgency = "Critical";
  document.getElementById("emergency-success").classList.add("hidden");
  document.getElementById("emergency-form-wrap").classList.remove("hidden");
  ["em-name","em-loc","em-contact"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  renderChips("em-chips", emBloodGroup, g => {
    emBloodGroup = (emBloodGroup === g) ? null : g;
    updateEmergencySubmitBtn();
    renderChips("em-chips", emBloodGroup, arguments.callee);
  }, "9px 16px", "11px", "700");
  document.querySelectorAll(".urgency-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.urgency === "Critical");
  });
  renderRecentRequests();
  updateEmergencySubmitBtn();
}

function setUrgency(btn) {
  document.querySelectorAll(".urgency-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  emUrgency = btn.dataset.urgency;
}

function updateEmergencySubmitBtn() {
  const loc = document.getElementById("em-loc") ? document.getElementById("em-loc").value.trim() : "";
  const canSubmit = !!emBloodGroup && !!loc;
  const btn  = document.getElementById("em-submit-btn");
  const hint = document.getElementById("em-hint");
  if (btn)  btn.disabled = !canSubmit;
  if (hint) hint.style.display = canSubmit ? "none" : "block";
}

function submitEmergency() {
  const loc = document.getElementById("em-loc").value.trim();
  if (!emBloodGroup || !loc) return;
  const btn = document.getElementById("em-submit-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.58"/></svg></span> Sending Alert...`;
  try {
    const prev = JSON.parse(localStorage.getItem("bl_em") || "[]");
    prev.unshift({ name:document.getElementById("em-name").value, bloodGroup:emBloodGroup, loc, contact:document.getElementById("em-contact").value, urgency:emUrgency, id:Date.now(), ts:new Date().toISOString() });
    localStorage.setItem("bl_em", JSON.stringify(prev));
  } catch(e) {}
  setTimeout(() => {
    document.getElementById("emergency-form-wrap").classList.add("hidden");
    document.getElementById("emergency-success").classList.remove("hidden");
  }, 2200);
}

function resetEmergency() { initEmergency(); }

function renderRecentRequests() {
  const container = document.getElementById("recent-requests");
  container.innerHTML = "";
  EM_REQS.slice(0, 3).forEach((r, i) => {
    const el = document.createElement("div");
    el.className = "recent-req-card fade-up";
    el.style.animationDelay = (0.3 + i * 0.07) + "s";
    el.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <div class="req-blood-badge">${r.bg}</div>
        <div>
          <div class="req-name">${r.name}</div>
          <div class="req-meta">
            <span><svg style="display:inline;vertical-align:middle" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${r.loc}</span>
            <span><svg style="display:inline;vertical-align:middle" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${r.time}</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <span class="priority-badge ${priorityCls(r.priority)}">${r.priority}</span>
        <span class="${r.status === "Active" ? "status-badge-active" : "status-badge-fulfilled"}">${r.status}</span>
      </div>
    `;
    container.appendChild(el);
  });
}

/* ── DONATE ───────────────────────────────────────────────── */
let donorBloodGroup = null;
let donorAvail = true;
const donorId = "BL-" + (Math.floor(Math.random() * 9000) + 1000);

function initDonate() {
  donorBloodGroup = null;
  donorAvail = true;
  document.getElementById("donate-success").classList.add("hidden");
  document.getElementById("donate-form-wrap").classList.remove("hidden");
  ["don-name","don-email","don-loc","don-last"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const toggle = document.getElementById("don-toggle");
  if (toggle) toggle.classList.add("active");
  renderChips("don-chips", donorBloodGroup, g => {
    donorBloodGroup = (donorBloodGroup === g) ? null : g;
    updateDonateBtn();
    renderChips("don-chips", donorBloodGroup, arguments.callee);
  }, "9px 15px", "14px", "700");
  updateDonateBtn();
}

function toggleAvail() {
  donorAvail = !donorAvail;
  document.getElementById("don-toggle").classList.toggle("active", donorAvail);
}

function updateDonateBtn() {
  const name = document.getElementById("don-name");
  const btn  = document.getElementById("don-submit-btn");
  if (!btn || !name) return;
  const canSubmit = name.value.trim() && donorBloodGroup;
  btn.disabled = !canSubmit;
  btn.style.background   = canSubmit ? "linear-gradient(135deg,#E53935,#C62828)" : "#F0F0F0";
  btn.style.color        = canSubmit ? "white" : "#CCC";
  btn.style.cursor       = canSubmit ? "pointer" : "not-allowed";
  btn.style.boxShadow    = canSubmit ? "0 4px 18px rgba(229,57,53,0.38)" : "none";
}

function submitDonate() {
  const name = document.getElementById("don-name").value.trim();
  if (!name || !donorBloodGroup) return;
  const loc = document.getElementById("don-loc").value.trim();
  try {
    const prev = JSON.parse(localStorage.getItem("bl_donors") || "[]");
    prev.push({ name, bg:donorBloodGroup, loc, avail:donorAvail, id:Date.now() });
    localStorage.setItem("bl_donors", JSON.stringify(prev));
  } catch(e) {}
  const bgStr = donorBloodGroup.replace("+","P").replace("-","N");
  document.getElementById("donor-id-display").textContent = `${donorId}-${bgStr}`;
  document.getElementById("donor-success-name").textContent = name;
  document.getElementById("donor-success-bg").textContent   = donorBloodGroup;
  document.getElementById("donor-avail-val").textContent    = donorAvail ? "Active" : "Inactive";
  document.getElementById("donor-bg-val").textContent       = donorBloodGroup;
  document.getElementById("donor-loc-val").textContent      = loc || "Not set";
  document.getElementById("donate-form-wrap").classList.add("hidden");
  document.getElementById("donate-success").classList.remove("hidden");
}

function resetDonate() { initDonate(); }

/* ── ADMIN ────────────────────────────────────────────────── */
function initAdmin() {
  const totalU = BG.reduce((s, g) => s + BANKS.reduce((ss, b) => ss + b.stock[g], 0), 0);
  const activeAlerts = EM_REQS.filter(r => r.status === "Active").length;
  document.getElementById("admin-total").textContent  = totalU;
  document.getElementById("admin-alerts").textContent = activeAlerts;
  document.getElementById("admin-active-badge").textContent = activeAlerts + " active";
  renderAdminChart();
  renderAdminInventory();
  renderAdminRequests();
}

function switchAdminTab(btn) {
  document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  const tabId = btn.dataset.tab;
  document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.add("hidden"));
  document.getElementById("admin-" + tabId).classList.remove("hidden");
}

function renderAdminChart() {
  const chart = document.getElementById("admin-chart");
  chart.innerHTML = "";
  const totals = BG.map(g => ({ g, tot: BANKS.reduce((s, b) => s + b.stock[g], 0) }));
  const maxU = Math.max(...totals.map(d => d.tot), 1);
  totals.forEach(({ g, tot }, i) => {
    const h   = Math.max(8, (tot / maxU) * 130);
    const s   = statusOf(tot > 0 ? Math.min(tot, 20) : 0);
    const col = { "status-available":"#2E7D32", "status-low":"#E65100", "status-critical":"#E53935" }[s.cls];
    const wrap = document.createElement("div");
    wrap.className = "chart-bar-wrap";
    wrap.innerHTML = `
      <div class="chart-bar-val" style="color:${col}">${tot}</div>
      <div class="chart-bar" style="height:${h}px;background:linear-gradient(to top,${col},${col}88);animation:barGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.05}s both"></div>
      <div class="chart-bar-label">${g}</div>
    `;
    chart.appendChild(wrap);
  });
}

function renderAdminInventory() {
  const list = document.getElementById("admin-inventory-list");
  list.innerHTML = "";
  BANKS.forEach((b, i) => {
    const row = document.createElement("div");
    row.className = "inv-row fade-up";
    row.style.animationDelay = i * 0.06 + "s";
    row.innerHTML = `
      <div class="inv-row-header">
        <div>
          <div class="inv-name">${b.name}</div>
          <div class="inv-meta">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${b.addr} · ${b.dist} km · ⭐${b.rating}
          </div>
        </div>
        <button class="inv-update-btn" onclick="showToast('Stock update submitted for ${b.name}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Update Stock
        </button>
      </div>
      <div class="inv-stock">
        ${Object.entries(b.stock).map(([g,u]) => `<span class="inv-stock-pill ${statusOf(u).cls}">${g} <span style="opacity:0.8">${u}u</span></span>`).join("")}
      </div>
    `;
    list.appendChild(row);
  });
}

function renderAdminRequests() {
  const list = document.getElementById("admin-requests-list");
  list.innerHTML = "";
  EM_REQS.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "req-row fade-up";
    row.style.animationDelay = i * 0.06 + "s";
    row.innerHTML = `
      <div class="req-row-left">
        <div class="req-bg-badge">${r.bg}</div>
        <div>
          <div style="font-weight:600;font-size:14px;color:#1A1A1A">${r.name}</div>
          <div class="req-meta">
            <span><svg style="display:inline;vertical-align:middle" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${r.loc}</span>
            <span><svg style="display:inline;vertical-align:middle" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${r.time}</span>
          </div>
        </div>
      </div>
      <div class="req-row-right">
        <span class="priority-badge ${priorityCls(r.priority)}">${r.priority}</span>
        <span class="${r.status === "Active" ? "status-badge-active" : "status-badge-fulfilled"}">${r.status}</span>
      </div>
    `;
    list.appendChild(row);
  });
}

/* ── SHARED: renderChips ──────────────────────────────────── */
function renderChips(containerId, selected, onSelect, padding, fontSize, fontWeight) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  BG.forEach(g => {
    const btn = document.createElement("button");
    btn.className = "chip" + (selected === g ? " active" : "");
    btn.textContent = g;
    if (padding)    btn.style.padding    = padding;
    if (fontSize)   btn.style.fontSize   = fontSize;
    if (fontWeight) btn.style.fontWeight = fontWeight;
    btn.onclick = () => onSelect(g);
    container.appendChild(btn);
  });
}

/* ── TOAST ────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show";
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = "toast hide";
    setTimeout(() => { toast.className = "toast"; }, 300);
  }, 3000);
}

function callBank(phone) {
  showToast("Calling " + phone + "...");
  window.location.href = "tel:" + phone;
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Wire up sidebar overlay close
  const overlay = document.getElementById("sidebar-overlay");
  if (overlay) overlay.addEventListener("click", closeSidebar);

  // Close sidebar on ESC
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSidebar();
  });

  // On resize to desktop, ensure sidebar is visible on non-landing pages
  window.addEventListener("resize", () => {
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth > 1024 && currentPage !== "landing") {
      sidebar.classList.remove("hidden");
      closeSidebar();
    }
  });

  // Wire location input for emergency
  const emLoc = document.getElementById("em-loc");
  if (emLoc) emLoc.addEventListener("input", updateEmergencySubmitBtn);

  // Wire name input for donate
  const donName = document.getElementById("don-name");
  if (donName) donName.addEventListener("input", updateDonateBtn);

  navigate("landing");
  initParticles();
});
