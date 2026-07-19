// @ts-nocheck
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// Label map
// ============================================================
const LABELS = {
  stepIndicator: "Step 2 of 2",
  stepName: "Resume & Preferences",

  pageTitle: "Upload Resume & Set Preferences",
  pageSubtitle:
    "Upload your resume and tell us your internship preferences so we can recommend the best opportunities for you.",

  // ---- Upload ----
  uploadCardHeading: "Upload Resume",
  uploadHeading: "Drag and drop your resume here",
  uploadOr: "OR",
  uploadBrowseBtn: "Browse Files",
  uploadFormatLabel: "Supported Format",
  uploadFormatValue: "PDF (.pdf)",
  uploadSizeLabel: "Maximum File Size",
  uploadSizeValue: "5 MB",
  uploadAcceptedLabel: "Accepted File",
  uploadAcceptedValue: "Resume PDF only",

  fileSelectedStatus: "Resume Selected",
  actionReplace: "Replace File",
  actionRemove: "Remove File",

  errorInvalidType: "Please upload a PDF file.",
  errorTooLarge: "File is larger than 5 MB. Please choose a smaller file.",



  // ---- Preferences ----
  prefTitle: "Internship Preferences",
  prefSubtitle: "Tell us your preferences so we can match you with the right opportunities.",

  sectionLocationsTitle: "Preferred Internship Locations",
  preferredLocation: "Preferred Location",
  preferredLocationPlaceholder: "Select your preferred internship location",
  alternateLocation: "Alternate Preferred Location",
  alternateLocationPlaceholder: "Select your second preferred internship location",
  locationDuplicateError: "Your alternate preferred location must be different from your first preference.",

  sectionRolesTitle: "Preferred Internship Roles",
  priorityRole: "Priority Role",
  priorityRolePlaceholder: "Select your preferred internship role",
  secondaryRole: "Secondary Role",
  secondaryRolePlaceholder: "Select your second preferred internship role",
  roleDuplicateError: "Your secondary role must be different from your priority role.",

  sectionInternshipDetailsTitle: "Internship Details",
  sector: "Sector",
  sectorPlaceholder: "Select Sector",
  fields: "Fields",
  fieldsPlaceholder: "Select Field",

  searchPlaceholder: "Type to search...",
  noResults: "No matches found",

  summaryTitle: "Selected Preferences",
  summaryPreferredLocation: "Preferred Location",
  summaryAlternateLocation: "Alternate Preferred Location",
  summaryPriorityRole: "Priority Role",
  summarySecondaryRole: "Secondary Role",
  summaryNotSelected: "Not selected yet",

  // ---- Actions ----
  btnPrevious: "Previous",
  btnFindInternships: "Find My Internships",
};

// ============================================================
// Data
// ============================================================
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const INTERNSHIP_ROLES = [
  "Finance Intern", "Accounting Intern", "Banking & Financial Services Intern",
  "Business Operations Intern", "Business Analyst Intern", "Human Resources (HR) Intern",
  "Marketing Intern", "Sales & Business Development Intern",
  "Project Management Intern", "Supply Chain & Logistics Intern",
];

const SECTOR_OPTIONS = [
  "Agriculture and Allied", "Automotive", "Aviation and Defense",
  "Banking and Financial Services", "Cement and Building Materials", "Chemical Industry",
  "Consulting Services", "Diversified Conglomerates", "E-commerce / Digital Commerce",
  "Electronics and Consumer Electronics", "Engineering / Design Services",
  "Facilities Management & Business Management", "FinTech",
  "FMCG (Fast-Moving Consumer Goods)", "Gems and Jewellery", "Healthcare", "Housing",
  "Infrastructure and Construction", "IT and Software Development", "Leather and Products",
  "Logistics and Supply Chain", "Manufacturing and Industrial",
  "Media, Entertainment and Education", "Metals and Mining", "Oil, Gas and Energy",
  "Pharmaceutical", "Retail and Consumer Durables", "Shipping / Maritime", "Sports",
  "Telecom", "Textile Manufacturing", "Travel & Hospitality",
  "Workforce Solutions / HR Services",
];

const FIELDS_OPTIONS = [
  "Administration", "Business Development", "Compliance and Risk Management",
  "Construction Management", "Corporate Law", "Customer Care / Service", "Distribution",
  "Finance & Accounting", "Human Resources", "Information / Cyber Security",
  "Information Technology", "Law", "Maintenance", "Operations Management",
  "Production / Manufacturing", "Public Relations", "Purchase / Procurement",
  "Quality Control and Assurance",
  "Research and Development / Design / Product Development",
  "Sales & Marketing", "Supply Chain Management", "Training and Development",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const PROGRESS_PERCENT = 100;

// ============================================================
// Helpers
// ============================================================
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ============================================================
// Icons
// ============================================================
function PdfIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 4h16l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="#0F6CBD" strokeWidth="2" fill="#EAF2FA" />
      <path d="M28 4v8h8" stroke="#0F6CBD" strokeWidth="2" fill="none" />
      <text x="24" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F6CBD">PDF</text>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="gds-info-icon">
      <circle cx="10" cy="10" r="9" stroke="#0F6CBD" strokeWidth="1.5" />
      <rect x="9.1" y="8.5" width="1.8" height="5.5" rx="0.5" fill="#0F6CBD" />
      <rect x="9.1" y="5.5" width="1.8" height="1.8" rx="0.5" fill="#0F6CBD" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3.5" y="8" width="11" height="7.5" rx="1.5" stroke="#0F6CBD" strokeWidth="1.4" />
      <path d="M5.5 8V5.5a3.5 3.5 0 0 1 7 0V8" stroke="#0F6CBD" strokeWidth="1.4" fill="none" />
      <circle cx="9" cy="11.6" r="1.1" fill="#0F6CBD" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="#1E7A34" stroke="#1E7A34" strokeWidth="1.5" />
      <path d="M6.5 11.2L9.3 14L15.5 7.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
      <path d="M1 1.5L7 7.5L13 1.5" stroke="#5B6470" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.2" stroke="#5B6470" strokeWidth="1.6" fill="none" />
      <path d="M11 11L14.5 14.5" stroke="#5B6470" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.2L5.5 10.2L11.5 3.8" stroke="#0F6CBD" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================
// Progress Bar
// ============================================================
function OnboardingProgressBar({ percent, stepIndicator, stepName }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedPercent(percent));
    return () => cancelAnimationFrame(raf);
  }, [percent]);

  return (
    <div className="gds-progress-block">
      <div className="gds-progress-heading-row">
        <span className="gds-step-label">{stepIndicator}</span>
        <span className="gds-step-percent">{percent}%</span>
      </div>
      <p className="gds-step-name">{stepName}</p>
      <div className="gds-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="gds-progress-fill" style={{ width: `${animatedPercent}%` }} />
      </div>
    </div>
  );
}

// ============================================================
// Upload Card
// ============================================================
function UploadCard({ file, error, isDragOver, onBrowseClick, onFileChange, onRemove, onReplaceClick, dragHandlers, inputRef }) {
  if (file) {
    return (
      <div className="gds-file-summary" role="status">
        <div className="gds-file-summary-left">
          <PdfIcon size={40} />
          <div>
            <p className="gds-file-name">{file.name}</p>
            <p className="gds-file-meta">{formatFileSize(file.size)}</p>
            <span className="gds-file-status-badge"><CheckCircleIcon />{LABELS.fileSelectedStatus}</span>
          </div>
        </div>
        <div className="gds-file-summary-actions">
          <button type="button" className="gds-btn gds-btn-outline gds-btn-sm" onClick={onReplaceClick}>{LABELS.actionReplace}</button>
          <button type="button" className="gds-btn gds-btn-text gds-btn-sm" onClick={onRemove}>{LABELS.actionRemove}</button>
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" className="gds-visually-hidden" onChange={onFileChange} aria-hidden="true" tabIndex={-1} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="gds-upload-card-heading">{LABELS.uploadCardHeading}</h2>
      <div
        className={`gds-dropzone${isDragOver ? " gds-dropzone-dragover" : ""}${error ? " gds-dropzone-error" : ""}`}
        role="button" tabIndex={0}
        aria-label="Upload your resume. Drag and drop a PDF file here, or activate to browse files."
        onClick={onBrowseClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onBrowseClick(); } }}
        {...dragHandlers}
      >
        <PdfIcon size={56} />
        <p className="gds-dropzone-heading">{LABELS.uploadHeading}</p>
        <p className="gds-dropzone-or">{LABELS.uploadOr}</p>
        <button type="button" className="gds-btn gds-btn-primary gds-btn-sm" onClick={(e) => { e.stopPropagation(); onBrowseClick(); }}>
          {LABELS.uploadBrowseBtn}
        </button>
        <input ref={inputRef} type="file" accept="application/pdf" className="gds-visually-hidden" onChange={onFileChange} aria-hidden="true" tabIndex={-1} />
      </div>
      {error && <p className="gds-error" role="alert">{error}</p>}
      <div className="gds-upload-meta">
        <div className="gds-upload-meta-item">
          <span className="gds-upload-meta-label">{LABELS.uploadFormatLabel}</span>
          <span className="gds-upload-meta-value">{LABELS.uploadFormatValue}</span>
        </div>
        <div className="gds-upload-meta-item">
          <span className="gds-upload-meta-label">{LABELS.uploadSizeLabel}</span>
          <span className="gds-upload-meta-value">{LABELS.uploadSizeValue}</span>
        </div>
        <div className="gds-upload-meta-item">
          <span className="gds-upload-meta-label">{LABELS.uploadAcceptedLabel}</span>
          <span className="gds-upload-meta-value">{LABELS.uploadAcceptedValue}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Searchable Select (combobox)
// ============================================================
function SearchableSelect({ id, label, value, onChange, onBlurValidate, options, placeholder, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const listboxId = `${id}-listbox`;

  useEffect(() => { setQuery(value || ""); }, [value]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value?.toLowerCase()) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [query, options, value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery(value || "");
        if (onBlurValidate) onBlurValidate();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, onBlurValidate]);

  const selectOption = (opt) => {
    onChange(opt); setQuery(opt); setIsOpen(false); setActiveIndex(-1);
    if (onBlurValidate) onBlurValidate(opt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!isOpen) setIsOpen(true); setActiveIndex((p) => Math.min(p + 1, filteredOptions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) selectOption(filteredOptions[activeIndex]); }
    else if (e.key === "Escape") { setIsOpen(false); setQuery(value || ""); }
  };

  return (
    <div className="gds-combobox" ref={wrapperRef}>
      <label htmlFor={id} className="gds-label">
        <span>{label}</span><span className="gds-required" aria-hidden="true">*</span>
      </label>
      <div className={`gds-combobox-control${error ? " gds-input-error" : ""}`}>
        <SearchIcon />
        <input
          id={id} type="text" role="combobox"
          aria-expanded={isOpen} aria-controls={listboxId} aria-autocomplete="list" aria-invalid={!!error}
          className="gds-combobox-input" placeholder={placeholder} value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <span className="gds-combobox-chevron"><ChevronDownIcon /></span>
      </div>
      {isOpen && (
        <ul className="gds-combobox-listbox" role="listbox" id={listboxId}>
          {filteredOptions.length === 0 ? (
            <li className="gds-combobox-empty">{LABELS.noResults}</li>
          ) : (
            filteredOptions.map((opt, idx) => (
              <li key={opt} role="option" aria-selected={opt === value}
                className={`gds-combobox-option${idx === activeIndex ? " gds-combobox-option-active" : ""}${opt === value ? " gds-combobox-option-selected" : ""}`}
                onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span>{opt}</span>{opt === value && <CheckIcon />}
              </li>
            ))
          )}
        </ul>
      )}
      {error && <p className="gds-error" role="alert">{error}</p>}
    </div>
  );
}

// ============================================================
// Preferences Summary Card
// ============================================================
function SummaryRow({ label, value }) {
  return (
    <div className="gds-summary-row">
      <span className="gds-summary-label">{label}</span>
      <span className={`gds-summary-value${value ? "" : " gds-summary-value-empty"}`}>{value || LABELS.summaryNotSelected}</span>
    </div>
  );
}

function PreferencesSummary({ preferredLocation, alternateLocation, priorityRole, secondaryRole }) {
  return (
    <div className="gds-summary-card" aria-live="polite">
      <h2 className="gds-summary-title">{LABELS.summaryTitle}</h2>
      <SummaryRow label={LABELS.summaryPreferredLocation} value={preferredLocation} />
      <SummaryRow label={LABELS.summaryAlternateLocation} value={alternateLocation} />
      <SummaryRow label={LABELS.summaryPriorityRole} value={priorityRole} />
      <SummaryRow label={LABELS.summarySecondaryRole} value={secondaryRole} />
    </div>
  );
}

// ============================================================
// Main Page Component
// ============================================================
export default function ResumeUploadPage() {
  const navigate = useNavigate();

  // ---- Upload state ----
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef(null);

  // ---- Preferences state ----
  const [preferredLocation, setPreferredLocation] = useState("");
  const [alternateLocation, setAlternateLocation] = useState("");
  const [priorityRole, setPriorityRole] = useState("");
  const [secondaryRole, setSecondaryRole] = useState("");
  const [sector, setSector] = useState("");
  const [fields, setFields] = useState("");
  const [touched, setTouched] = useState({ alternateLocation: false, secondaryRole: false });

  const locationError = touched.alternateLocation && preferredLocation && alternateLocation && preferredLocation === alternateLocation
    ? LABELS.locationDuplicateError : "";
  const roleError = touched.secondaryRole && priorityRole && secondaryRole && priorityRole === secondaryRole
    ? LABELS.roleDuplicateError : "";

  const isPrefsComplete = !!preferredLocation && !!alternateLocation && !!priorityRole && !!secondaryRole
    && !!sector && !!fields
    && preferredLocation !== alternateLocation && priorityRole !== secondaryRole;

  const isFormComplete = !!file && isPrefsComplete;

  // ---- File handlers ----
  const validateAndSetFile = useCallback((candidate) => {
    if (!candidate) return;
    if (candidate.type !== "application/pdf") { setFileError(LABELS.errorInvalidType); setFile(null); return; }
    if (candidate.size > MAX_FILE_SIZE_BYTES) { setFileError(LABELS.errorTooLarge); setFile(null); return; }
    setFileError(""); setFile(candidate);
  }, []);

  const handleFileChange = (e) => { const c = e.target.files?.[0]; validateAndSetFile(c); e.target.value = ""; };
  const handleBrowseClick = () => inputRef.current?.click();
  const handleRemove = () => { setFile(null); setFileError(""); };

  const handleDragEnter = (e) => { e.preventDefault(); dragCounter.current += 1; setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); dragCounter.current -= 1; if (dragCounter.current <= 0) { setIsDragOver(false); dragCounter.current = 0; } };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => { e.preventDefault(); dragCounter.current = 0; setIsDragOver(false); validateAndSetFile(e.dataTransfer.files?.[0]); };

  const dragHandlers = { onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop };

  const handleSubmit = async () => {
    if (!isFormComplete || isUploading) return;
    setIsUploading(true);
    setFileError("");

    try {
      // 1. Upload file to Edlyn Parser Backend (Port 8000)
      const formData = new FormData();
      formData.append("file", file);

      const parseResponse = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error(`Resume parsing failed with status: ${parseResponse.statusText}`);
      }

      const parsedData = await parseResponse.json();

      // Log results exactly as in Edlyn's dummy frontend procedure
      console.clear();
      console.log("========== RESUME PARSER ==========");
      console.log("Name:", parsedData.name);
      console.log("Email:", parsedData.email);
      console.log("Phone:", parsedData.phone);
      console.log("CGPA:", parsedData.cgpa);
      console.log("Skills:", parsedData.skills);
      console.log("Frameworks:", parsedData.frameworks);
      console.log("Tools:", parsedData.tools);
      console.log("Roles:", parsedData.roles);
      console.log("==================================");

      // Save to localStorage for other pages
      localStorage.setItem("parsedResume", JSON.stringify(parsedData));

      // 2. Fetch matches from Model Recommendation Server (Port 8001)
      // Build a query role using priority, secondary, and parsed roles/skills
      const queryRole = `${priorityRole} ${secondaryRole} ${parsedData.roles?.join(" ") || ""} ${parsedData.skills?.join(" ") || ""}`.trim();
      
      const recommendResponse = await fetch("http://127.0.0.1:8001/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: queryRole,
          top_k: 5
        }),
      });

      if (!recommendResponse.ok) {
        throw new Error(`Recommendation search failed with status: ${recommendResponse.statusText}`);
      }

      const recommendations = await recommendResponse.json();
      localStorage.setItem("recommendedCompanies", JSON.stringify(recommendations));

      navigate('/recommended');
    } catch (err) {
      console.error("UPLOAD/MATCH ERROR:", err);
      setFileError(`Integration error: ${err.message || err.toString()}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="gds-page">
      <style>{`
        :root {
          --gds-blue: #0F6CBD;
          --gds-blue-dark: #0B4F8F;
          --gds-border: #D1D5DB;
          --gds-text: #1A1A1A;
          --gds-text-muted: #5B6470;
          --gds-bg: #FFFFFF;
          --gds-bg-subtle: #F7F9FB;
          --gds-error: #B3261E;
          --gds-success: #1E7A34;
          --gds-radius: 6px;
        }
        * { box-sizing: border-box; }
        .gds-page {
          background: var(--gds-bg);
          color: var(--gds-text);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          min-height: 100vh;
          padding: 0 0 96px 0;
        }
        .gds-container { max-width: 1200px; margin: 0 auto; padding: 24px 24px; }

        /* Progress */
        .gds-progress-block { margin-bottom: 24px; }
        .gds-progress-heading-row { display: flex; align-items: baseline; justify-content: space-between; }
        .gds-step-label { font-size: 14px; font-weight: 700; color: var(--gds-blue-dark); letter-spacing: 0.02em; text-transform: uppercase; }
        .gds-step-percent { font-size: 13px; font-weight: 600; color: var(--gds-text-muted); }
        .gds-step-name { font-size: 13px; color: var(--gds-text-muted); margin: 2px 0 10px 0; }
        .gds-progress-track { height: 8px; background: #E5E7EB; border-radius: 999px; overflow: hidden; }
        .gds-progress-fill { height: 100%; background: var(--gds-blue); border-radius: 999px; transition: width 0.7s ease; }

        /* Header */
        .gds-page-title { font-size: 28px; line-height: 1.25; font-weight: 700; margin: 0 0 8px 0; color: var(--gds-text); }
        .gds-page-subtitle { font-size: 16px; line-height: 1.5; color: var(--gds-text-muted); margin: 0 0 28px 0; max-width: 62ch; }

        /* Section */
        .gds-section { border: 1px solid var(--gds-border); border-radius: var(--gds-radius); padding: 20px; margin-bottom: 20px; background: var(--gds-bg); }
        .gds-section-title { font-size: 18px; font-weight: 700; margin: 0 0 4px 0; padding-bottom: 12px; border-bottom: 1px solid var(--gds-border); }
        .gds-section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; padding-top: 16px; }
        @media (max-width: 640px) { .gds-section-grid { grid-template-columns: 1fr; } }

        /* Two-column layout */
        .gds-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .gds-col-panel {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .gds-panel-heading {
          font-size: 15px;
          font-weight: 700;
          color: var(--gds-text);
          margin: 0 0 14px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid var(--gds-blue);
          display: inline-block;
        }
        @media (max-width: 860px) {
          .gds-two-col { grid-template-columns: 1fr; }
        }

        /* Divider between upload and preferences */
        .gds-section-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 28px 0;
          color: var(--gds-text-muted); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
        }
        .gds-section-divider::before, .gds-section-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--gds-border);
        }

        /* Upload */
        .gds-upload-card-heading { font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: var(--gds-text); }
        .gds-dropzone {
          border: 2px dashed var(--gds-border); border-radius: var(--gds-radius); background: var(--gds-bg);
          padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease;
        }
        .gds-dropzone:hover { background: var(--gds-bg-subtle); border-color: var(--gds-blue); }
        .gds-dropzone:focus-visible { outline: 3px solid rgba(15,108,189,0.4); outline-offset: 2px; }
        .gds-dropzone-dragover { background: #EAF2FA; border-color: var(--gds-blue); }
        .gds-dropzone-error { border-color: var(--gds-error); }
        .gds-dropzone-heading { font-size: 17px; font-weight: 600; color: var(--gds-text); margin: 14px 0 6px 0; }
        .gds-dropzone-or { font-size: 13px; font-weight: 600; color: var(--gds-text-muted); margin: 0 0 14px 0; letter-spacing: 0.04em; }
        .gds-upload-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
        .gds-upload-meta-item { background: var(--gds-bg-subtle); border: 1px solid var(--gds-border); border-radius: var(--gds-radius); padding: 12px 14px; display: flex; flex-direction: column; gap: 2px; }
        .gds-upload-meta-label { font-size: 12px; color: var(--gds-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }
        .gds-upload-meta-value { font-size: 14px; font-weight: 600; color: var(--gds-text); }
        @media (max-width: 560px) { .gds-upload-meta { grid-template-columns: 1fr; } }
        .gds-file-summary { border: 1.5px solid var(--gds-success); background: #F2FAF4; border-radius: var(--gds-radius); padding: 18px 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
        .gds-file-summary-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
        .gds-file-name { font-size: 15px; font-weight: 700; color: var(--gds-text); margin: 0 0 2px 0; word-break: break-word; }
        .gds-file-meta { font-size: 13px; color: var(--gds-text-muted); margin: 0 0 6px 0; }
        .gds-file-status-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--gds-success); text-transform: uppercase; letter-spacing: 0.02em; }
        .gds-file-summary-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        /* Info / privacy */
        .gds-info-card { display: flex; gap: 12px; background: var(--gds-bg-subtle); border: 1px solid var(--gds-border); border-radius: var(--gds-radius); padding: 16px 18px; margin-bottom: 20px; }
        .gds-info-card-title { font-size: 15px; font-weight: 700; margin: 0 0 4px 0; color: var(--gds-text); }
        .gds-info-card-body { font-size: 14px; line-height: 1.5; color: var(--gds-text-muted); margin: 0; }
        .gds-privacy-note { display: flex; align-items: flex-start; gap: 10px; background: var(--gds-bg-subtle); border: 1px solid var(--gds-border); border-radius: var(--gds-radius); padding: 14px 16px; margin: 4px 0 28px 0; }
        .gds-info-icon { flex-shrink: 0; margin-top: 1px; }
        .gds-privacy-title { font-size: 14px; font-weight: 700; color: var(--gds-text); margin: 0 0 2px 0; }
        .gds-privacy-text { font-size: 14px; line-height: 1.5; color: var(--gds-text-muted); margin: 0; }

        /* Preferences header */
        .gds-pref-heading { font-size: 22px; font-weight: 700; color: var(--gds-text); margin: 0 0 6px 0; }
        .gds-pref-subheading { font-size: 15px; color: var(--gds-text-muted); margin: 0 0 20px 0; }

        /* Combobox */
        .gds-label { display: block; font-size: 15px; font-weight: 600; color: var(--gds-text); margin-bottom: 6px; }
        .gds-required { color: var(--gds-error); margin-left: 2px; }
        .gds-combobox { position: relative; margin-bottom: 20px; }
        .gds-combobox-control { display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 14px; background: var(--gds-bg); border: 1.5px solid var(--gds-border); border-radius: var(--gds-radius); transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .gds-combobox-control:focus-within { border-color: var(--gds-blue); box-shadow: 0 0 0 3px rgba(15,108,189,0.25); }
        .gds-input-error { border-color: var(--gds-error) !important; }
        .gds-combobox-input { flex: 1; min-width: 0; border: none; outline: none; font-size: 16px; font-family: inherit; color: var(--gds-text); background: transparent; padding: 12px 0; }
        .gds-combobox-input::placeholder { color: #8A929C; }
        .gds-combobox-chevron { display: flex; align-items: center; flex-shrink: 0; }
        .gds-combobox-listbox { position: absolute; z-index: 20; top: calc(100% + 4px); left: 0; right: 0; max-height: 240px; overflow-y: auto; background: #fff; border: 1.5px solid var(--gds-border); border-radius: var(--gds-radius); box-shadow: 0 8px 20px rgba(0,0,0,0.12); margin: 0; padding: 6px; list-style: none; }
        .gds-combobox-option { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; font-size: 15px; color: var(--gds-text); border-radius: 4px; cursor: pointer; }
        .gds-combobox-option-active { background: var(--gds-bg-subtle); }
        .gds-combobox-option-selected { font-weight: 600; color: var(--gds-blue-dark); }
        .gds-combobox-empty { padding: 12px; font-size: 14px; color: var(--gds-text-muted); text-align: center; }

        /* Summary */
        .gds-summary-card { border: 1px solid var(--gds-border); border-radius: var(--gds-radius); background: var(--gds-bg-subtle); padding: 18px 20px; margin-bottom: 24px; }
        .gds-summary-title { font-size: 16px; font-weight: 700; margin: 0 0 12px 0; color: var(--gds-text); }
        .gds-summary-row { display: flex; justify-content: space-between; gap: 12px; padding: 9px 0; border-top: 1px solid var(--gds-border); }
        .gds-summary-row:first-of-type { border-top: none; }
        .gds-summary-label { font-size: 14px; color: var(--gds-text-muted); font-weight: 600; flex-shrink: 0; }
        .gds-summary-value { font-size: 14px; color: var(--gds-text); font-weight: 600; text-align: right; }
        .gds-summary-value-empty { color: #8A929C; font-weight: 400; font-style: italic; }
        @media (max-width: 480px) { .gds-summary-row { flex-direction: column; gap: 2px; } .gds-summary-value { text-align: left; } }

        /* Errors */
        .gds-error { font-size: 13px; color: var(--gds-error); margin: 10px 0 0 0; font-weight: 600; }

        /* Buttons */
        .gds-btn { min-height: 48px; padding: 12px 24px; font-size: 16px; font-weight: 600; border-radius: var(--gds-radius); cursor: pointer; border: 1.5px solid transparent; transition: background 0.15s ease, border-color 0.15s ease; font-family: inherit; }
        .gds-btn:focus-visible { outline: 3px solid rgba(15,108,189,0.4); outline-offset: 2px; }
        .gds-btn-sm { min-height: 40px; padding: 9px 16px; font-size: 14px; }
        .gds-btn-secondary { background: var(--gds-bg); border-color: var(--gds-border); color: var(--gds-text); }
        .gds-btn-secondary:hover { background: var(--gds-bg-subtle); }
        .gds-btn-outline { background: var(--gds-bg); border-color: var(--gds-blue); color: var(--gds-blue-dark); }
        .gds-btn-outline:hover { background: rgba(15,108,189,0.06); }
        .gds-btn-text { background: transparent; border-color: transparent; color: var(--gds-error); padding-left: 8px; padding-right: 8px; }
        .gds-btn-text:hover { background: rgba(179,38,30,0.06); }
        .gds-btn-primary { background: var(--gds-blue); border-color: var(--gds-blue); color: #fff; }
        .gds-btn-primary:hover:not(:disabled) { background: var(--gds-blue-dark); }
        .gds-btn-primary:disabled { background: #B7C6D6; border-color: #B7C6D6; cursor: not-allowed; color: #fff; }

        /* Actions */
        .gds-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; }
        @media (max-width: 480px) {
          .gds-actions { flex-direction: column-reverse; align-items: stretch; }
          .gds-actions .gds-btn { width: 100%; }
          .gds-file-summary { flex-direction: column; align-items: flex-start; }
          .gds-file-summary-actions { width: 100%; }
          .gds-file-summary-actions .gds-btn { flex: 1; }
        }
        .gds-visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        @media (prefers-reduced-motion: reduce) { .gds-progress-fill { transition: none; } }
      `}</style>

      <div className="gds-container">
        {/* Progress */}
        <OnboardingProgressBar percent={PROGRESS_PERCENT} stepIndicator={LABELS.stepIndicator} stepName={LABELS.stepName} />

        {/* Header */}
        <header>
          <h1 className="gds-page-title">{LABELS.pageTitle}</h1>
          <p className="gds-page-subtitle">{LABELS.pageSubtitle}</p>
        </header>

        {/* ===== TWO-COLUMN LAYOUT ===== */}
        <div className="gds-two-col">

          {/* ── LEFT: Upload ── */}
          <div className="gds-col-panel">
            <span className="gds-panel-heading">📄 Resume Upload</span>
            <section className="gds-section" aria-labelledby="section-upload" style={{ marginBottom: 0 }}>
              {!file && <span className="gds-visually-hidden" id="section-upload" />}
              <UploadCard
                file={file} error={fileError} isDragOver={isDragOver}
                onBrowseClick={handleBrowseClick} onFileChange={handleFileChange}
                onRemove={handleRemove} onReplaceClick={handleBrowseClick}
                dragHandlers={dragHandlers} inputRef={inputRef}
              />
            </section>
          </div>

          {/* ── RIGHT: Preferences ── */}
          <div className="gds-col-panel">
            <span className="gds-panel-heading">🎯 Internship Preferences</span>

            <div className="gds-section" style={{ marginBottom: 16 }}>
              {/* Locations */}
              <section aria-labelledby="section-locations">
                <h2 className="gds-section-title" id="section-locations">{LABELS.sectionLocationsTitle}</h2>
                <div className="gds-section-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <SearchableSelect
                    id="preferredLocation" label={LABELS.preferredLocation}
                    value={preferredLocation} onChange={setPreferredLocation}
                    onBlurValidate={() => setTouched((p) => ({ ...p, alternateLocation: true }))}
                    options={INDIAN_STATES} placeholder={LABELS.preferredLocationPlaceholder}
                  />
                  <SearchableSelect
                    id="alternateLocation" label={LABELS.alternateLocation}
                    value={alternateLocation} onChange={setAlternateLocation}
                    onBlurValidate={() => setTouched((p) => ({ ...p, alternateLocation: true }))}
                    options={INDIAN_STATES} placeholder={LABELS.alternateLocationPlaceholder}
                    error={locationError}
                  />
                </div>
              </section>

              {/* Roles */}
              <section aria-labelledby="section-roles" style={{ marginTop: 4 }}>
                <h2 className="gds-section-title" id="section-roles">{LABELS.sectionRolesTitle}</h2>
                <div className="gds-section-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <SearchableSelect
                    id="priorityRole" label={LABELS.priorityRole}
                    value={priorityRole} onChange={setPriorityRole}
                    onBlurValidate={() => setTouched((p) => ({ ...p, secondaryRole: true }))}
                    options={INTERNSHIP_ROLES} placeholder={LABELS.priorityRolePlaceholder}
                  />
                  <SearchableSelect
                    id="secondaryRole" label={LABELS.secondaryRole}
                    value={secondaryRole} onChange={setSecondaryRole}
                    onBlurValidate={() => setTouched((p) => ({ ...p, secondaryRole: true }))}
                    options={INTERNSHIP_ROLES} placeholder={LABELS.secondaryRolePlaceholder}
                    error={roleError}
                  />
                </div>
              </section>

              {/* Internship Details — Sector & Fields */}
              <section aria-labelledby="section-details" style={{ marginTop: 4 }}>
                <h2 className="gds-section-title" id="section-details">{LABELS.sectionInternshipDetailsTitle}</h2>
                <div className="gds-section-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <SearchableSelect
                    id="sector" label={LABELS.sector}
                    value={sector} onChange={setSector}
                    options={SECTOR_OPTIONS} placeholder={LABELS.sectorPlaceholder}
                  />
                  <SearchableSelect
                    id="fields" label={LABELS.fields}
                    value={fields} onChange={setFields}
                    options={FIELDS_OPTIONS} placeholder={LABELS.fieldsPlaceholder}
                  />
                </div>
              </section>
            </div>

          </div>
        </div>

        {/* ===== BOTTOM ACTIONS ===== */}
        <div className="gds-actions" style={{ marginTop: 28 }}>
          <button type="button" className="gds-btn gds-btn-secondary" onClick={() => navigate('/onboarding/student-details')}>
            {LABELS.btnPrevious}
          </button>
          <button 
            type="button" 
            className="gds-btn gds-btn-primary" 
            disabled={!isFormComplete || isUploading} 
            onClick={handleSubmit}
          >
            {isUploading ? "Analyzing & Matching..." : LABELS.btnFindInternships}
          </button>
        </div>
      </div>
    </div>
  );
}
