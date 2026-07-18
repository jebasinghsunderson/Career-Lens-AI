import React, { useState, useRef, useEffect, useMemo, useId } from "react";

/* =========================================================================
   PUBLISH NEW INTERNSHIP — Company Portal (company already authenticated)
   PM Internship Scheme · AI-Based Internship Recommendation Engine
   Government-portal visual language (DigiLocker / UMANG / Passport Seva).
   Every visible string lives in STRINGS so it can later be wrapped with
   react-i18next (t('key')) without touching layout code.
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. STRINGS  (multilingual-ready — swap for t() later)
   ------------------------------------------------------------------------- */
const STRINGS = {
  pageTitle: "Publish New Internship",
  pageSubtitle:
    "Fill in the internship details below so our AI Recommendation Engine can recommend suitable candidates.",
  eyebrow: "PM Internship Scheme · Company Portal",
  sectionTitle: "Internship Details",
  sectionDesc: "These details are shown to candidates and used for AI-based matching.",
  requiredNote: "Fields marked with * are mandatory.",
  cancel: "Cancel",
  publish: "Publish Internship",
  publishing: "Publishing…",
  publishedNote: "All required details are complete. You're ready to publish.",
  incompleteNote: "Complete all required fields to continue.",
  navigatingNote: "Internship published. Returning to your dashboard…",
};

/* -------------------------------------------------------------------------
   2. STATIC OPTION DATA
   ------------------------------------------------------------------------- */
const ROLES = [
  "Finance Intern", "Accounting Intern", "Banking & Financial Services Intern",
  "Business Operations Intern", "Business Analyst Intern",
  "Human Resources (HR) Intern", "Marketing Intern",
  "Sales & Business Development Intern", "Project Management Intern",
  "Supply Chain & Logistics Intern",
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

const WORK_MODES = ["On-site", "Hybrid", "Remote"];

const DURATIONS = ["1 Month", "2 Months", "3 Months", "6 Months", "9 Months", "12 Months"];

const SKILLS = [
  "MS Excel", "Microsoft Word", "PowerPoint", "Communication Skills",
  "English Proficiency", "Hindi Proficiency", "Accounting", "Bookkeeping",
  "Financial Analysis", "Tally ERP", "GST Basics", "Banking Operations",
  "Customer Service", "Sales", "Negotiation", "Marketing",
  "Digital Marketing", "Business Analysis", "Data Analysis", "SQL", "Java",
  "Python", "HTML", "CSS", "JavaScript", "Project Management", "Leadership",
  "Teamwork", "Problem Solving", "Time Management",
];

const ELIGIBILITY = [
  "10th Pass", "12th Pass", "Diploma", "Any Graduate", "B.Com", "BBA",
  "BCA", "B.Sc", "BE/B.Tech", "MBA",
];

/* -------------------------------------------------------------------------
   3. SMALL INLINE ICONS (no external icon library required)
   ------------------------------------------------------------------------- */
const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s ease" }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="9" stroke="#0F6CBD" strokeWidth="1.4" fill="#EAF3FC" />
    <path d="M6 10.2l2.6 2.6L14.2 7" stroke="#0F6CBD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="9" stroke="#6B7280" strokeWidth="1.4" />
    <rect x="9.3" y="8.5" width="1.4" height="5" rx="0.7" fill="#6B7280" />
    <circle cx="10" cy="6" r="0.9" fill="#6B7280" />
  </svg>
);

const BriefcaseBadgeIcon = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="6" fill="#0F6CBD" />
    <rect x="9" y="13" width="14" height="10" rx="1.5" fill="#FFFFFF" />
    <path d="M13 13v-2a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0119 11v2" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* -------------------------------------------------------------------------
   4. LOW-LEVEL FORM PRIMITIVES
   ------------------------------------------------------------------------- */

/** Wraps any control with a consistent label / required-marker / helper / error */
function Field({ label, required, htmlFor, error, helper, children, fullWidth }) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const helperId = htmlFor ? `${htmlFor}-helper` : undefined;
  return (
    <div className={"gp-field" + (fullWidth ? " gp-field--full" : "")}>
      <label className="gp-label" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="gp-required" aria-hidden="true"> *</span>
        )}
      </label>
      {children}
      {helper && !error && (
        <p id={helperId} className="gp-helper">{helper}</p>
      )}
      {error && (
        <p id={errorId} className="gp-error" role="alert">{error}</p>
      )}
    </div>
  );
}

function TextInput({ id, value, onChange, placeholder, type = "text", error, prefix, ...rest }) {
  return (
    <div className={"gp-input-shell" + (error ? " gp-input-shell--error" : "") + (prefix ? " gp-input-shell--prefixed" : "")}>
      {prefix && <span className="gp-prefix" aria-hidden="true">{prefix}</span>}
      <input
        id={id}
        type={type}
        className="gp-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </div>
  );
}

function TextArea({ id, value, onChange, placeholder, maxLength, error, rows = 4 }) {
  return (
    <div className={"gp-input-shell gp-input-shell--textarea" + (error ? " gp-input-shell--error" : "")}>
      <textarea
        id={id}
        className="gp-textarea"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {maxLength && (
        <span className="gp-char-count">{value.length}/{maxLength}</span>
      )}
    </div>
  );
}

/** Plain native select — used for short, fixed option lists (no search needed) */
function SimpleSelect({ id, value, onChange, options, placeholder, error }) {
  return (
    <div className={"gp-input-shell gp-input-shell--select" + (error ? " gp-input-shell--error" : "")}>
      <select
        id={id}
        className="gp-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <span className="gp-select-chevron" aria-hidden="true"><ChevronIcon open={false} /></span>
    </div>
  );
}

/** Searchable single-select combobox */
function SearchableSelect({ id, value, onChange, options, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listboxId = `${id}-listbox`;

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(opt) {
    onChange(opt);
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) selectOption(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div
      className={"gp-input-shell gp-combobox" + (error ? " gp-input-shell--error" : "")}
      ref={rootRef}
      onKeyDown={handleKeyDown}
    >
      <span className="gp-combobox-search-icon" aria-hidden="true"><SearchIcon /></span>
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-invalid={!!error}
        className="gp-input gp-combobox-input"
        value={open ? query : value}
        placeholder={placeholder}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(0); }}
      />
      <span className="gp-select-chevron" aria-hidden="true"><ChevronIcon open={open} /></span>

      {open && (
        <ul id={listboxId} role="listbox" className="gp-combobox-list">
          {filtered.length === 0 && (
            <li className="gp-combobox-empty">No matches found</li>
          )}
          {filtered.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={"gp-combobox-option" + (i === activeIndex ? " gp-combobox-option--active" : "") + (opt === value ? " gp-combobox-option--selected" : "")}
              onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Searchable multi-select combobox with removable chips */
function MultiSelect({ id, value, onChange, options, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = `${id}-listbox`;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => (!q || o.toLowerCase().includes(q)) && !value.includes(o));
  }, [options, query, value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addOption(opt) {
    onChange([...value, opt]);
    setQuery("");
    setActiveIndex(0);
    inputRef.current && inputRef.current.focus();
  }

  function removeOption(opt) {
    onChange(value.filter((v) => v !== opt));
  }

  function handleKeyDown(e) {
    if (e.key === "Backspace" && query === "" && value.length > 0) {
      removeOption(value[value.length - 1]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) addOption(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className={"gp-input-shell gp-multiselect" + (error ? " gp-input-shell--error" : "")}
      ref={rootRef}
      onKeyDown={handleKeyDown}
      onMouseDown={() => { setOpen(true); inputRef.current && inputRef.current.focus(); }}
    >
      <div className="gp-chip-row">
        {value.map((v) => (
          <span className="gp-chip" key={v}>
            {v}
            <button
              type="button"
              className="gp-chip-remove"
              aria-label={`Remove ${v}`}
              onClick={(e) => { e.stopPropagation(); removeOption(v); }}
            >
              <CloseIcon />
            </button>
          </span>
        ))}
        <input
          id={id}
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className="gp-multiselect-input"
          value={query}
          placeholder={value.length === 0 ? placeholder : ""}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(0); }}
        />
      </div>
      <span className="gp-select-chevron" aria-hidden="true"><ChevronIcon open={open} /></span>

      {open && (
        <ul id={listboxId} role="listbox" className="gp-combobox-list gp-combobox-list--multi">
          {filtered.length === 0 && (
            <li className="gp-combobox-empty">No more skills to add</li>
          )}
          {filtered.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={false}
              className={"gp-combobox-option" + (i === activeIndex ? " gp-combobox-option--active" : "")}
              onMouseDown={(e) => { e.preventDefault(); addOption(opt); }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   5. SECTION HEADER
   ------------------------------------------------------------------------- */
function SectionHeader({ title, description }) {
  return (
    <div className="gp-section-header">
      <div>
        <h2 className="gp-section-title">{title}</h2>
        <p className="gp-section-desc">{description}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   6. MAIN PAGE COMPONENT
   ------------------------------------------------------------------------- */
export default function PublishInternshipPage({ onCancel, onPublished } = {}) {
  const uid = useId();

  const [form, setForm] = useState({
    internshipTitle: "",
    internshipRole: "",
    state: "",
    city: "",
    workMode: "",
    duration: "",
    stipend: "",
    openings: "",
    skills: [],
    eligibility: "",
    description: "",
    deadline: "",
  });

  const [touched, setTouched] = useState({});
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }
  function markTouched(key) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  /* ---- Validation ---- */
  const errors = useMemo(() => {
    const e = {};
    if (!form.internshipTitle.trim()) e.internshipTitle = "Internship title is required.";
    if (!form.internshipRole) e.internshipRole = "Please select an internship role.";
    if (!form.state) e.state = "Please select a state.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.workMode) e.workMode = "Please select a work mode.";
    if (!form.duration) e.duration = "Please select a duration.";
    if (!form.stipend || Number(form.stipend) <= 0) e.stipend = "Enter a valid monthly stipend.";
    if (!form.openings || Number(form.openings) <= 0) e.openings = "Enter the number of openings.";
    if (form.skills.length === 0) e.skills = "Select at least one skill.";
    if (!form.eligibility) e.eligibility = "Please select an eligibility criterion.";
    if (!form.description.trim()) e.description = "Internship description is required.";
    if (!form.deadline) e.deadline = "Please select an application deadline.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;
  const showError = (key) => (touched[key] ? errors[key] : undefined);

  function handleSubmitAllTouched() {
    const allTouched = {};
    Object.keys(form).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
  }

  function handleCancel() {
    // NOTE: UI-only prototype. In the real application this returns to the
    // Company Dashboard without saving any changes.
    if (typeof onCancel === "function") onCancel();
  }

  function handlePublish() {
    handleSubmitAllTouched();
    if (!isValid) return;
    // NOTE: UI-only prototype. No backend / API call is made here.
    // In the real application this would save the internship and then
    // navigate back to the Company Dashboard.
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
      if (typeof onPublished === "function") onPublished(form);
    }, 700);
  }

  const id = (name) => `${uid}-${name}`;

  return (
    <div className="gp-portal">
      <style>{CSS}</style>

      {/* Top government identity strip */}
      <div className="gp-topbar">
        <div className="gp-topbar-inner">
          <BriefcaseBadgeIcon />
          <div className="gp-topbar-text">
            <span className="gp-topbar-title">PM Internship Scheme</span>
            <span className="gp-topbar-subtitle">Company Portal · Government of India</span>
          </div>
        </div>
      </div>

      <main className="gp-main">
        <div className="gp-page-head">
          <span className="gp-eyebrow">{STRINGS.eyebrow}</span>
          <h1 className="gp-title">{STRINGS.pageTitle}</h1>
          <p className="gp-subtitle">{STRINGS.pageSubtitle}</p>
        </div>

        <div className="gp-card">
          <p className="gp-required-note">{STRINGS.requiredNote}</p>

          {/* ===================== INTERNSHIP DETAILS ===================== */}
          <section aria-labelledby="section-heading">
            <SectionHeader title={STRINGS.sectionTitle} description={STRINGS.sectionDesc} />
            <div className="gp-grid">
              <Field label="Internship Title" required htmlFor={id("internshipTitle")} error={showError("internshipTitle")}>
                <TextInput
                  id={id("internshipTitle")}
                  value={form.internshipTitle}
                  onChange={(v) => setField("internshipTitle", v)}
                  onBlur={() => markTouched("internshipTitle")}
                  placeholder="Example: Finance Intern"
                  error={showError("internshipTitle")}
                />
              </Field>

              <Field label="Internship Role" required htmlFor={id("internshipRole")} error={showError("internshipRole")}>
                <SearchableSelect
                  id={id("internshipRole")}
                  value={form.internshipRole}
                  onChange={(v) => { setField("internshipRole", v); markTouched("internshipRole"); }}
                  options={ROLES}
                  placeholder="Search or select a role"
                  error={showError("internshipRole")}
                />
              </Field>

              <Field label="State" required htmlFor={id("state")} error={showError("state")}>
                <SearchableSelect
                  id={id("state")}
                  value={form.state}
                  onChange={(v) => { setField("state", v); markTouched("state"); }}
                  options={STATES}
                  placeholder="Search or select a state"
                  error={showError("state")}
                />
              </Field>

              <Field label="City" required htmlFor={id("city")} error={showError("city")}>
                <TextInput
                  id={id("city")}
                  value={form.city}
                  onChange={(v) => setField("city", v)}
                  onBlur={() => markTouched("city")}
                  placeholder="e.g. Pune"
                  error={showError("city")}
                />
              </Field>

              <Field label="Work Mode" required htmlFor={id("workMode")} error={showError("workMode")}>
                <SimpleSelect
                  id={id("workMode")}
                  value={form.workMode}
                  onChange={(v) => { setField("workMode", v); markTouched("workMode"); }}
                  options={WORK_MODES}
                  placeholder="Select work mode"
                  error={showError("workMode")}
                />
              </Field>

              <Field label="Duration" required htmlFor={id("duration")} error={showError("duration")}>
                <SimpleSelect
                  id={id("duration")}
                  value={form.duration}
                  onChange={(v) => { setField("duration", v); markTouched("duration"); }}
                  options={DURATIONS}
                  placeholder="Select duration"
                  error={showError("duration")}
                />
              </Field>

              <Field label="Monthly Stipend" required htmlFor={id("stipend")} error={showError("stipend")}>
                <TextInput
                  id={id("stipend")}
                  type="number"
                  prefix="₹"
                  min="0"
                  value={form.stipend}
                  onChange={(v) => setField("stipend", v)}
                  onBlur={() => markTouched("stipend")}
                  placeholder="e.g. 15000"
                  error={showError("stipend")}
                />
              </Field>

              <Field label="Number of Openings" required htmlFor={id("openings")} error={showError("openings")}>
                <TextInput
                  id={id("openings")}
                  type="number"
                  min="1"
                  value={form.openings}
                  onChange={(v) => setField("openings", v)}
                  onBlur={() => markTouched("openings")}
                  placeholder="e.g. 5"
                  error={showError("openings")}
                />
              </Field>

              <Field label="Required Skills" required htmlFor={id("skills")} error={showError("skills")} fullWidth>
                <MultiSelect
                  id={id("skills")}
                  value={form.skills}
                  onChange={(v) => { setField("skills", v); markTouched("skills"); }}
                  options={SKILLS}
                  placeholder="Search and add skills"
                  error={showError("skills")}
                />
              </Field>

              <Field label="Eligibility" required htmlFor={id("eligibility")} error={showError("eligibility")}>
                <SimpleSelect
                  id={id("eligibility")}
                  value={form.eligibility}
                  onChange={(v) => { setField("eligibility", v); markTouched("eligibility"); }}
                  options={ELIGIBILITY}
                  placeholder="Select eligibility"
                  error={showError("eligibility")}
                />
              </Field>

              <Field label="Application Deadline" required htmlFor={id("deadline")} error={showError("deadline")}>
                <TextInput
                  id={id("deadline")}
                  type="date"
                  value={form.deadline}
                  onChange={(v) => setField("deadline", v)}
                  onBlur={() => markTouched("deadline")}
                  error={showError("deadline")}
                />
              </Field>

              <Field
                label="Internship Description"
                required
                htmlFor={id("description")}
                error={showError("description")}
                helper={!showError("description") ? "Describe responsibilities, required qualifications, and learning opportunities." : undefined}
                fullWidth
              >
                <TextArea
                  id={id("description")}
                  value={form.description}
                  onChange={(v) => setField("description", v.slice(0, 500))}
                  onBlur={() => markTouched("description")}
                  placeholder="Describe the internship responsibilities, required qualifications, and learning opportunities."
                  maxLength={500}
                  rows={5}
                  error={showError("description")}
                />
              </Field>
            </div>
          </section>

          <div className="gp-divider" role="separator" />

          {/* ===================== STATUS + ACTIONS ===================== */}
          <div className="gp-status-row" role="status">
            {isValid ? <CheckCircleIcon /> : <InfoCircleIcon />}
            <span className={"gp-status-text" + (isValid ? " gp-status-text--ok" : "")}>
              {isValid ? STRINGS.publishedNote : STRINGS.incompleteNote}
            </span>
          </div>

          <div className="gp-actions">
            <button type="button" className="gp-btn gp-btn--ghost" onClick={handleCancel}>
              {STRINGS.cancel}
            </button>
            <button
              type="button"
              className="gp-btn gp-btn--primary"
              disabled={!isValid || publishing}
              onClick={handlePublish}
            >
              {publishing ? STRINGS.publishing : STRINGS.publish}
            </button>
          </div>

          {published && (
            <p className="gp-published-confirmation" role="status">
              {STRINGS.navigatingNote}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------
   7. STYLES — plain CSS (no Tailwind), scoped under .gp-portal
   ------------------------------------------------------------------------- */
const CSS = `
.gp-portal {
  --gp-blue: #0F6CBD;
  --gp-blue-dark: #0B5394;
  --gp-blue-tint: #EAF3FC;
  --gp-border: #D6DCE3;
  --gp-border-strong: #B9C2CC;
  --gp-text: #1F2937;
  --gp-text-muted: #5B6572;
  --gp-bg: #F5F7FA;
  --gp-white: #FFFFFF;
  --gp-error: #B42318;
  --gp-error-bg: #FDEDEC;
  --gp-radius: 6px;
  --gp-radius-lg: 10px;
  font-family: "Segoe UI", "Noto Sans", Roboto, Helvetica, Arial, sans-serif;
  background: var(--gp-bg);
  color: var(--gp-text);
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.gp-portal *, .gp-portal *::before, .gp-portal *::after { box-sizing: border-box; }

.gp-topbar {
  background: var(--gp-blue);
  padding: 14px 24px;
}
.gp-topbar-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.gp-topbar-text { display: flex; flex-direction: column; line-height: 1.25; }
.gp-topbar-title { color: #fff; font-size: 15px; font-weight: 600; letter-spacing: 0.2px; }
.gp-topbar-subtitle { color: #D6E8FA; font-size: 12.5px; }

.gp-main { max-width: 1120px; margin: 0 auto; padding: 28px 24px 64px; }

.gp-page-head { margin-bottom: 20px; }
.gp-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--gp-blue-dark);
  background: var(--gp-blue-tint);
  border: 1px solid #CFE3F7;
  border-radius: var(--gp-radius);
  padding: 3px 10px;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}
.gp-title { font-size: 26px; font-weight: 700; margin: 0 0 6px; color: var(--gp-text); }
.gp-subtitle { font-size: 15px; color: var(--gp-text-muted); max-width: 720px; line-height: 1.5; margin: 0; }

.gp-card {
  background: var(--gp-white);
  border: 1px solid var(--gp-border);
  border-radius: var(--gp-radius-lg);
  padding: 28px 28px 24px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

.gp-required-note {
  font-size: 13px;
  color: var(--gp-text-muted);
  margin: 0 0 20px;
}

.gp-section-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--gp-border);
}
.gp-section-title { font-size: 17px; font-weight: 700; margin: 0 0 2px; color: var(--gp-text); }
.gp-section-desc { font-size: 13.5px; color: var(--gp-text-muted); margin: 0; }

.gp-divider { height: 1px; background: var(--gp-border); margin: 24px 0; border: none; }

.gp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}
.gp-field { display: flex; flex-direction: column; }
.gp-field--full { grid-column: 1 / -1; }

.gp-label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--gp-text);
  margin-bottom: 6px;
}
.gp-required { color: var(--gp-error); }

.gp-helper { font-size: 12.5px; color: var(--gp-text-muted); margin: 6px 0 0; }
.gp-error { font-size: 12.5px; color: var(--gp-error); margin: 6px 0 0; font-weight: 500; }

/* Input shells */
.gp-input-shell {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--gp-white);
  border: 1px solid var(--gp-border-strong);
  border-radius: var(--gp-radius);
  min-height: 46px;
  transition: border-color .12s ease, box-shadow .12s ease;
}
.gp-input-shell:focus-within {
  border-color: var(--gp-blue);
  box-shadow: 0 0 0 3px var(--gp-blue-tint);
}
.gp-input-shell--error { border-color: var(--gp-error); }
.gp-input-shell--error:focus-within { box-shadow: 0 0 0 3px var(--gp-error-bg); }

.gp-input {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--gp-text);
  padding: 12px 14px;
  border-radius: var(--gp-radius);
  font-family: inherit;
}
.gp-input::placeholder { color: #9AA4B2; }

.gp-input-shell--prefixed .gp-input { padding-left: 4px; }
.gp-prefix {
  padding-left: 14px;
  color: var(--gp-text-muted);
  font-size: 15px;
  font-weight: 600;
  user-select: none;
}

.gp-input-shell--textarea { align-items: stretch; min-height: 0; padding: 0; }
.gp-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: vertical;
  background: transparent;
  font-size: 15px;
  font-family: inherit;
  color: var(--gp-text);
  padding: 12px 14px;
  min-height: 88px;
  border-radius: var(--gp-radius);
}
.gp-textarea::placeholder { color: #9AA4B2; }
.gp-char-count {
  align-self: flex-end;
  font-size: 12px;
  color: var(--gp-text-muted);
  padding: 0 12px 8px;
}

.gp-input-shell--select { padding-right: 10px; }
.gp-select {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--gp-text);
  padding: 12px 14px;
  appearance: none;
  font-family: inherit;
  cursor: pointer;
}
.gp-select-chevron {
  display: flex;
  align-items: center;
  padding-right: 12px;
  color: var(--gp-text-muted);
  pointer-events: none;
}

/* Combobox (searchable single select) */
.gp-combobox { padding-left: 6px; }
.gp-combobox-search-icon { display: flex; padding-left: 8px; color: var(--gp-text-muted); }
.gp-combobox-input { cursor: text; }
.gp-combobox-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  background: var(--gp-white);
  border: 1px solid var(--gp-border);
  border-radius: var(--gp-radius);
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12);
  z-index: 20;
  margin: 0;
  padding: 6px;
  list-style: none;
}
.gp-combobox-option {
  padding: 9px 10px;
  font-size: 14.5px;
  border-radius: var(--gp-radius);
  cursor: pointer;
  color: var(--gp-text);
}
.gp-combobox-option--active { background: var(--gp-blue-tint); }
.gp-combobox-option--selected { font-weight: 600; color: var(--gp-blue-dark); }
.gp-combobox-empty { padding: 10px; font-size: 13.5px; color: var(--gp-text-muted); }

/* Multi-select */
.gp-multiselect {
  align-items: flex-start;
  min-height: 46px;
  padding: 6px 40px 6px 8px;
  cursor: text;
}
.gp-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  align-items: center;
}
.gp-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--gp-blue-tint);
  color: var(--gp-blue-dark);
  border: 1px solid #CFE3F7;
  border-radius: var(--gp-radius);
  padding: 4px 6px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}
.gp-chip-remove {
  border: none;
  background: transparent;
  color: var(--gp-blue-dark);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 4px;
}
.gp-chip-remove:hover { background: #CFE3F7; }
.gp-multiselect-input {
  flex: 1;
  min-width: 140px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14.5px;
  padding: 6px 4px;
  font-family: inherit;
  color: var(--gp-text);
}
.gp-multiselect .gp-select-chevron { position: absolute; right: 10px; top: 14px; }
.gp-combobox-list--multi { top: calc(100% + 4px); }

/* Status row */
.gp-status-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--gp-blue-tint);
  border: 1px solid #CFE3F7;
  border-radius: var(--gp-radius);
  padding: 12px 14px;
  margin-bottom: 20px;
}
.gp-status-text { font-size: 13.5px; color: var(--gp-text-muted); }
.gp-status-text--ok { color: var(--gp-blue-dark); font-weight: 600; }

/* Actions */
.gp-actions { display: flex; justify-content: flex-end; gap: 12px; }
.gp-btn {
  font-size: 15px;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: var(--gp-radius);
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: background .12s ease, border-color .12s ease, opacity .12s ease;
}
.gp-btn:focus-visible {
  outline: 3px solid var(--gp-blue);
  outline-offset: 2px;
}
.gp-btn--ghost {
  background: var(--gp-white);
  color: var(--gp-text);
  border-color: var(--gp-border-strong);
}
.gp-btn--ghost:hover { background: #F5F7FA; }
.gp-btn--primary {
  background: var(--gp-blue);
  color: #fff;
}
.gp-btn--primary:hover:not(:disabled) { background: var(--gp-blue-dark); }
.gp-btn--primary:disabled {
  background: #A9C7E4;
  cursor: not-allowed;
}

.gp-published-confirmation {
  text-align: right;
  color: var(--gp-blue-dark);
  font-size: 13.5px;
  font-weight: 600;
  margin: 12px 0 0;
}

/* Responsive */
@media (max-width: 760px) {
  .gp-grid { grid-template-columns: 1fr; }
  .gp-card { padding: 20px 16px; }
  .gp-title { font-size: 22px; }
  .gp-actions { flex-direction: column-reverse; }
  .gp-btn { width: 100%; }
}
`;
