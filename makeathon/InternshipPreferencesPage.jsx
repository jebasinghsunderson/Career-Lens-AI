import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";

// ============================================================
// i18n-ready label map
// All static text lives here so it can later be swapped for
// i18next `t('key')` calls without touching component markup.
// ============================================================
const LABELS = {
  stepIndicator: "Step 3 of 3",
  stepName: "Internship Preferences",

  pageTitle: "Internship Preferences",
  pageSubtitle:
    "Tell us your internship preferences so we can recommend opportunities that best match your profile.",

  sectionLocationsTitle: "Preferred Internship Locations",
  preferredLocation: "Preferred Location",
  preferredLocationPlaceholder: "Select your preferred internship location",
  alternateLocation: "Alternate Preferred Location",
  alternateLocationPlaceholder: "Select your second preferred internship location",
  locationDuplicateError:
    "Your alternate preferred location must be different from your first preference.",

  sectionRolesTitle: "Preferred Internship Roles",
  priorityRole: "Priority Role",
  priorityRolePlaceholder: "Select your preferred internship role",
  secondaryRole: "Secondary Role",
  secondaryRolePlaceholder: "Select your second preferred internship role",
  roleDuplicateError: "Your secondary role must be different from your priority role.",

  searchPlaceholder: "Type to search...",
  noResults: "No matches found",

  summaryTitle: "Selected Preferences",
  summaryPreferredLocation: "Preferred Location",
  summaryAlternateLocation: "Alternate Preferred Location",
  summaryPriorityRole: "Priority Role",
  summarySecondaryRole: "Secondary Role",
  summaryNotSelected: "Not selected yet",

  btnPrevious: "Previous",
  btnFindInternships: "Find My Internships",
};

// 28 Indian states only — Union Territories intentionally excluded.
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const INTERNSHIP_ROLES = [
  "Finance Intern",
  "Accounting Intern",
  "Banking & Financial Services Intern",
  "Business Operations Intern",
  "Business Analyst Intern",
  "Human Resources (HR) Intern",
  "Marketing Intern",
  "Sales & Business Development Intern",
  "Project Management Intern",
  "Supply Chain & Logistics Intern",
];

const PROGRESS_PERCENT = 99; // Step 3 of 3 — onboarding nearly complete

// ============================================================
// Icons (inline SVG, no external assets, government-style / line-based)
// ============================================================

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
// Linear Onboarding Progress Bar
// Same component/markup pattern used on Step 1 and Step 2 —
// only `percent`, `stepIndicator`, and `stepName` differ.
// This is the ONLY onboarding progress indicator on the page.
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
      <div
        className="gds-progress-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Onboarding progress: ${stepIndicator}, ${stepName}, ${percent} percent complete`}
      >
        <div className="gds-progress-fill" style={{ width: `${animatedPercent}%` }} />
      </div>
    </div>
  );
}

// ============================================================
// Searchable Select (accessible combobox pattern)
// Frontend-only: filters a static option list as the user types.
// ============================================================

function SearchableSelect({
  id,
  label,
  value,
  onChange,
  onBlurValidate,
  options,
  placeholder,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = `${id}-listbox`;

  // Keep the visible text in sync if the value changes externally.
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value?.toLowerCase()) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [query, options, value]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        // Revert to the last confirmed value if the user typed without selecting.
        setQuery(value || "");
        if (onBlurValidate) onBlurValidate();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, onBlurValidate]);

  const selectOption = (opt) => {
    onChange(opt);
    setQuery(opt);
    setIsOpen(false);
    setActiveIndex(-1);
    if (onBlurValidate) onBlurValidate(opt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
        selectOption(filteredOptions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery(value || "");
    }
  };

  return (
    <div className="gds-combobox" ref={wrapperRef}>
      <label htmlFor={id} className="gds-label">
        <span>{label}</span>
        <span className="gds-required" aria-hidden="true">*</span>
      </label>
      <div className={`gds-combobox-control${error ? " gds-input-error" : ""}`}>
        <SearchIcon />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={!!error}
          className="gds-combobox-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <span className="gds-combobox-chevron">
          <ChevronDownIcon />
        </span>
      </div>

      {isOpen && (
        <ul className="gds-combobox-listbox" role="listbox" id={listboxId}>
          {filteredOptions.length === 0 ? (
            <li className="gds-combobox-empty">{LABELS.noResults}</li>
          ) : (
            filteredOptions.map((opt, idx) => (
              <li
                key={opt}
                role="option"
                aria-selected={opt === value}
                className={`gds-combobox-option${idx === activeIndex ? " gds-combobox-option-active" : ""}${
                  opt === value ? " gds-combobox-option-selected" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault(); // keep focus, avoid blur firing before click
                  selectOption(opt);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span>{opt}</span>
                {opt === value && <CheckIcon />}
              </li>
            ))
          )}
        </ul>
      )}

      {error && (
        <p className="gds-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================
// Summary Card
// ============================================================

function SummaryRow({ label, value }) {
  return (
    <div className="gds-summary-row">
      <span className="gds-summary-label">{label}</span>
      <span className={`gds-summary-value${value ? "" : " gds-summary-value-empty"}`}>
        {value || LABELS.summaryNotSelected}
      </span>
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

export default function InternshipPreferencesPage() {
  const [preferredLocation, setPreferredLocation] = useState("");
  const [alternateLocation, setAlternateLocation] = useState("");
  const [priorityRole, setPriorityRole] = useState("");
  const [secondaryRole, setSecondaryRole] = useState("");

  const [touched, setTouched] = useState({
    alternateLocation: false,
    secondaryRole: false,
  });

  const locationError =
    touched.alternateLocation &&
    preferredLocation &&
    alternateLocation &&
    preferredLocation === alternateLocation
      ? LABELS.locationDuplicateError
      : "";

  const roleError =
    touched.secondaryRole && priorityRole && secondaryRole && priorityRole === secondaryRole
      ? LABELS.roleDuplicateError
      : "";

  const isFormComplete =
    !!preferredLocation &&
    !!alternateLocation &&
    !!priorityRole &&
    !!secondaryRole &&
    preferredLocation !== alternateLocation &&
    priorityRole !== secondaryRole;

  const handleFindInternships = () => {
    if (!isFormComplete) return;
    // Integration point: parent app supplies navigation to the
    // Internship Recommendations page. No API calls happen here.
    console.log("Navigating to Internship Recommendations page.", {
      preferredLocation,
      alternateLocation,
      priorityRole,
      secondaryRole,
    });
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
        .gds-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        /* ---- Linear onboarding progress bar (ONLY tracker in app) ---- */
        .gds-progress-block { margin-bottom: 24px; }
        .gds-progress-heading-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .gds-step-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--gds-blue-dark);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .gds-step-percent {
          font-size: 13px;
          font-weight: 600;
          color: var(--gds-text-muted);
        }
        .gds-step-name {
          font-size: 13px;
          color: var(--gds-text-muted);
          margin: 2px 0 10px 0;
        }
        .gds-progress-track {
          height: 8px;
          background: #F0F1F3;
          border-radius: 999px;
          overflow: hidden;
        }
        .gds-progress-fill {
          height: 100%;
          background: var(--gds-blue);
          border-radius: 999px;
          transition: width 0.7s ease;
        }

        /* ---- Header ---- */
        .gds-page-title {
          font-size: 28px;
          line-height: 1.25;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: var(--gds-text);
        }
        .gds-page-subtitle {
          font-size: 16px;
          line-height: 1.5;
          color: var(--gds-text-muted);
          margin: 0 0 28px 0;
          max-width: 62ch;
        }

        /* ---- Section shell (reused from Step 1 / Step 2) ---- */
        .gds-section {
          border: 1px solid var(--gds-border);
          border-radius: var(--gds-radius);
          padding: 20px;
          margin-bottom: 20px;
          background: var(--gds-bg);
        }
        .gds-section-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 4px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--gds-border);
        }
        .gds-section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 16px;
          padding-top: 16px;
        }
        @media (max-width: 640px) {
          .gds-section-grid { grid-template-columns: 1fr; }
        }

        /* ---- Field label (shared) ---- */
        .gds-label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: var(--gds-text);
          margin-bottom: 6px;
        }
        .gds-required {
          color: var(--gds-error);
          margin-left: 2px;
        }
        .gds-error {
          font-size: 13px;
          color: var(--gds-error);
          margin: 6px 0 0 0;
          font-weight: 600;
        }

        /* ---- Searchable combobox ---- */
        .gds-combobox {
          position: relative;
          margin-bottom: 20px;
        }
        .gds-combobox-control {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 14px;
          background: var(--gds-bg);
          border: 1.5px solid var(--gds-border);
          border-radius: var(--gds-radius);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .gds-combobox-control:focus-within {
          border-color: var(--gds-blue);
          box-shadow: 0 0 0 3px rgba(15, 108, 189, 0.25);
        }
        .gds-input-error {
          border-color: var(--gds-error);
        }
        .gds-input-error:focus-within {
          box-shadow: 0 0 0 3px rgba(179, 38, 30, 0.2);
        }
        .gds-combobox-input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          font-size: 16px;
          font-family: inherit;
          color: var(--gds-text);
          background: transparent;
          padding: 12px 0;
        }
        .gds-combobox-input::placeholder {
          color: #8A929C;
        }
        .gds-combobox-chevron {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .gds-combobox-listbox {
          position: absolute;
          z-index: 20;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          max-height: 240px;
          overflow-y: auto;
          background: #fff;
          border: 1.5px solid var(--gds-border);
          border-radius: var(--gds-radius);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          margin: 0;
          padding: 6px;
          list-style: none;
        }
        .gds-combobox-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 12px;
          font-size: 15px;
          color: var(--gds-text);
          border-radius: 4px;
          cursor: pointer;
        }
        .gds-combobox-option-active {
          background: var(--gds-bg-subtle);
        }
        .gds-combobox-option-selected {
          font-weight: 600;
          color: var(--gds-blue-dark);
        }
        .gds-combobox-empty {
          padding: 12px;
          font-size: 14px;
          color: var(--gds-text-muted);
          text-align: center;
        }

        /* ---- Summary card ---- */
        .gds-summary-card {
          border: 1px solid var(--gds-border);
          border-radius: var(--gds-radius);
          background: var(--gds-bg-subtle);
          padding: 18px 20px;
          margin-bottom: 24px;
        }
        .gds-summary-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: var(--gds-text);
        }
        .gds-summary-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 0;
          border-top: 1px solid var(--gds-border);
        }
        .gds-summary-row:first-of-type {
          border-top: none;
        }
        .gds-summary-label {
          font-size: 14px;
          color: var(--gds-text-muted);
          font-weight: 600;
          flex-shrink: 0;
        }
        .gds-summary-value {
          font-size: 14px;
          color: var(--gds-text);
          font-weight: 600;
          text-align: right;
        }
        .gds-summary-value-empty {
          color: #8A929C;
          font-weight: 400;
          font-style: italic;
        }
        @media (max-width: 480px) {
          .gds-summary-row { flex-direction: column; gap: 2px; }
          .gds-summary-value { text-align: left; }
        }

        /* ---- Buttons (reused from Step 1 / Step 2) ---- */
        .gds-btn {
          min-height: 48px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          border-radius: var(--gds-radius);
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
          font-family: inherit;
        }
        .gds-btn:focus-visible {
          outline: 3px solid rgba(15, 108, 189, 0.4);
          outline-offset: 2px;
        }
        .gds-btn-secondary {
          background: var(--gds-bg);
          border-color: var(--gds-border);
          color: var(--gds-text);
        }
        .gds-btn-secondary:hover { background: var(--gds-bg-subtle); }
        .gds-btn-primary {
          background: var(--gds-blue);
          border-color: var(--gds-blue);
          color: #fff;
        }
        .gds-btn-primary:hover:not(:disabled) { background: var(--gds-blue-dark); }
        .gds-btn-primary:disabled {
          background: #B7C6D6;
          border-color: #B7C6D6;
          cursor: not-allowed;
          color: #fff;
        }

        /* ---- Bottom actions ---- */
        .gds-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: space-between;
          align-items: center;
        }
        @media (max-width: 480px) {
          .gds-actions { flex-direction: column-reverse; align-items: stretch; }
          .gds-actions .gds-btn { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gds-progress-fill { transition: none; }
        }
      `}</style>

      <div className="gds-container">
        {/* ============ LINEAR ONBOARDING PROGRESS BAR (only tracker) ============ */}
        <OnboardingProgressBar
          percent={PROGRESS_PERCENT}
          stepIndicator={LABELS.stepIndicator}
          stepName={LABELS.stepName}
        />

        {/* ============ HEADER ============ */}
        <header>
          <h1 className="gds-page-title">{LABELS.pageTitle}</h1>
          <p className="gds-page-subtitle">{LABELS.pageSubtitle}</p>
        </header>

        {/* ============ PREFERENCE CARD ============ */}
        <div className="gds-section">
          {/* ---- Locations ---- */}
          <section aria-labelledby="section-locations">
            <h2 className="gds-section-title" id="section-locations">
              {LABELS.sectionLocationsTitle}
            </h2>
            <div className="gds-section-grid" style={{ paddingTop: 16 }}>
              <SearchableSelect
                id="preferredLocation"
                label={LABELS.preferredLocation}
                value={preferredLocation}
                onChange={setPreferredLocation}
                onBlurValidate={() =>
                  setTouched((prev) => ({ ...prev, alternateLocation: true }))
                }
                options={INDIAN_STATES}
                placeholder={LABELS.preferredLocationPlaceholder}
              />
              <SearchableSelect
                id="alternateLocation"
                label={LABELS.alternateLocation}
                value={alternateLocation}
                onChange={setAlternateLocation}
                onBlurValidate={() =>
                  setTouched((prev) => ({ ...prev, alternateLocation: true }))
                }
                options={INDIAN_STATES}
                placeholder={LABELS.alternateLocationPlaceholder}
                error={locationError}
              />
            </div>
          </section>

          {/* ---- Roles ---- */}
          <section aria-labelledby="section-roles" style={{ marginTop: 4 }}>
            <h2 className="gds-section-title" id="section-roles">
              {LABELS.sectionRolesTitle}
            </h2>
            <div className="gds-section-grid" style={{ paddingTop: 16 }}>
              <SearchableSelect
                id="priorityRole"
                label={LABELS.priorityRole}
                value={priorityRole}
                onChange={setPriorityRole}
                onBlurValidate={() => setTouched((prev) => ({ ...prev, secondaryRole: true }))}
                options={INTERNSHIP_ROLES}
                placeholder={LABELS.priorityRolePlaceholder}
              />
              <SearchableSelect
                id="secondaryRole"
                label={LABELS.secondaryRole}
                value={secondaryRole}
                onChange={setSecondaryRole}
                onBlurValidate={() => setTouched((prev) => ({ ...prev, secondaryRole: true }))}
                options={INTERNSHIP_ROLES}
                placeholder={LABELS.secondaryRolePlaceholder}
                error={roleError}
              />
            </div>
          </section>
        </div>

        {/* ============ SUMMARY ============ */}
        <PreferencesSummary
          preferredLocation={preferredLocation}
          alternateLocation={alternateLocation}
          priorityRole={priorityRole}
          secondaryRole={secondaryRole}
        />

        {/* ============ BOTTOM ACTIONS ============ */}
        <div className="gds-actions">
          <button type="button" className="gds-btn gds-btn-secondary">
            {LABELS.btnPrevious}
          </button>
          <button
            type="button"
            className="gds-btn gds-btn-primary"
            disabled={!isFormComplete}
            onClick={handleFindInternships}
          >
            {LABELS.btnFindInternships}
          </button>
        </div>
      </div>
    </div>
  );
}
