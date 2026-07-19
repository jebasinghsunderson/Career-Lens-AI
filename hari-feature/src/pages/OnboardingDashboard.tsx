// @ts-nocheck
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];
const INTERNSHIP_ROLES = [
  "Finance Intern","Accounting Intern","Banking & Financial Services Intern",
  "Business Operations Intern","Business Analyst Intern","Human Resources (HR) Intern",
  "Marketing Intern","Sales & Business Development Intern",
  "Project Management Intern","Supply Chain & Logistics Intern",
];
const GENDER_OPTIONS = ["Male","Female","Other","Prefer not to say"];
const NATIONALITY_OPTIONS = ["Indian","Other"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function fmtSize(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(2)} MB`;
}

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7.2L5.5 10.2L11.5 3.8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PdfIcon = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <path d="M12 4h16l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="#3B82F6" strokeWidth="2" fill="#EFF6FF"/>
    <path d="M28 4v8h8" stroke="#3B82F6" strokeWidth="2" fill="none"/>
    <text x="24" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3B82F6">PDF</text>
  </svg>
);
const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 8 12 3 7 8" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
    <path d="M1 1L7 7L13 1" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SearchIconSVG = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.2" stroke="#94A3B8" strokeWidth="1.6" fill="none"/>
    <path d="M11 11L14.5 14.5" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// ─────────────────────────────────────────────
// PREMIUM INPUT COMPONENTS
// ─────────────────────────────────────────────
function PField({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6, letterSpacing:"0.01em" }}>
        {label} {required && <span style={{ color:"#EF4444" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize:12, color:"#EF4444", marginTop:4, fontWeight:500 }}>{error}</p>}
    </div>
  );
}

function PInput({ id, type="text", inputMode, value, onChange, onBlur, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id} name={id} type={type} inputMode={inputMode}
      value={value} onChange={e => onChange(e.target.value)}
      onBlur={() => { setFocused(false); onBlur && onBlur(); }}
      onFocus={() => setFocused(true)}
      placeholder={placeholder}
      style={{
        width:"100%", minHeight:48, padding:"0 14px",
        fontSize:15, fontFamily:"inherit", color:"#1E293B",
        background: focused ? "#fff" : "#F8FAFC",
        border: `1.5px solid ${error ? "#EF4444" : focused ? "#3B82F6" : "#E2E8F0"}`,
        borderRadius:10,
        boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
        transition:"all 0.15s ease",
        outline:"none", boxSizing:"border-box",
      }}
    />
  );
}

function PSelect({ id, value, onChange, placeholder, options, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <select
        id={id} name={id} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:"100%", minHeight:48, padding:"0 40px 0 14px",
          fontSize:15, fontFamily:"inherit", color: value ? "#1E293B" : "#94A3B8",
          background: focused ? "#fff" : "#F8FAFC",
          border: `1.5px solid ${error ? "#EF4444" : focused ? "#3B82F6" : "#E2E8F0"}`,
          borderRadius:10,
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
          transition:"all 0.15s ease",
          outline:"none", boxSizing:"border-box", appearance:"none", cursor:"pointer",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
        <ChevronDown />
      </span>
    </div>
  );
}

// Searchable combobox for preferences
function Combobox({ id, label, value, onChange, onBlurValidate, options, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef(null);

  useEffect(() => { setQuery(value || ""); }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value?.toLowerCase()) return options;
    return options.filter(o => o.toLowerCase().includes(q));
  }, [query, options, value]);

  useEffect(() => {
    const close = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false); setQuery(value || "");
        if (onBlurValidate) onBlurValidate();
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [value, onBlurValidate]);

  const pick = opt => { onChange(opt); setQuery(opt); setOpen(false); setActiveIdx(-1); if (onBlurValidate) onBlurValidate(opt); };

  const onKey = e => {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); setActiveIdx(p => Math.min(p+1, filtered.length-1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(p => Math.max(p-1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (open && activeIdx >= 0 && filtered[activeIdx]) pick(filtered[activeIdx]); }
    else if (e.key === "Escape") { setOpen(false); setQuery(value || ""); }
  };

  return (
    <div ref={wrapRef} style={{ position:"relative", marginBottom:20 }}>
      <label htmlFor={id} style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>
        {label} <span style={{ color:"#EF4444" }}>*</span>
      </label>
      <div style={{
        display:"flex", alignItems:"center", gap:8, minHeight:48, padding:"0 14px",
        background: open ? "#fff" : "#F8FAFC",
        border:`1.5px solid ${error ? "#EF4444" : open ? "#3B82F6" : "#E2E8F0"}`,
        borderRadius:10,
        boxShadow: open ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
        transition:"all 0.15s ease",
      }}>
        <SearchIconSVG />
        <input
          id={id} type="text" role="combobox" aria-expanded={open}
          value={query} placeholder={placeholder}
          style={{ flex:1, border:"none", outline:"none", fontSize:15, fontFamily:"inherit", color:"#1E293B", background:"transparent", padding:"12px 0" }}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1); }}
          onFocus={() => setOpen(true)} onKeyDown={onKey}
        />
        <ChevronDown />
      </div>
      {open && (
        <ul style={{
          position:"absolute", zIndex:50, top:"calc(100% + 6px)", left:0, right:0,
          maxHeight:220, overflowY:"auto", background:"#fff",
          border:"1.5px solid #E2E8F0", borderRadius:10,
          boxShadow:"0 12px 32px rgba(0,0,0,0.12)", margin:0, padding:6, listStyle:"none",
        }}>
          {filtered.length === 0 ? (
            <li style={{ padding:"10px 12px", fontSize:14, color:"#94A3B8", textAlign:"center" }}>No matches found</li>
          ) : filtered.map((opt, idx) => (
            <li key={opt}
              onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => setActiveIdx(idx)}
              style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"10px 12px", fontSize:14, borderRadius:7, cursor:"pointer",
                background: idx === activeIdx ? "#EFF6FF" : "transparent",
                color: opt === value ? "#1D4ED8" : "#1E293B",
                fontWeight: opt === value ? 600 : 400,
              }}
            >
              <span>{opt}</span>
              {opt === value && <span style={{ color:"#3B82F6" }}><CheckIcon /></span>}
            </li>
          ))}
        </ul>
      )}
      {error && <p style={{ fontSize:12, color:"#EF4444", marginTop:4, fontWeight:500 }}>{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────
function SectionCard({ title, children }) {
  return (
    <div style={{
      background:"#fff", borderRadius:16, border:"1px solid #E2E8F0",
      boxShadow:"0 1px 4px rgba(0,0,0,0.05)", marginBottom:20, overflow:"hidden",
    }}>
      <div style={{
        padding:"16px 24px", borderBottom:"1px solid #F1F5F9",
        background:"linear-gradient(to right, #F8FAFC, #fff)",
      }}>
        <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:"#0F172A", letterSpacing:"-0.01em" }}>{title}</h2>
      </div>
      <div style={{ padding:"20px 24px" }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ step }) {
  const steps = [
    { n:1, label:"Personal Details", desc:"Name, contact & basic info" },
    { n:2, label:"Resume & Preferences", desc:"Upload resume & select roles" },
  ];
  return (
    <aside style={{
      width:280, flexShrink:0, background:"linear-gradient(160deg, #0F172A 0%, #1E3A5F 100%)",
      minHeight:"100vh", padding:"0", position:"sticky", top:0, display:"flex", flexDirection:"column",
      boxShadow:"4px 0 20px rgba(0,0,0,0.15)",
    }}>
      {/* Brand */}
      <div style={{ padding:"28px 24px 24px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#3B82F6,#6366F1)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p style={{ margin:0, fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.2 }}>Career Lens AI</p>
            <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:500 }}>PM Internship Portal</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding:"24px 24px 0" }}>
        <p style={{ margin:"0 0 14px", fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em" }}>
          Onboarding Progress
        </p>
        <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:999, height:4, marginBottom:20, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${step === 1 ? 50 : 100}%`, background:"linear-gradient(90deg,#3B82F6,#6366F1)", borderRadius:999, transition:"width 0.6s ease" }} />
        </div>

        {/* Steps */}
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {steps.map(s => {
            const done = step > s.n;
            const active = step === s.n;
            return (
              <div key={s.n} style={{
                display:"flex", alignItems:"center", gap:14, padding:"13px 14px", borderRadius:12,
                background: active ? "rgba(59,130,246,0.18)" : done ? "rgba(255,255,255,0.04)" : "transparent",
                border: active ? "1px solid rgba(59,130,246,0.35)" : "1px solid transparent",
                transition:"all 0.2s ease",
              }}>
                {/* Step circle */}
                <div style={{
                  width:32, height:32, borderRadius:"50%", flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: done ? "#22C55E" : active ? "#3B82F6" : "rgba(255,255,255,0.1)",
                  border: active ? "none" : done ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  boxShadow: active ? "0 0 12px rgba(59,130,246,0.5)" : done ? "0 0 10px rgba(34,197,94,0.3)" : "none",
                }}>
                  {done ? (
                    <span style={{ color:"#fff" }}><CheckIcon /></span>
                  ) : (
                    <span style={{ fontSize:13, fontWeight:700, color: active ? "#fff" : "rgba(255,255,255,0.4)" }}>{s.n}</span>
                  )}
                </div>
                <div>
                  <p style={{ margin:0, fontSize:13, fontWeight: active ? 700 : 500, color: active ? "#fff" : done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>
                    {s.label}
                  </p>
                  <p style={{ margin:0, fontSize:11, color: active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)", marginTop:1 }}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative bottom */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"24px" }}>
        <div style={{
          background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)",
          borderRadius:14, padding:"16px",
        }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"rgba(59,130,246,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.8"/>
              <path d="M12 8v4l3 3" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>Complete in 3 mins</p>
          <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>
            Fill out both steps to unlock your personalized internship matches.
          </p>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// TOP BAR (content area)
// ─────────────────────────────────────────────
function ContentTopBar({ step }) {
  const titles = { 1:"Student Details", 2:"Resume & Preferences" };
  const subs = { 1:"Complete your personal profile", 2:"Upload your resume & set internship preferences" };
  return (
    <div style={{
      padding:"20px 36px", borderBottom:"1px solid #F1F5F9",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background:"#fff", position:"sticky", top:0, zIndex:10,
      boxShadow:"0 1px 0 #F1F5F9",
    }}>
      <div>
        <p style={{ margin:0, fontSize:12, fontWeight:600, color:"#3B82F6", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>
          Step {step} of 2
        </p>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:"#0F172A", letterSpacing:"-0.02em" }}>{titles[step]}</h1>
        <p style={{ margin:0, fontSize:13, color:"#94A3B8", marginTop:2 }}>{subs[step]}</p>
      </div>
      <div style={{
        width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#EFF6FF,#E0E7FF)",
        display:"flex", alignItems:"center", justifyContent:"center",
        border:"1px solid #DBEAFE",
      }}>
        <span style={{ fontSize:20 }}>{step === 1 ? "👤" : "📄"}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 1 — Personal Details
// ─────────────────────────────────────────────
function Step1({ onNext }) {
  const [form, setForm] = useState({ studentName:"", dob:"", gender:"", nationality:"", email:"", mobile:"" });
  const [touched, setTouched] = useState({});

  const set = k => v => setForm(p => ({ ...p, [k]: v }));
  const touch = k => () => setTouched(p => ({ ...p, [k]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (touched.mobile && form.mobile && !/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    return e;
  }, [form, touched]);

  const ready = useMemo(() => {
    const req = ["studentName","dob","gender","nationality","mobile"];
    const filled = req.every(f => String(form[f]).trim() !== "");
    const emailOk = form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const mobileOk = /^[6-9]\d{9}$/.test(form.mobile);
    return filled && emailOk && mobileOk && Object.keys(errors).length === 0;
  }, [form, errors]);

  const grid2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" };

  return (
    <form onSubmit={e => { e.preventDefault(); if (ready) onNext(); }}>
      <SectionCard title="Personal Details">
        {/* Full width */}
        <PField label="Student Name" required error={null}>
          <PInput id="studentName" value={form.studentName} onChange={set("studentName")} placeholder="Enter your full name (as per official ID)" />
        </PField>

        <div style={grid2}>
          <PField label="Date of Birth" required>
            <PInput id="dob" type="date" value={form.dob} onChange={set("dob")} placeholder="DD/MM/YYYY" />
          </PField>
          <PField label="Gender" required>
            <PSelect id="gender" value={form.gender} onChange={set("gender")} placeholder="Select gender" options={GENDER_OPTIONS} />
          </PField>
          <PField label="Nationality" required>
            <PSelect id="nationality" value={form.nationality} onChange={set("nationality")} placeholder="Select nationality" options={NATIONALITY_OPTIONS} />
          </PField>
          <PField label="Email Address" error={errors.email}>
            <PInput id="email" type="email" inputMode="email" value={form.email} onChange={set("email")} onBlur={touch("email")} placeholder="name@example.com" error={errors.email} />
          </PField>
          <div style={{ gridColumn:"1 / -1" }}>
            <PField label="Mobile Number" required error={errors.mobile}>
              <PInput id="mobile" type="tel" inputMode="numeric" value={form.mobile}
                onChange={v => { set("mobile")(v.replace(/\D/g,"").slice(0,10)); touch("mobile")(); }}
                onBlur={touch("mobile")} placeholder="10-digit mobile number" error={errors.mobile} />
            </PField>
          </div>
        </div>
      </SectionCard>

      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
        <button type="submit" disabled={!ready} style={{
          minHeight:48, padding:"0 32px", fontSize:15, fontWeight:700, borderRadius:12,
          background: ready ? "linear-gradient(135deg,#3B82F6,#6366F1)" : "#CBD5E1",
          color:"#fff", border:"none", cursor: ready ? "pointer" : "not-allowed",
          boxShadow: ready ? "0 4px 15px rgba(59,130,246,0.35)" : "none",
          transition:"all 0.2s ease", letterSpacing:"0.01em",
        }}>
          Continue to Step 2 →
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────
// STEP 2 — Resume Upload + Preferences
// ─────────────────────────────────────────────
function Step2({ onBack, onFinish }) {
  // Upload
  const [file, setFile] = useState(null);
  const [fileErr, setFileErr] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const dragCount = useRef(0);
  const inputRef = useRef(null);

  const validate = useCallback(c => {
    if (!c) return;
    if (c.type !== "application/pdf") { setFileErr("Please upload a PDF file."); setFile(null); return; }
    if (c.size > MAX_FILE_SIZE) { setFileErr("File is larger than 5 MB."); setFile(null); return; }
    setFileErr(""); setFile(c);
  }, []);

  const onFileChange = e => { validate(e.target.files?.[0]); e.target.value = ""; };
  const onDragEnter = e => { e.preventDefault(); dragCount.current++; setDragOver(true); };
  const onDragLeave = e => { e.preventDefault(); dragCount.current--; if (dragCount.current <= 0) { setDragOver(false); dragCount.current = 0; } };
  const onDragOver = e => e.preventDefault();
  const onDrop = e => { e.preventDefault(); dragCount.current = 0; setDragOver(false); validate(e.dataTransfer.files?.[0]); };

  // Preferences
  const [prefLoc, setPrefLoc] = useState("");
  const [altLoc, setAltLoc] = useState("");
  const [priRole, setPriRole] = useState("");
  const [secRole, setSecRole] = useState("");
  const [touched, setTouched] = useState({ altLoc:false, secRole:false });

  const locErr = touched.altLoc && prefLoc && altLoc && prefLoc === altLoc ? "Alternate location must differ from preferred location." : "";
  const roleErr = touched.secRole && priRole && secRole && priRole === secRole ? "Secondary role must differ from priority role." : "";

  const prefsOk = !!prefLoc && !!altLoc && !!priRole && !!secRole && prefLoc !== altLoc && priRole !== secRole;
  const allOk = !!file && prefsOk;

  const navigate = useNavigate();
  const handle = () => { if (allOk) { console.log("Submitted"); navigate('/profile'); } };

  const grid2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" };

  return (
    <div>
      {/* ── Upload ── */}
      <SectionCard title="Upload Resume">
        {!file ? (
          <div>
            <div
              onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border:`2px dashed ${dragOver ? "#3B82F6" : fileErr ? "#EF4444" : "#CBD5E1"}`,
                borderRadius:14, padding:"40px 24px", textAlign:"center", cursor:"pointer",
                background: dragOver ? "#EFF6FF" : "#FAFBFC",
                transition:"all 0.15s ease",
              }}
            >
              <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><UploadIcon /></div>
              <p style={{ margin:"0 0 4px", fontSize:16, fontWeight:700, color:"#1E293B" }}>Drag & drop your resume here</p>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#94A3B8" }}>or click to browse files</p>
              <button type="button" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }} style={{
                padding:"10px 24px", borderRadius:9, background:"linear-gradient(135deg,#3B82F6,#6366F1)",
                color:"#fff", border:"none", cursor:"pointer", fontSize:14, fontWeight:600,
                boxShadow:"0 2px 10px rgba(59,130,246,0.3)",
              }}>
                Browse Files
              </button>
              <input ref={inputRef} type="file" accept="application/pdf" style={{ display:"none" }} onChange={onFileChange} />
            </div>
            {fileErr && <p style={{ fontSize:12, color:"#EF4444", marginTop:8, fontWeight:500 }}>{fileErr}</p>}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:16 }}>
              {[["Format","PDF only"],["Max Size","5 MB"],["Accepted","Resume PDF"]].map(([l,v]) => (
                <div key={l} style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:9, padding:"10px 14px" }}>
                  <p style={{ margin:0, fontSize:11, color:"#94A3B8", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>{l}</p>
                  <p style={{ margin:"3px 0 0", fontSize:13, fontWeight:700, color:"#334155" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, padding:"16px 20px", background:"#F0FDF4", border:"1.5px solid #86EFAC", borderRadius:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <PdfIcon />
              <div>
                <p style={{ margin:0, fontSize:15, fontWeight:700, color:"#1E293B" }}>{file.name}</p>
                <p style={{ margin:"3px 0 0", fontSize:12, color:"#64748B" }}>{fmtSize(file.size)}</p>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"#16A34A", marginTop:4, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                  <CheckIcon /> Resume Selected
                </span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => inputRef.current?.click()} style={{ padding:"8px 16px", borderRadius:8, border:"1.5px solid #3B82F6", color:"#1D4ED8", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600 }}>Replace</button>
              <button onClick={() => { setFile(null); setFileErr(""); }} style={{ padding:"8px 16px", borderRadius:8, border:"1.5px solid #FECACA", color:"#EF4444", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600 }}>Remove</button>
              <input ref={inputRef} type="file" accept="application/pdf" style={{ display:"none" }} onChange={onFileChange} />
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Divider ── */}
      <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0 20px", color:"#94A3B8", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        <div style={{ flex:1, height:1, background:"#E2E8F0" }} />
        Internship Preferences
        <div style={{ flex:1, height:1, background:"#E2E8F0" }} />
      </div>

      {/* ── Locations ── */}
      <SectionCard title="Preferred Internship Locations">
        <div style={grid2}>
          <Combobox id="prefLoc" label="Preferred Location" value={prefLoc} onChange={setPrefLoc}
            onBlurValidate={() => setTouched(p => ({ ...p, altLoc:true }))}
            options={INDIAN_STATES} placeholder="Select preferred state" />
          <Combobox id="altLoc" label="Alternate Preferred Location" value={altLoc} onChange={setAltLoc}
            onBlurValidate={() => setTouched(p => ({ ...p, altLoc:true }))}
            options={INDIAN_STATES} placeholder="Select alternate state" error={locErr} />
        </div>
      </SectionCard>

      {/* ── Roles ── */}
      <SectionCard title="Preferred Internship Roles">
        <div style={grid2}>
          <Combobox id="priRole" label="Priority Role" value={priRole} onChange={setPriRole}
            onBlurValidate={() => setTouched(p => ({ ...p, secRole:true }))}
            options={INTERNSHIP_ROLES} placeholder="Select priority role" />
          <Combobox id="secRole" label="Secondary Role" value={secRole} onChange={setSecRole}
            onBlurValidate={() => setTouched(p => ({ ...p, secRole:true }))}
            options={INTERNSHIP_ROLES} placeholder="Select secondary role" error={roleErr} />
        </div>
      </SectionCard>

      {/* ── Summary ── */}
      <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:14, padding:"18px 22px", marginBottom:20 }}>
        <p style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:"#0F172A" }}>Selected Preferences</p>
        {[
          ["Preferred Location", prefLoc],
          ["Alternate Location", altLoc],
          ["Priority Role", priRole],
          ["Secondary Role", secRole],
        ].map(([label, val], i) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderTop: i > 0 ? "1px solid #E2E8F0" : "none" }}>
            <span style={{ fontSize:13, color:"#64748B", fontWeight:600 }}>{label}</span>
            <span style={{ fontSize:13, color: val ? "#1E293B" : "#CBD5E1", fontWeight: val ? 600 : 400, fontStyle: val ? "normal" : "italic" }}>
              {val || "Not selected yet"}
            </span>
          </div>
        ))}
      </div>

      {/* ── Actions ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
        <button onClick={onBack} style={{
          minHeight:48, padding:"0 24px", fontSize:15, fontWeight:600, borderRadius:12,
          background:"#fff", color:"#475569", border:"1.5px solid #E2E8F0", cursor:"pointer",
        }}>
          ← Back
        </button>
        <button onClick={handle} disabled={!allOk} style={{
          minHeight:48, padding:"0 32px", fontSize:15, fontWeight:700, borderRadius:12,
          background: allOk ? "linear-gradient(135deg,#3B82F6,#6366F1)" : "#CBD5E1",
          color:"#fff", border:"none", cursor: allOk ? "pointer" : "not-allowed",
          boxShadow: allOk ? "0 4px 15px rgba(59,130,246,0.35)" : "none",
          transition:"all 0.2s ease",
        }}>
          Find My Internships 🚀
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function OnboardingDashboard() {
  const [step, setStep] = useState(1);

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif", background:"#F8FAFC" }}>

      {/* Global reset */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8FAFC; }
        input, select, button, textarea { font-family: inherit; }
        button { cursor: pointer; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
      `}</style>

      {/* ── Sidebar ── */}
      <Sidebar step={step} />

      {/* ── Main Content ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh", overflowY:"auto" }}>
        <ContentTopBar step={step} />
        <main style={{ flex:1, padding:"32px 36px 60px", maxWidth:780, width:"100%" }}>
          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 onBack={() => setStep(1)} />}
        </main>
      </div>
    </div>
  );
}
