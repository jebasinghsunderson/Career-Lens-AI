// @ts-nocheck
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// Label map (content unchanged)
// ============================================================
const LABELS = {
  stepIndicator: "Step 2 of 2",
  stepName: "Resume & Preferences",
  pageTitle: "Upload Resume & Set Preferences",
  pageSubtitle: "Upload your resume and tell us your internship preferences so we can recommend the best opportunities for you.",

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
  summaryAlternateLocation: "Alternate Location",
  summaryPriorityRole: "Priority Role",
  summarySecondaryRole: "Secondary Role",
  summaryNotSelected: "Not selected yet",

  btnPrevious: "Previous",
  btnFindInternships: "Find My Internships",
};

// ============================================================
// Data (unchanged)
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

// ============================================================
// Helpers
// ============================================================
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ============================================================
// Searchable Select (logic unchanged, styled fresh)
// ============================================================
function SearchableSelect({ id, label, value, onChange, onBlurValidate, options, placeholder, error, required = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => { setQuery(value || ""); }, [value]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value?.toLowerCase()) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [query, options, value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false); setQuery(value || "");
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
    <div className="ru-combobox" ref={wrapperRef}>
      <label htmlFor={id} className="ru-label">
        <span>{label}</span>
        {required && <span className="ru-required" aria-hidden="true">*</span>}
      </label>
      <div className={`ru-combobox-control${error ? " ru-input-error" : ""}${isOpen ? " ru-combobox-open" : ""}`}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{flexShrink:0, opacity:0.4}}>
          <circle cx="7" cy="7" r="5.2" stroke="#e8edf5" strokeWidth="1.6" fill="none"/>
          <path d="M11 11L14.5 14.5" stroke="#e8edf5" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <input
          id={id} type="text" role="combobox"
          aria-expanded={isOpen} aria-autocomplete="list" aria-invalid={!!error}
          className="ru-combobox-input" placeholder={placeholder} value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true" style={{flexShrink:0, opacity:0.4, transition:'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'}}>
          <path d="M1 1L6 6L11 1" stroke="#e8edf5" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {isOpen && (
        <ul className="ru-combobox-listbox" role="listbox">
          {filteredOptions.length === 0 ? (
            <li className="ru-combobox-empty">{LABELS.noResults}</li>
          ) : (
            filteredOptions.map((opt, idx) => (
              <li key={opt} role="option" aria-selected={opt === value}
                className={`ru-combobox-option${idx === activeIndex ? " ru-combobox-active" : ""}${opt === value ? " ru-combobox-selected" : ""}`}
                onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span>{opt}</span>
                {opt === value && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.2L5.5 10.2L11.5 3.8" stroke="#6366f1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </li>
            ))
          )}
        </ul>
      )}
      {error && <p className="ru-error" role="alert">{error}</p>}
    </div>
  );
}

// ============================================================
// Main Page Component
// ============================================================
import { uploadResume } from "../services/resumeApi";
import type { ResumeParseResponse } from "../services/resumeApi";

export default function ResumeUploadPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef(null);

  // Parsing & service states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [parsedResumeData, setParsedResumeData] = useState<ResumeParseResponse | null>(null);

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
    && !!sector && !!fields && preferredLocation !== alternateLocation && priorityRole !== secondaryRole;

  // The form is complete either when parsed resume data exists or a file is loaded, combined with valid preferences.
  // A file is required to proceed, but if parsing fails, they can still proceed manually as long as a file is selected.
  const isFormComplete = !!file && isPrefsComplete;

  const validateAndSetFile = useCallback(async (candidate) => {
    if (!candidate) return;
    const extension = candidate.name.split('.').pop()?.toLowerCase();
    if (extension !== "pdf" && extension !== "docx") {
      setFileError("Please upload a PDF or DOCX file.");
      setFile(null);
      return;
    }
    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      setFileError(LABELS.errorTooLarge);
      setFile(null);
      return;
    }
    setFileError("");
    setFile(candidate);
    setUploadError("");
    setParsedResumeData(null);

    // Call Render backend resume API parser
    setIsUploading(true);
    try {
      const data = await uploadResume(candidate);
      setParsedResumeData(data);
    } catch (err) {
      console.error(err);
      setUploadError("Couldn't process your resume. Please check the file and try again, or fill your details manually.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleFileChange = (e) => { validateAndSetFile(e.target.files?.[0]); e.target.value = ""; };
  const handleBrowseClick = () => inputRef.current?.click();
  const handleRemove = () => {
    setFile(null);
    setFileError("");
    setUploadError("");
    setParsedResumeData(null);
  };

  const handleDragEnter = (e) => { e.preventDefault(); dragCounter.current += 1; setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); dragCounter.current -= 1; if (dragCounter.current <= 0) { setIsDragOver(false); dragCounter.current = 0; } };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => { e.preventDefault(); dragCounter.current = 0; setIsDragOver(false); validateAndSetFile(e.dataTransfer.files?.[0]); };
  const dragHandlers = { onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop };

  const handleSubmit = () => {
    if (!isFormComplete) return;

    // Combine parsed data (skills, frameworks, tools) into a single skills array before submission
    // Note: parsedResumeData might be null if upload failed or was skipped
    const skillsList = parsedResumeData ? [
      ...(parsedResumeData.skills || []),
      ...(parsedResumeData.frameworks || []),
      ...(parsedResumeData.tools || [])
    ] : [];

    // TODO: The backend's skill/role keyword matching (parser.py) currently only recognizes a small, tech-focused vocabulary
    // (Python, React, FastAPI, etc.) — non-technical skills (Excel, Communication, Sales, etc.) won't be detected yet.
    // Keep this limitation in mind when non-tech internship categories are added.

    console.log("Submitting:", {
      file,
      preferredLocation,
      alternateLocation,
      priorityRole,
      secondaryRole,
      sector,
      fields,
      parsedSkills: skillsList,
      parsedName: parsedResumeData?.name || "",
      parsedEmail: parsedResumeData?.email || "",
      parsedPhone: parsedResumeData?.phone || "",
      parsedCgpa: parsedResumeData?.cgpa || null
    });

    navigate('/recommended');
  };

  // Count filled prefs for mini-progress
  const filledPrefs = [preferredLocation, alternateLocation, priorityRole, secondaryRole, sector, fields].filter(Boolean).length;
  const prefsProgress = Math.round((filledPrefs / 6) * 100);

  return (
    <div className="ru-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .ru-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background-color: #f8fafc;
          color: #0f172a;
          padding-bottom: 60px;
        }

        .ru-wrapper {
          max-width: 1160px;
          margin: 0 auto;
          padding: 30px 24px;
        }

        /* ---- Official Header block ---- */
        .ru-hero {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 4px solid #1e3a8a;
          border-radius: 8px;
          padding: 24px 30px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .ru-step-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 4px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #1e40af;
          margin-bottom: 10px;
        }
        .ru-step-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background-color: #2563eb;
        }
        .ru-hero-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0 0 6px 0;
        }
        .ru-hero-sub {
          font-size: 14px;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        /* ---- Two-column main layout ---- */
        .ru-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 860px) { .ru-layout { grid-template-columns: 1fr; } }

        /* ---- Official Section Card ---- */
        .ru-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .ru-card-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1e3a8a;
          margin: 0 0 16px 0;
          display: flex; align-items: center; gap: 8px;
        }
        .ru-card-title::after {
          content: ''; flex: 1; height: 1px;
          background-color: #e2e8f0;
        }
        .ru-section-heading {
          font-size: 12px; font-weight: 700;
          text-transform: uppercase;
          color: #1e3a8a;
          margin: 20px 0 14px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        .ru-section-heading:first-of-type { margin-top: 0; }

        /* ---- Drop Zone ---- */
        .ru-dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          background-color: #f8fafc;
          padding: 40px 20px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; cursor: pointer;
          transition: all 0.15s ease;
        }
        .ru-dropzone:hover, .ru-dropzone-over {
          border-color: #2563eb;
          background-color: #eff6ff;
        }
        .ru-dropzone-over { border-style: solid; }
        .ru-dropzone-error { border-color: #fca5a5; background-color: #fff5f5; }

        .ru-pdf-icon {
          width: 48px; height: 48px;
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          margin-bottom: 12px;
        }
        .ru-dropzone-heading { font-size: 14px; font-weight: 600; color: #1e293b; margin: 0 0 6px 0; }
        .ru-dropzone-or { font-size: 11px; font-weight: 600; color: #64748b; margin: 0 0 12px 0; text-transform: uppercase; }

        .ru-browse-btn {
          background-color: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }
        .ru-browse-btn:hover { background-color: #1d4ed8; }

        .ru-upload-meta {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px;
        }
        @media (max-width: 500px) { .ru-upload-meta { grid-template-columns: 1fr; } }
        .ru-meta-item {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px; padding: 10px 12px;
        }
        .ru-meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 3px; }
        .ru-meta-value { font-size: 13px; font-weight: 600; color: #0f172a; }

        /* File selected state */
        .ru-file-selected {
          border: 1px solid #a7f3d0;
          background-color: #ecfdf5;
          border-radius: 8px;
          padding: 16px 20px;
          display: flex; flex-wrap: wrap;
          align-items: center; justify-content: space-between;
          gap: 14px;
        }
        .ru-file-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
        .ru-file-pdf-icon {
          width: 40px; height: 40px;
          background-color: #d1fae5;
          border: 1px solid #6ee7b7;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .ru-file-name { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px 0; word-break: break-all; }
        .ru-file-size { font-size: 12px; color: #475569; margin: 0 0 4px 0; }
        .ru-file-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; color: #047857;
          text-transform: uppercase;
        }
        .ru-file-actions { display: flex; gap: 8px; flex-wrap: wrap; }

        /* ---- Combobox ---- */
        .ru-combobox { position: relative; margin-bottom: 18px; }
        .ru-label {
          display: flex; align-items: baseline; gap: 4px;
          font-size: 13px; font-weight: 600;
          color: #1e293b;
          margin-bottom: 6px;
        }
        .ru-required { color: #dc2626; }
        .ru-combobox-control {
          display: flex; align-items: center; gap: 8px;
          min-height: 40px; padding: 0 12px;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .ru-combobox-control:focus-within, .ru-combobox-open {
          border-color: #2563eb;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .ru-input-error { border-color: #fca5a5 !important; background-color: #fff5f5 !important; }
        .ru-combobox-input {
          flex: 1; min-width: 0; border: none; outline: none;
          font-size: 14px; font-family: inherit;
          color: #0f172a; background: transparent;
          padding: 8px 0;
        }
        .ru-combobox-input::placeholder { color: #94a3b8; }
        .ru-combobox-listbox {
          position: absolute; z-index: 20;
          top: calc(100% + 4px); left: 0; right: 0;
          max-height: 230px; overflow-y: auto;
          background-color: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          margin: 0; padding: 6px;
          list-style: none;
        }
        .ru-combobox-option {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 8px 12px;
          font-size: 14px; color: #334155;
          border-radius: 6px; cursor: pointer;
          transition: background 0.1s ease;
        }
        .ru-combobox-active { background-color: #f1f5f9; color: #0f172a; }
        .ru-combobox-selected { font-weight: 600; color: #2563eb; }
        .ru-combobox-empty { padding: 12px; font-size: 13px; color: #64748b; text-align: center; }
        .ru-error { font-size: 12px; color: #dc2626; margin: 4px 0 0 0; font-weight: 600; }

        /* ---- Progress bar for preferences ---- */
        .ru-pref-progress {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 18px;
          padding: 8px 12px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }
        .ru-pref-bar-track {
          flex: 1; height: 6px;
          background-color: #e2e8f0; border-radius: 3px; overflow: hidden;
        }
        .ru-pref-bar-fill {
          height: 100%;
          background-color: #2563eb;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        .ru-pref-pct { font-size: 12px; font-weight: 700; color: #1e40af; white-space: nowrap; }

        /* ---- Buttons ---- */
        .ru-btn {
          min-height: 40px; padding: 8px 20px;
          font-size: 14px; font-weight: 600;
          border-radius: 6px; cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease; font-family: inherit;
        }
        .ru-btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
        .ru-btn-sm { min-height: 34px; padding: 6px 12px; font-size: 13px; border-radius: 4px; }

        .ru-btn-ghost {
          background-color: #ffffff;
          border-color: #cbd5e1;
          color: #334155;
        }
        .ru-btn-ghost:hover { background-color: #f1f5f9; color: #0f172a; }

        .ru-btn-outline-blue {
          background-color: #ffffff;
          border-color: #cbd5e1;
          color: #334155;
        }
        .ru-btn-outline-blue:hover { background-color: #f1f5f9; }

        .ru-btn-danger-text {
          background: transparent;
          border-color: transparent;
          color: #dc2626;
          padding-left: 8px; padding-right: 8px;
        }
        .ru-btn-danger-text:hover { background-color: #fef2f2; }

        .ru-btn-primary {
          background-color: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }
        .ru-btn-primary:hover:not(:disabled) { background-color: #1d4ed8; }
        .ru-btn-primary:disabled { background-color: #94a3b8; border-color: #94a3b8; cursor: not-allowed; color: #ffffff; }

        .ru-actions {
          display: flex; flex-wrap: wrap; gap: 12px;
          justify-content: space-between; align-items: center;
          margin-top: 28px;
        }
        @media (max-width: 480px) {
          .ru-actions { flex-direction: column-reverse; align-items: stretch; }
          .ru-actions .ru-btn { width: 100%; text-align: center; }
        }
        .ru-visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
      `}</style>

      <div className="ru-wrapper">

        {/* ======== HERO HEADER ======== */}
        <div className="ru-hero">
          <div className="ru-step-chip">
            <div className="ru-step-dot" />
            {LABELS.stepIndicator} — {LABELS.stepName}
          </div>
          <h1 className="ru-hero-title">{LABELS.pageTitle}</h1>
          <p className="ru-hero-sub">{LABELS.pageSubtitle}</p>
        </div>

        {/* ======== TWO-COLUMN LAYOUT ======== */}
        <div className="ru-layout">

          {/* ──────────────────────────────────
              LEFT: Resume Upload
          ─────────────────────────────────── */}
          <div className="ru-card">
            <p className="ru-card-title">Resume Upload</p>

            {/* Hidden file input supporting .pdf and .docx */}
            <input 
              ref={inputRef} 
              type="file" 
              accept=".pdf,.docx" 
              className="ru-visually-hidden" 
              onChange={handleFileChange} 
              aria-hidden="true" 
              tabIndex={-1} 
            />

            {/* Parsing loader */}
            {isUploading && (
              <div className="ru-upload-loading" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '30px 20px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff',
                borderRadius: '8px', marginBottom: '16px', textAlign: 'center'
              }}>
                <div className="ru-loading-spinner-wrapper" style={{ marginBottom: '12px' }}>
                  <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" style={{
                    animation: 'spin 1s linear infinite',
                    color: '#2563eb'
                  }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(37,99,235,0.15)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <style>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
                <p className="ru-loading-text" style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', margin: 0 }}>
                  Analyzing your resume — this may take up to a minute on first use
                </p>
                <p style={{ fontSize: '11px', color: '#60a5fa', marginTop: '4px', marginBottom: 0 }}>
                  Render cold-start: please wait while our AI parser spins up...
                </p>
              </div>
            )}

            {/* Error state with Skip / Manual override */}
            {uploadError && (
              <div className="ru-upload-error-banner" style={{
                border: '1px solid #fca5a5', backgroundColor: '#fff5f5', borderRadius: '8px',
                padding: '16px 20px', marginBottom: '16px'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', margin: '0 0 8px 0' }}>
                  {uploadError}
                </p>
                <button 
                  type="button" 
                  onClick={() => {
                    setUploadError("");
                    setParsedResumeData({
                      name: "", email: "", phone: "", cgpa: null,
                      skills: [], frameworks: [], tools: [], roles: []
                    });
                  }} 
                  style={{
                    backgroundColor: 'transparent', border: 'none', color: '#2563eb',
                    fontSize: '13px', fontWeight: '700', cursor: 'pointer', padding: 0, textDecoration: 'underline'
                  }}
                >
                  Skip and enter your skills manually
                </button>
              </div>
            )}

            {file && !isUploading && (
              /* File selected state */
              <div className="ru-file-selected" role="status" style={{ marginBottom: '16px' }}>
                <div className="ru-file-left">
                  <div className="ru-file-pdf-icon">📑</div>
                  <div>
                    <p className="ru-file-name">{file.name}</p>
                    <p className="ru-file-size">{formatFileSize(file.size)}</p>
                    <span className="ru-file-badge">✓ {LABELS.fileSelectedStatus}</span>
                  </div>
                </div>
                <div className="ru-file-actions">
                  <button type="button" className="ru-btn ru-btn-outline-blue ru-btn-sm" onClick={handleBrowseClick}>{LABELS.actionReplace}</button>
                  <button type="button" className="ru-btn ru-btn-danger-text ru-btn-sm" onClick={handleRemove}>{LABELS.actionRemove}</button>
                </div>
              </div>
            )}

            {!file && !isUploading && (
              /* Drop zone */
              <div
                className={`ru-dropzone${isDragOver ? " ru-dropzone-over" : ""}${fileError ? " ru-dropzone-error" : ""}`}
                role="button" tabIndex={0}
                aria-label="Upload resume. Drag and drop a PDF or DOCX file here, or activate to browse."
                onClick={handleBrowseClick}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleBrowseClick(); } }}
                {...dragHandlers}
                style={{ marginBottom: '16px' }}
              >
                <div className="ru-pdf-icon">📄</div>
                <p className="ru-dropzone-heading">{LABELS.uploadHeading}</p>
                <p className="ru-dropzone-or">{LABELS.uploadOr}</p>
                <button type="button" className="ru-browse-btn" onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}>
                  {LABELS.uploadBrowseBtn}
                </button>
              </div>
            )}

            {/* Extracted preview list (editable tags UI) */}
            {parsedResumeData && !isUploading && (
              <div className="ru-parsed-preview" style={{
                border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px',
                backgroundColor: '#f8fafc', marginBottom: '16px'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e3a8a', marginTop: 0, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Extracted Profile Summary (Review & Edit)
                </h4>

                {/* Name, Email, Phone, CGPA Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '3px' }}>Name</label>
                    <input 
                      type="text" 
                      value={parsedResumeData.name || ""} 
                      onChange={(e) => setParsedResumeData({ ...parsedResumeData, name: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '3px' }}>Email</label>
                    <input 
                      type="text" 
                      value={parsedResumeData.email || ""} 
                      onChange={(e) => setParsedResumeData({ ...parsedResumeData, email: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '3px' }}>Phone</label>
                    <input 
                      type="text" 
                      value={parsedResumeData.phone || ""} 
                      onChange={(e) => setParsedResumeData({ ...parsedResumeData, phone: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '3px' }}>CGPA</label>
                    <input 
                      type="text" 
                      value={parsedResumeData.cgpa || ""} 
                      onChange={(e) => setParsedResumeData({ ...parsedResumeData, cgpa: e.target.value ? parseFloat(e.target.value) || null : null })}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                    />
                  </div>
                </div>

                {/* Extracted Skills List */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Extracted Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(parsedResumeData.skills || []).map((skill, index) => (
                      <span key={index} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '100px', backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe', fontSize: '12px', fontWeight: '600', color: '#1e40af'
                      }}>
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => {
                            const newSkills = [...(parsedResumeData.skills || [])];
                            newSkills.splice(index, 1);
                            setParsedResumeData({ ...parsedResumeData, skills: newSkills });
                          }}
                          style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0, fontSize: '10px', fontWeight: 'bold' }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      placeholder="+ Add skill"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val) {
                            setParsedResumeData({ ...parsedResumeData, skills: [...(parsedResumeData.skills || []), val] });
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                      style={{ border: '1px dashed #cbd5e1', background: 'transparent', padding: '2px 8px', fontSize: '12px', borderRadius: '100px', outline: 'none', width: '90px' }}
                    />
                  </div>
                </div>

                {/* Frameworks */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Frameworks</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(parsedResumeData.frameworks || []).map((fw, index) => (
                      <span key={index} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '100px', backgroundColor: '#f5f3ff',
                        border: '1px solid #ddd6fe', fontSize: '12px', fontWeight: '600', color: '#5b21b6'
                      }}>
                        {fw}
                        <button 
                          type="button" 
                          onClick={() => {
                            const newFw = [...(parsedResumeData.frameworks || [])];
                            newFw.splice(index, 1);
                            setParsedResumeData({ ...parsedResumeData, frameworks: newFw });
                          }}
                          style={{ border: 'none', background: 'none', color: '#8b5cf6', cursor: 'pointer', padding: 0, fontSize: '10px', fontWeight: 'bold' }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      placeholder="+ Add framework"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val) {
                            setParsedResumeData({ ...parsedResumeData, frameworks: [...(parsedResumeData.frameworks || []), val] });
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                      style={{ border: '1px dashed #cbd5e1', background: 'transparent', padding: '2px 8px', fontSize: '12px', borderRadius: '100px', outline: 'none', width: '110px' }}
                    />
                  </div>
                </div>

                {/* Tools */}
                <div style={{ marginBottom: '0' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Tools</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(parsedResumeData.tools || []).map((tool, index) => (
                      <span key={index} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '100px', backgroundColor: '#fdf2f8',
                        border: '1px solid #fbcfe8', fontSize: '12px', fontWeight: '600', color: '#9d174d'
                      }}>
                        {tool}
                        <button 
                          type="button" 
                          onClick={() => {
                            const newTools = [...(parsedResumeData.tools || [])];
                            newTools.splice(index, 1);
                            setParsedResumeData({ ...parsedResumeData, tools: newTools });
                          }}
                          style={{ border: 'none', background: 'none', color: '#ec4899', cursor: 'pointer', padding: 0, fontSize: '10px', fontWeight: 'bold' }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      placeholder="+ Add tool"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val) {
                            setParsedResumeData({ ...parsedResumeData, tools: [...(parsedResumeData.tools || []), val] });
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                      style={{ border: '1px dashed #cbd5e1', background: 'transparent', padding: '2px 8px', fontSize: '12px', borderRadius: '100px', outline: 'none', width: '90px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {fileError && <p className="ru-error" role="alert">{fileError}</p>}

            {/* Meta info */}
            <div className="ru-upload-meta">
              <div className="ru-meta-item">
                <p className="ru-meta-label">Supported Formats</p>
                <p className="ru-meta-value">PDF, DOCX</p>
              </div>
              <div className="ru-meta-item">
                <p className="ru-meta-label">{LABELS.uploadSizeLabel}</p>
                <p className="ru-meta-value">{LABELS.uploadSizeValue}</p>
              </div>
              <div className="ru-meta-item">
                <p className="ru-meta-label">Accepted File</p>
                <p className="ru-meta-value">Resume PDF/DOCX</p>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────
              RIGHT: Preferences
          ─────────────────────────────────── */}
          <div className="ru-card">
            <p className="ru-card-title">{LABELS.prefTitle}</p>

            {/* Preferences completion progress */}
            <div className="ru-pref-progress">
              <span className="ru-pref-pct">{filledPrefs}/6 filled</span>
              <div className="ru-pref-bar-track">
                <div className="ru-pref-bar-fill" style={{ width: `${prefsProgress}%` }} />
              </div>
              <span className="ru-pref-pct">{prefsProgress}%</span>
            </div>

            {/* Locations */}
            <p className="ru-section-heading">{LABELS.sectionLocationsTitle}</p>
            <SearchableSelect id="preferredLocation" label={LABELS.preferredLocation}
              value={preferredLocation} onChange={setPreferredLocation}
              onBlurValidate={() => setTouched((p) => ({ ...p, alternateLocation: true }))}
              options={INDIAN_STATES} placeholder={LABELS.preferredLocationPlaceholder}
            />
            <SearchableSelect id="alternateLocation" label={LABELS.alternateLocation}
              value={alternateLocation} onChange={setAlternateLocation}
              onBlurValidate={() => setTouched((p) => ({ ...p, alternateLocation: true }))}
              options={INDIAN_STATES} placeholder={LABELS.alternateLocationPlaceholder}
              error={locationError}
            />

            {/* Roles */}
            <p className="ru-section-heading">{LABELS.sectionRolesTitle}</p>
            <SearchableSelect id="priorityRole" label={LABELS.priorityRole}
              value={priorityRole} onChange={setPriorityRole}
              onBlurValidate={() => setTouched((p) => ({ ...p, secondaryRole: true }))}
              options={INTERNSHIP_ROLES} placeholder={LABELS.priorityRolePlaceholder}
            />
            <SearchableSelect id="secondaryRole" label={LABELS.secondaryRole}
              value={secondaryRole} onChange={setSecondaryRole}
              onBlurValidate={() => setTouched((p) => ({ ...p, secondaryRole: true }))}
              options={INTERNSHIP_ROLES} placeholder={LABELS.secondaryRolePlaceholder}
              error={roleError}
            />

            {/* Details */}
            <p className="ru-section-heading">{LABELS.sectionInternshipDetailsTitle}</p>
            <SearchableSelect id="sector" label={LABELS.sector}
              value={sector} onChange={setSector}
              options={SECTOR_OPTIONS} placeholder={LABELS.sectorPlaceholder}
            />
            <SearchableSelect id="fields" label={LABELS.fields}
              value={fields} onChange={setFields}
              options={FIELDS_OPTIONS} placeholder={LABELS.fieldsPlaceholder}
            />
          </div>

        </div>

        {/* ======== BOTTOM ACTIONS ======== */}
        <div className="ru-actions">
          <button type="button" className="ru-btn ru-btn-ghost" onClick={() => navigate('/onboarding/student-details')}>
            {LABELS.btnPrevious}
          </button>
          <button type="button" className="ru-btn ru-btn-primary" disabled={!isFormComplete} onClick={handleSubmit}>
            {LABELS.btnFindInternships}
          </button>
        </div>

      </div>
    </div>
  );
}
