// @ts-nocheck
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// i18n-ready label map
// All static text lives here so it can later be swapped for
// i18next `t('key')` calls without touching component markup.
// ============================================================
const LABELS = {
  pageTitle: "Student Information",
  pageSubtitle:
    "Complete your profile to receive internship recommendations that match your education, skills and interests.",
  stepIndicator: "Step 1 of 3",
  stepName: "Student Details",

  sectionPersonal: "Personal Details",
  sectionAddress: "Permanent Address",
  sectionEducation: "Educational Details",

  studentName: "Student Name",
  studentNameHelper: "As per official ID",
  studentNamePlaceholder: "Enter your full name",
  studentNameHint:
    "Enter your name exactly as it appears on your Aadhaar or official college ID.",

  dob: "Date of Birth",
  dobPlaceholder: "DD/MM/YYYY",

  gender: "Gender",
  genderPlaceholder: "Select gender",
  genderOptions: ["Male", "Female", "Other", "Prefer not to say"],

  nationality: "Nationality",
  nationalityPlaceholder: "Select nationality",
  nationalityOptions: ["Indian", "Other"],

  email: "Email Address",
  emailPlaceholder: "name@example.com",
  emailError: "Enter a valid email address",

  mobile: "Mobile Number",
  mobilePlaceholder: "10-digit mobile number",
  mobileError: "Enter a valid 10-digit mobile number",

  state: "State",
  statePlaceholder: "Select state",
  district: "District",
  districtPlaceholder: "Enter district",
  pinCode: "PIN Code",
  pinCodePlaceholder: "6-digit PIN code",
  pinCodeError: "Enter a valid 6-digit PIN code",

  highestQualification: "Highest Qualification",
  highestQualificationPlaceholder: "Select highest qualification",
  qualificationOptions: [
    "10th Pass",
    "12th Pass",
    "Diploma",
    "Undergraduate",
    "Postgraduate",
  ],

  currentCourse: "Current Course",
  currentCoursePlaceholder: "e.g. B.Tech, B.Sc, B.Com",

  collegeName: "College / University",
  collegeNamePlaceholder: "Enter college or university name",

  branch: "Branch / Specialization",
  branchPlaceholder: "e.g. Computer Science, Mechanical",

  academicYear: "Current Academic Year",
  academicYearPlaceholder: "Select current year",
  academicYearOptions: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"],

  gradYear: "Expected Graduation Year",
  gradYearPlaceholder: "Select graduation year",

  cgpa: "CGPA / Percentage",
  cgpaHelper: "Optional",
  cgpaPlaceholder: "e.g. 8.2 or 78%",

  requiredMark: "Required",
  optionalMark: "Optional",

  privacyNote:
    "Your information is securely stored and will only be used to recommend suitable internships.",

  btnPrevious: "Previous",
  btnSaveContinue: "Save & Continue",
  btnSaveDraft: "Save Draft",
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi (NCT)", "Jammu and Kashmir", "Ladakh",
];

const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => String(2024 + i));

// Fields that must be filled for the Continue button to enable.
const REQUIRED_FIELDS = [
  "studentName",
  "dob",
  "gender",
  "nationality",
  "mobile",
  "state",
  "district",
  "pinCode",
  "highestQualification",
];

// ============================================================
// Small reusable field primitives
// ============================================================

function FieldWrapper({ label, helper, hint, required, error, htmlFor, children }) {
  return (
    <div className="gds-field">
      <label htmlFor={htmlFor} className="gds-label">
        <span>{label}</span>
        {required ? (
          <span className="gds-required" aria-hidden="true">*</span>
        ) : (
          <span className="gds-optional">({LABELS.optionalMark})</span>
        )}
        {helper && <span className="gds-helper">{helper}</span>}
      </label>
      {hint && <p className="gds-hint">{hint}</p>}
      {children}
      {error && (
        <p className="gds-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ id, value, onChange, onBlur, placeholder, type = "text", error, inputMode }) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`gds-input${error ? " gds-input-error" : ""}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  );
}

function SelectInput({ id, value, onChange, placeholder, options, error }) {
  return (
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`gds-select${error ? " gds-input-error" : ""}`}
      aria-invalid={!!error}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// Info icon (government-style, inline SVG, no external assets)
function InfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="gds-info-icon"
    >
      <circle cx="10" cy="10" r="9" stroke="#0F6CBD" strokeWidth="1.5" />
      <rect x="9.1" y="8.5" width="1.8" height="5.5" rx="0.5" fill="#0F6CBD" />
      <rect x="9.1" y="5.5" width="1.8" height="1.8" rx="0.5" fill="#0F6CBD" />
    </svg>
  );
}

// ============================================================
// Main Page Component
// ============================================================

export default function StudentDetailsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentName: "",
    dob: "",
    gender: "",
    nationality: "",
    email: "",
    mobile: "",
    state: "",
    district: "",
    pinCode: "",
    highestQualification: "",
    currentCourse: "",
    collegeName: "",
    branch: "",
    academicYear: "",
    gradYear: "",
    cgpa: "",
  });

  const [touched, setTouched] = useState({});

  const setField = (name) => (value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const markTouched = (name) => () =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  // ---- Validation ----
  const errors = useMemo(() => {
    const e = {};
    if (touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = LABELS.emailError;
    }
    if (touched.mobile && form.mobile && !/^[6-9]\d{9}$/.test(form.mobile)) {
      e.mobile = LABELS.mobileError;
    }
    if (touched.pinCode && form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
      e.pinCode = LABELS.pinCodeError;
    }
    return e;
  }, [form, touched]);

  const isFormComplete = useMemo(() => {
    const allFilled = REQUIRED_FIELDS.every((f) => String(form[f]).trim() !== "");
    const noErrors = Object.keys(errors).length === 0;
    // Email is optional â€” only enforce a valid format if the student entered one.
    const emailValid = form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const mobileValid = /^[6-9]\d{9}$/.test(form.mobile);
    const pinValid = /^\d{6}$/.test(form.pinCode);
    return allFilled && noErrors && emailValid && mobileValid && pinValid;
  }, [form, errors]);

  const handleSaveContinue = () => {
    if (!isFormComplete) return;
    // Integration point: parent app supplies the actual navigation/submit handler.
    console.log("Form submitted:", form);
    navigate('/onboarding/resume');
  };

  const handleSaveDraft = () => {
    // Integration point: parent app supplies draft-persistence handler.
    console.log("Draft saved:", form);
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

        /* ---- Header / progress ---- */
        .gds-progress-track {
          height: 6px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .gds-progress-fill {
          height: 100%;
          width: 33.3%;
          background: var(--gds-blue);
          border-radius: 999px;
        }
        .gds-step-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--gds-blue-dark);
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin: 0 0 4px 0;
        }
        .gds-step-name {
          font-size: 13px;
          color: var(--gds-text-muted);
          margin: 0 0 20px 0;
        }
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
          max-width: 60ch;
        }

        /* ---- Sections ---- */
        .gds-section {
          border: 1px solid var(--gds-border);
          border-radius: var(--gds-radius);
          padding: 20px 20px 4px 20px;
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
        .gds-section-grid .gds-field-full {
          grid-column: 1 / -1;
        }
        @media (max-width: 640px) {
          .gds-section-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ---- Fields ---- */
        .gds-field {
          margin-bottom: 18px;
        }
        .gds-label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: var(--gds-text);
          margin-bottom: 4px;
        }
        .gds-required {
          color: var(--gds-error);
          margin-left: 2px;
        }
        .gds-optional {
          color: var(--gds-text-muted);
          font-weight: 400;
          font-size: 13px;
          margin-left: 4px;
        }
        .gds-helper {
          display: block;
          font-weight: 400;
          font-size: 13px;
          color: var(--gds-text-muted);
          margin-top: 2px;
        }
        .gds-hint {
          font-size: 13px;
          color: var(--gds-text-muted);
          margin: 0 0 8px 0;
          line-height: 1.4;
        }
        .gds-input,
        .gds-select {
          width: 100%;
          min-height: 48px;
          padding: 12px 14px;
          font-size: 16px;
          font-family: inherit;
          color: var(--gds-text);
          background: var(--gds-bg);
          border: 1.5px solid var(--gds-border);
          border-radius: var(--gds-radius);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          appearance: none;
        }
        .gds-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%235B6470' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }
        .gds-input:focus,
        .gds-select:focus {
          outline: none;
          border-color: var(--gds-blue);
          box-shadow: 0 0 0 3px rgba(15, 108, 189, 0.25);
        }
        .gds-input-error {
          border-color: var(--gds-error);
        }
        .gds-input-error:focus {
          box-shadow: 0 0 0 3px rgba(179, 38, 30, 0.2);
        }
        .gds-error {
          font-size: 13px;
          color: var(--gds-error);
          margin: 6px 0 0 0;
          font-weight: 600;
        }

        /* ---- Privacy note ---- */
        .gds-privacy-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--gds-bg-subtle);
          border: 1px solid var(--gds-border);
          border-radius: var(--gds-radius);
          padding: 14px 16px;
          margin: 4px 0 32px 0;
        }
        .gds-info-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }
        .gds-privacy-text {
          font-size: 14px;
          line-height: 1.5;
          color: var(--gds-text-muted);
          margin: 0;
        }

        /* ---- Bottom actions ---- */
        .gds-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: space-between;
          align-items: center;
        }
        .gds-actions-right {
          display: flex;
          gap: 12px;
          margin-left: auto;
          flex-wrap: wrap;
        }
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
        .gds-btn-secondary:hover {
          background: var(--gds-bg-subtle);
        }
        .gds-btn-outline {
          background: var(--gds-bg);
          border-color: var(--gds-blue);
          color: var(--gds-blue-dark);
        }
        .gds-btn-outline:hover {
          background: rgba(15, 108, 189, 0.06);
        }
        .gds-btn-primary {
          background: var(--gds-blue);
          border-color: var(--gds-blue);
          color: #fff;
        }
        .gds-btn-primary:hover:not(:disabled) {
          background: var(--gds-blue-dark);
        }
        .gds-btn-primary:disabled {
          background: #B7C6D6;
          border-color: #B7C6D6;
          cursor: not-allowed;
          color: #fff;
        }

        @media (max-width: 480px) {
          .gds-actions {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .gds-actions-right {
            flex-direction: column-reverse;
            width: 100%;
            margin-left: 0;
          }
          .gds-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="gds-container">
        {/* ============ HEADER ============ */}
        <header>
          <div
            className="gds-progress-track"
            role="progressbar"
            aria-valuenow={1}
            aria-valuemin={0}
            aria-valuemax={3}
            aria-label={LABELS.stepIndicator}
          >
            <div className="gds-progress-fill" />
          </div>
          <p className="gds-step-label">{LABELS.stepIndicator}</p>
          <p className="gds-step-name">{LABELS.stepName}</p>
          <h1 className="gds-page-title">{LABELS.pageTitle}</h1>
          <p className="gds-page-subtitle">{LABELS.pageSubtitle}</p>
        </header>

        {/* ============ FORM ============ */}
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          {/* ---- Personal Details ---- */}
          <section className="gds-section" aria-labelledby="section-personal">
            <h2 className="gds-section-title" id="section-personal">
              {LABELS.sectionPersonal}
            </h2>
            <div className="gds-section-grid">
              <div className="gds-field-full">
                <FieldWrapper
                  label={LABELS.studentName}
                  helper={LABELS.studentNameHelper}
                  hint={LABELS.studentNameHint}
                  required
                  htmlFor="studentName"
                >
                  <TextInput
                    id="studentName"
                    value={form.studentName}
                    onChange={setField("studentName")}
                    placeholder={LABELS.studentNamePlaceholder}
                  />
                </FieldWrapper>
              </div>

              <FieldWrapper label={LABELS.dob} required htmlFor="dob">
                <TextInput
                  id="dob"
                  type="date"
                  value={form.dob}
                  onChange={setField("dob")}
                  placeholder={LABELS.dobPlaceholder}
                />
              </FieldWrapper>

              <FieldWrapper label={LABELS.gender} required htmlFor="gender">
                <SelectInput
                  id="gender"
                  value={form.gender}
                  onChange={setField("gender")}
                  placeholder={LABELS.genderPlaceholder}
                  options={LABELS.genderOptions}
                />
              </FieldWrapper>

              <FieldWrapper label={LABELS.nationality} required htmlFor="nationality">
                <SelectInput
                  id="nationality"
                  value={form.nationality}
                  onChange={setField("nationality")}
                  placeholder={LABELS.nationalityPlaceholder}
                  options={LABELS.nationalityOptions}
                />
              </FieldWrapper>

              <FieldWrapper
                label={LABELS.email}
                htmlFor="email"
                error={errors.email}
              >
                <TextInput
                  id="email"
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={setField("email")}
                  onBlur={markTouched("email")}
                  placeholder={LABELS.emailPlaceholder}
                  error={errors.email}
                />
              </FieldWrapper>

              <FieldWrapper
                label={LABELS.mobile}
                required
                htmlFor="mobile"
                error={errors.mobile}
              >
                <TextInput
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  value={form.mobile}
                  onChange={(v) => {
                    setField("mobile")(v.replace(/\D/g, "").slice(0, 10));
                    markTouched("mobile")();
                  }}
                  placeholder={LABELS.mobilePlaceholder}
                  error={errors.mobile}
                />
              </FieldWrapper>
            </div>
          </section>

          {/* ---- Permanent Address ---- */}
          <section className="gds-section" aria-labelledby="section-address">
            <h2 className="gds-section-title" id="section-address">
              {LABELS.sectionAddress}
            </h2>
            <div className="gds-section-grid">
              <FieldWrapper label={LABELS.state} required htmlFor="state">
                <SelectInput
                  id="state"
                  value={form.state}
                  onChange={setField("state")}
                  placeholder={LABELS.statePlaceholder}
                  options={INDIAN_STATES}
                />
              </FieldWrapper>

              <FieldWrapper label={LABELS.district} required htmlFor="district">
                <TextInput
                  id="district"
                  value={form.district}
                  onChange={setField("district")}
                  placeholder={LABELS.districtPlaceholder}
                />
              </FieldWrapper>

              <FieldWrapper
                label={LABELS.pinCode}
                required
                htmlFor="pinCode"
                error={errors.pinCode}
              >
                <TextInput
                  id="pinCode"
                  inputMode="numeric"
                  value={form.pinCode}
                  onChange={(v) => {
                    setField("pinCode")(v.replace(/\D/g, "").slice(0, 6));
                    markTouched("pinCode")();
                  }}
                  placeholder={LABELS.pinCodePlaceholder}
                  error={errors.pinCode}
                />
              </FieldWrapper>
            </div>
          </section>

          {/* ---- Educational Details ---- */}
          <section className="gds-section" aria-labelledby="section-education">
            <h2 className="gds-section-title" id="section-education">
              {LABELS.sectionEducation}
            </h2>
            <div className="gds-section-grid">
              <FieldWrapper
                label={LABELS.highestQualification}
                required
                htmlFor="highestQualification"
              >
                <SelectInput
                  id="highestQualification"
                  value={form.highestQualification}
                  onChange={setField("highestQualification")}
                  placeholder={LABELS.highestQualificationPlaceholder}
                  options={LABELS.qualificationOptions}
                />
              </FieldWrapper>

              <FieldWrapper label={LABELS.currentCourse} htmlFor="currentCourse">
                <TextInput
                  id="currentCourse"
                  value={form.currentCourse}
                  onChange={setField("currentCourse")}
                  placeholder={LABELS.currentCoursePlaceholder}
                />
              </FieldWrapper>

              <div className="gds-field-full">
                <FieldWrapper label={LABELS.collegeName} htmlFor="collegeName">
                  <TextInput
                    id="collegeName"
                    value={form.collegeName}
                    onChange={setField("collegeName")}
                    placeholder={LABELS.collegeNamePlaceholder}
                  />
                </FieldWrapper>
              </div>

              <FieldWrapper label={LABELS.branch} htmlFor="branch">
                <TextInput
                  id="branch"
                  value={form.branch}
                  onChange={setField("branch")}
                  placeholder={LABELS.branchPlaceholder}
                />
              </FieldWrapper>

              <FieldWrapper label={LABELS.academicYear} htmlFor="academicYear">
                <SelectInput
                  id="academicYear"
                  value={form.academicYear}
                  onChange={setField("academicYear")}
                  placeholder={LABELS.academicYearPlaceholder}
                  options={LABELS.academicYearOptions}
                />
              </FieldWrapper>

              <FieldWrapper label={LABELS.gradYear} htmlFor="gradYear">
                <SelectInput
                  id="gradYear"
                  value={form.gradYear}
                  onChange={setField("gradYear")}
                  placeholder={LABELS.gradYearPlaceholder}
                  options={GRAD_YEARS}
                />
              </FieldWrapper>

              <FieldWrapper label={LABELS.cgpa} helper={LABELS.cgpaHelper} htmlFor="cgpa">
                <TextInput
                  id="cgpa"
                  value={form.cgpa}
                  onChange={setField("cgpa")}
                  placeholder={LABELS.cgpaPlaceholder}
                />
              </FieldWrapper>
            </div>
          </section>

          {/* ---- Privacy note ---- */}
          <div className="gds-privacy-note">
            <InfoIcon />
            <p className="gds-privacy-text">{LABELS.privacyNote}</p>
          </div>

          {/* ---- Bottom actions ---- */}
          <div className="gds-actions">
            <button type="button" className="gds-btn gds-btn-secondary">
              {LABELS.btnPrevious}
            </button>
            <div className="gds-actions-right">
              <button
                type="button"
                className="gds-btn gds-btn-outline"
                onClick={handleSaveDraft}
              >
                {LABELS.btnSaveDraft}
              </button>
              <button
                type="button"
                className="gds-btn gds-btn-primary"
                disabled={!isFormComplete}
                onClick={handleSaveContinue}
              >
                {LABELS.btnSaveContinue}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

