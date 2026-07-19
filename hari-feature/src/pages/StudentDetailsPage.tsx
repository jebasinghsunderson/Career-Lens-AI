// @ts-nocheck
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// i18n-ready label map (content unchanged)
// ============================================================
const LABELS = {
  pageTitle: "Student Information",
  pageSubtitle:
    "Complete your profile to receive internship recommendations that match your skills and interests.",
  stepIndicator: "Step 1 of 2",
  stepName: "Student Details",

  sectionPersonal: "Personal Details",

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

  requiredMark: "Required",
  optionalMark: "Optional",

  privacyNote:
    "Your information is securely stored and will only be used to recommend suitable internships.",

  btnPrevious: "Previous",
  btnSaveContinue: "Save & Continue",
  btnSaveDraft: "Save Draft",
};

const REQUIRED_FIELDS = ["studentName", "dob", "gender", "nationality", "mobile"];

// ============================================================
// Small reusable field primitives (logic unchanged)
// ============================================================
function FieldWrapper({ label, helper, hint, required, error, htmlFor, children }) {
  return (
    <div className="sd-field">
      <label htmlFor={htmlFor} className="sd-label">
        <span>{label}</span>
        {required ? (
          <span className="sd-required" aria-hidden="true">*</span>
        ) : (
          <span className="sd-optional">({LABELS.optionalMark})</span>
        )}
        {helper && <span className="sd-helper">{helper}</span>}
      </label>
      {hint && <p className="sd-hint">{hint}</p>}
      {children}
      {error && <p className="sd-error" role="alert">{error}</p>}
    </div>
  );
}

function TextInput({ id, value, onChange, onBlur, placeholder, type = "text", error, inputMode }) {
  return (
    <input
      id={id} name={id} type={type} inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`sd-input${error ? " sd-input-error" : ""}`}
      aria-invalid={!!error}
    />
  );
}

function SelectInput({ id, value, onChange, placeholder, options, error }) {
  return (
    <select
      id={id} name={id} value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`sd-select${error ? " sd-input-error" : ""}`}
      aria-invalid={!!error}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

// ============================================================
// Main Page Component
// ============================================================
export default function StudentDetailsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentName: "", dob: "", gender: "", nationality: "", email: "", mobile: "",
  });
  const [touched, setTouched] = useState({});

  const setField = (name) => (value) => setForm((prev) => ({ ...prev, [name]: value }));
  const markTouched = (name) => () => setTouched((prev) => ({ ...prev, [name]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = LABELS.emailError;
    if (touched.mobile && form.mobile && !/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = LABELS.mobileError;
    return e;
  }, [form, touched]);

  const isFormComplete = useMemo(() => {
    const allFilled = REQUIRED_FIELDS.every((f) => String(form[f]).trim() !== "");
    const noErrors = Object.keys(errors).length === 0;
    const emailValid = form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const mobileValid = /^[6-9]\d{9}$/.test(form.mobile);
    return allFilled && noErrors && emailValid && mobileValid;
  }, [form, errors]);

  const handleSaveContinue = () => { if (!isFormComplete) return; navigate('/onboarding/resume'); };
  const handleSaveDraft = () => { console.log("Draft saved:", form); };

  const completedFields = REQUIRED_FIELDS.filter(f => String(form[f]).trim() !== "").length;
  const progressPct = Math.round((completedFields / REQUIRED_FIELDS.length) * 100);

  return (
    <div className="sd-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .sd-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background-color: #f8fafc;
          color: #0f172a;
          padding-bottom: 60px;
        }

        .sd-wrapper {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px 20px;
        }

        /* ---- Official Header block ---- */
        .sd-hero {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 4px solid #1e3a8a;
          border-radius: 8px;
          padding: 24px 30px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .sd-step-chip {
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
        .sd-step-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background-color: #2563eb;
        }
        .sd-page-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0 0 6px 0;
        }
        .sd-page-subtitle {
          font-size: 14px;
          color: #475569;
          margin: 0 0 18px 0;
          line-height: 1.5;
        }

        /* Progress bar */
        .sd-progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sd-progress-track {
          flex: 1;
          height: 6px;
          background-color: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }
        .sd-progress-fill {
          height: 100%;
          background-color: #2563eb;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        .sd-progress-label {
          font-size: 12px;
          font-weight: 700;
          color: #1e40af;
          min-width: 36px;
          text-align: right;
        }

        /* ---- Section Card ---- */
        .sd-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 24px 24px 8px 24px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .sd-card-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1e3a8a;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sd-card-title::after {
          content: ''; flex: 1; height: 1px;
          background-color: #e2e8f0;
        }

        /* ---- Grid ---- */
        .sd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
        .sd-full { grid-column: 1 / -1; }
        @media (max-width: 600px) { .sd-grid { grid-template-columns: 1fr; } .sd-full { grid-column: 1; } }

        /* ---- Fields ---- */
        .sd-field { margin-bottom: 18px; }
        .sd-label {
          display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px;
          font-size: 13px; font-weight: 600;
          color: #1e293b;
          margin-bottom: 6px;
        }
        .sd-required { color: #dc2626; font-size: 14px; }
        .sd-optional { color: #64748b; font-weight: 500; font-size: 11px; }
        .sd-helper { color: #475569; font-size: 11px; font-weight: 500; }
        .sd-hint { font-size: 12px; color: #475569; margin: 0 0 6px 0; line-height: 1.4; }

        .sd-input, .sd-select {
          width: 100%; min-height: 40px;
          padding: 8px 12px;
          font-size: 14px; font-family: inherit;
          color: #0f172a;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          transition: all 0.15s ease;
          appearance: none; outline: none;
        }
        .sd-input::placeholder { color: #94a3b8; }
        .sd-select option { background-color: #fff; color: #0f172a; }
        .sd-input:focus, .sd-select:focus {
          border-color: #2563eb;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .sd-input-error { border-color: #fca5a5 !important; background-color: #fff5f5 !important; }
        .sd-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23475569' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px; cursor: pointer;
        }
        .sd-error { font-size: 12px; color: #dc2626; margin: 4px 0 0 0; font-weight: 600; }

        /* ---- Actions ---- */
        .sd-actions {
          display: flex; flex-wrap: wrap; gap: 12px;
          justify-content: space-between; align-items: center;
        }
        .sd-actions-right { display: flex; gap: 10px; flex-wrap: wrap; margin-left: auto; }

        .sd-btn {
          min-height: 40px; padding: 8px 20px;
          font-size: 14px; font-weight: 600;
          border-radius: 6px; cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .sd-btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

        .sd-btn-ghost {
          background-color: #ffffff;
          border-color: #cbd5e1;
          color: #334155;
        }
        .sd-btn-ghost:hover { background-color: #f1f5f9; }

        .sd-btn-outline {
          background-color: #ffffff;
          border-color: #2563eb;
          color: #2563eb;
        }
        .sd-btn-outline:hover { background-color: #eff6ff; }

        .sd-btn-primary {
          background-color: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }
        .sd-btn-primary:hover:not(:disabled) {
          background-color: #1d4ed8;
          border-color: #1d4ed8;
        }
        .sd-btn-primary:disabled {
          background-color: #94a3b8;
          border-color: #94a3b8;
          cursor: not-allowed;
          color: #ffffff;
        }

        @media (max-width: 480px) {
          .sd-actions { flex-direction: column-reverse; align-items: stretch; }
          .sd-actions-right { width: 100%; margin-left: 0; flex-direction: column-reverse; }
          .sd-btn { width: 100%; }
        }
      `}</style>

      <div className="sd-wrapper">

        {/* ======== HERO HEADER ======== */}
        <div className="sd-hero">
          <div className="sd-step-chip">
            <div className="sd-step-dot" />
            {LABELS.stepIndicator} — {LABELS.stepName}
          </div>
          <h1 className="sd-page-title">{LABELS.pageTitle}</h1>
          <p className="sd-page-subtitle">{LABELS.pageSubtitle}</p>

          {/* Dynamic progress */}
          <div className="sd-progress-row">
            <div className="sd-progress-track">
              <div className="sd-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="sd-progress-label">{progressPct}%</span>
          </div>
        </div>

        {/* ======== FORM ======== */}
        <form onSubmit={(e) => e.preventDefault()} noValidate>

          {/* ---- Personal Details Card ---- */}
          <div className="sd-card">
            <p className="sd-card-title">{LABELS.sectionPersonal}</p>
            <div className="sd-grid">

              <div className="sd-full">
                <FieldWrapper
                  label={LABELS.studentName}
                  helper={LABELS.studentNameHelper}
                  hint={LABELS.studentNameHint}
                  required htmlFor="studentName"
                >
                  <TextInput id="studentName" value={form.studentName} onChange={setField("studentName")} placeholder={LABELS.studentNamePlaceholder} />
                </FieldWrapper>
              </div>

              <FieldWrapper label={LABELS.dob} required htmlFor="dob">
                <TextInput id="dob" type="date" value={form.dob} onChange={setField("dob")} placeholder={LABELS.dobPlaceholder} />
              </FieldWrapper>

              <FieldWrapper label={LABELS.gender} required htmlFor="gender">
                <SelectInput id="gender" value={form.gender} onChange={setField("gender")} placeholder={LABELS.genderPlaceholder} options={LABELS.genderOptions} />
              </FieldWrapper>

              <FieldWrapper label={LABELS.nationality} required htmlFor="nationality">
                <SelectInput id="nationality" value={form.nationality} onChange={setField("nationality")} placeholder={LABELS.nationalityPlaceholder} options={LABELS.nationalityOptions} />
              </FieldWrapper>

              <FieldWrapper label={LABELS.email} htmlFor="email" error={errors.email}>
                <TextInput id="email" type="email" inputMode="email" value={form.email} onChange={setField("email")} onBlur={markTouched("email")} placeholder={LABELS.emailPlaceholder} error={errors.email} />
              </FieldWrapper>

              <FieldWrapper label={LABELS.mobile} required htmlFor="mobile" error={errors.mobile}>
                <TextInput id="mobile" type="tel" inputMode="numeric" value={form.mobile}
                  onChange={(v) => { setField("mobile")(v.replace(/\D/g, "").slice(0, 10)); markTouched("mobile")(); }}
                  placeholder={LABELS.mobilePlaceholder} error={errors.mobile} />
              </FieldWrapper>

            </div>
          </div>

          {/* ---- Bottom Actions ---- */}
          <div className="sd-actions">
            <button type="button" className="sd-btn sd-btn-ghost">{LABELS.btnPrevious}</button>
            <div className="sd-actions-right">
              <button type="button" className="sd-btn sd-btn-outline" onClick={handleSaveDraft}>
                {LABELS.btnSaveDraft}
              </button>
              <button type="button" className="sd-btn sd-btn-primary" disabled={!isFormComplete} onClick={handleSaveContinue}>
                {LABELS.btnSaveContinue}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
