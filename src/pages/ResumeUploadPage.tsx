// @ts-nocheck
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// i18n-ready label map
// All static text lives here so it can later be swapped for
// i18next `t('key')` calls without touching component markup.
// ============================================================
const LABELS = {
  stepIndicator: "Step 2 of 3",
  stepName: "Resume Upload",

  pageTitle: "Upload Your Resume",
  pageSubtitle:
    "Upload your resume to help us understand your education, technical skills, certifications and qualifications. Your resume is required before proceeding to the next step.",

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

  infoCardTitle: "Why do we need your resume?",
  infoCardBody:
    "Your resume helps us understand your education, technical skills, certifications and qualifications. This information is used to recommend internships that best match your profile.",

  privacyTitle: "Privacy Notice",
  privacyBody:
    "Your resume will only be used for generating internship recommendations under the PM Internship Scheme. Your information will be handled securely and processed according to applicable Government guidelines.",

  btnPrevious: "Previous",
  btnContinue: "Continue",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const PROGRESS_PERCENT = 66; // Step 2 of 3

// ============================================================
// Helpers
// ============================================================

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ============================================================
// Icons (inline SVG, no external assets, government-style / line-based)
// ============================================================

function PdfIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M12 4h16l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="#0F6CBD"
        strokeWidth="2"
        fill="#EAF2FA"
      />
      <path d="M28 4v8h8" stroke="#0F6CBD" strokeWidth="2" fill="none" />
      <text x="24" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F6CBD">
        PDF
      </text>
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
      <path
        d="M6.5 11.2L9.3 14L15.5 7.5"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================
// Linear Onboarding Progress Bar
// This is the ONLY onboarding progress indicator in the app.
// Same component/markup is reused, unchanged, on every step
// page â€” only `percent` and the step text differ.
// ============================================================

function OnboardingProgressBar({ percent, stepIndicator, stepName }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    // Animate from 0 to target percent smoothly on mount.
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
// Upload Card
// ============================================================

function UploadCard({
  file,
  error,
  isDragOver,
  onBrowseClick,
  onFileChange,
  onRemove,
  onReplaceClick,
  dragHandlers,
  inputRef,
}) {
  if (file) {
    return (
      <div className="gds-file-summary" role="status">
        <div className="gds-file-summary-left">
          <PdfIcon size={40} />
          <div>
            <p className="gds-file-name">{file.name}</p>
            <p className="gds-file-meta">{formatFileSize(file.size)}</p>
            <span className="gds-file-status-badge">
              <CheckCircleIcon />
              {LABELS.fileSelectedStatus}
            </span>
          </div>
        </div>
        <div className="gds-file-summary-actions">
          <button type="button" className="gds-btn gds-btn-outline gds-btn-sm" onClick={onReplaceClick}>
            {LABELS.actionReplace}
          </button>
          <button type="button" className="gds-btn gds-btn-text gds-btn-sm" onClick={onRemove}>
            {LABELS.actionRemove}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="gds-visually-hidden"
          onChange={onFileChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="gds-upload-card-heading">{LABELS.uploadCardHeading}</h2>
      <div
        className={`gds-dropzone${isDragOver ? " gds-dropzone-dragover" : ""}${error ? " gds-dropzone-error" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload your resume. Drag and drop a PDF file here, or activate to browse files."
        onClick={onBrowseClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onBrowseClick();
          }
        }}
        {...dragHandlers}
      >
        <PdfIcon size={56} />
        <p className="gds-dropzone-heading">{LABELS.uploadHeading}</p>
        <p className="gds-dropzone-or">{LABELS.uploadOr}</p>
        <button
          type="button"
          className="gds-btn gds-btn-primary gds-btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onBrowseClick();
          }}
        >
          {LABELS.uploadBrowseBtn}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="gds-visually-hidden"
          onChange={onFileChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {error && (
        <p className="gds-error" role="alert">
          {error}
        </p>
      )}

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
// Main Page Component
// ============================================================

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef(null);

  const validateAndSetFile = useCallback((candidate) => {
    if (!candidate) return;
    if (candidate.type !== "application/pdf") {
      setError(LABELS.errorInvalidType);
      setFile(null);
      return;
    }
    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      setError(LABELS.errorTooLarge);
      setFile(null);
      return;
    }
    setError("");
    setFile(candidate);
  }, []);

  const handleFileChange = (e) => {
    const candidate = e.target.files && e.target.files[0];
    validateAndSetFile(candidate);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const handleBrowseClick = () => {
    inputRef.current && inputRef.current.click();
  };

  const handleRemove = () => {
    setFile(null);
    setError("");
  };

  // ---- Drag & drop handlers ----
  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragOver(false);
      dragCounter.current = 0;
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const candidate = e.dataTransfer.files && e.dataTransfer.files[0];
    validateAndSetFile(candidate);
  };

  const dragHandlers = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  // ---- Continue: no simulation, just navigate ----
  const handleContinue = () => {
    if (!file) return;
    // Integration point: parent app supplies navigation to Step 3.
    // Actual PDF upload/parsing will be handled by the backend later.
    console.log("Navigating to Step 3: Internship Preferences.", { file });
    navigate('/onboarding/preferences');
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
        .gds-progress-block {
          margin-bottom: 24px;
        }
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
          background: #E5E7EB;
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

        /* ---- Section shell (reused from Step 1) ---- */
        .gds-section {
          border: 1px solid var(--gds-border);
          border-radius: var(--gds-radius);
          padding: 20px;
          margin-bottom: 20px;
          background: var(--gds-bg);
        }

        .gds-upload-card-heading {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: var(--gds-text);
        }

        /* ---- Dropzone ---- */
        .gds-dropzone {
          border: 2px dashed var(--gds-border);
          border-radius: var(--gds-radius);
          background: var(--gds-bg);
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .gds-dropzone:hover {
          background: var(--gds-bg-subtle);
          border-color: var(--gds-blue);
        }
        .gds-dropzone:focus-visible {
          outline: 3px solid rgba(15, 108, 189, 0.4);
          outline-offset: 2px;
        }
        .gds-dropzone-dragover {
          background: #EAF2FA;
          border-color: var(--gds-blue);
        }
        .gds-dropzone-error {
          border-color: var(--gds-error);
        }
        .gds-dropzone-heading {
          font-size: 17px;
          font-weight: 600;
          color: var(--gds-text);
          margin: 14px 0 6px 0;
        }
        .gds-dropzone-or {
          font-size: 13px;
          font-weight: 600;
          color: var(--gds-text-muted);
          margin: 0 0 14px 0;
          letter-spacing: 0.04em;
        }

        /* ---- Upload meta row ---- */
        .gds-upload-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }
        .gds-upload-meta-item {
          background: var(--gds-bg-subtle);
          border: 1px solid var(--gds-border);
          border-radius: var(--gds-radius);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .gds-upload-meta-label {
          font-size: 12px;
          color: var(--gds-text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .gds-upload-meta-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--gds-text);
        }
        @media (max-width: 560px) {
          .gds-upload-meta { grid-template-columns: 1fr; }
        }

        /* ---- File summary (after selection) ---- */
        .gds-file-summary {
          border: 1.5px solid var(--gds-success);
          background: #F2FAF4;
          border-radius: var(--gds-radius);
          padding: 18px 20px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .gds-file-summary-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        .gds-file-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--gds-text);
          margin: 0 0 2px 0;
          word-break: break-word;
        }
        .gds-file-meta {
          font-size: 13px;
          color: var(--gds-text-muted);
          margin: 0 0 6px 0;
        }
        .gds-file-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--gds-success);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .gds-file-summary-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* ---- Info card ---- */
        .gds-info-card {
          display: flex;
          gap: 12px;
          background: var(--gds-bg-subtle);
          border: 1px solid var(--gds-border);
          border-radius: var(--gds-radius);
          padding: 16px 18px;
          margin-bottom: 20px;
        }
        .gds-info-card-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: var(--gds-text);
        }
        .gds-info-card-body {
          font-size: 14px;
          line-height: 1.5;
          color: var(--gds-text-muted);
          margin: 0;
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
        .gds-info-icon { flex-shrink: 0; margin-top: 1px; }
        .gds-privacy-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--gds-text);
          margin: 0 0 2px 0;
        }
        .gds-privacy-text {
          font-size: 14px;
          line-height: 1.5;
          color: var(--gds-text-muted);
          margin: 0;
        }

        /* ---- Errors ---- */
        .gds-error {
          font-size: 13px;
          color: var(--gds-error);
          margin: 10px 0 0 0;
          font-weight: 600;
        }

        /* ---- Buttons (reused from Step 1) ---- */
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
        .gds-btn-sm {
          min-height: 40px;
          padding: 9px 16px;
          font-size: 14px;
        }
        .gds-btn-secondary {
          background: var(--gds-bg);
          border-color: var(--gds-border);
          color: var(--gds-text);
        }
        .gds-btn-secondary:hover { background: var(--gds-bg-subtle); }
        .gds-btn-outline {
          background: var(--gds-bg);
          border-color: var(--gds-blue);
          color: var(--gds-blue-dark);
        }
        .gds-btn-outline:hover { background: rgba(15, 108, 189, 0.06); }
        .gds-btn-text {
          background: transparent;
          border-color: transparent;
          color: var(--gds-error);
          padding-left: 8px;
          padding-right: 8px;
        }
        .gds-btn-text:hover { background: rgba(179, 38, 30, 0.06); }
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
          .gds-file-summary { flex-direction: column; align-items: flex-start; }
          .gds-file-summary-actions { width: 100%; }
          .gds-file-summary-actions .gds-btn { flex: 1; }
        }

        .gds-visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
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

        {/* ============ UPLOAD SECTION ============ */}
        <section className="gds-section" aria-labelledby="section-upload">
          {!file && <span className="gds-visually-hidden" id="section-upload" />}
          <UploadCard
            file={file}
            error={error}
            isDragOver={isDragOver}
            onBrowseClick={handleBrowseClick}
            onFileChange={handleFileChange}
            onRemove={handleRemove}
            onReplaceClick={handleBrowseClick}
            dragHandlers={dragHandlers}
            inputRef={inputRef}
          />
        </section>

        {/* ============ INFO CARD ============ */}
        <div className="gds-info-card">
          <InfoIcon />
          <div>
            <p className="gds-info-card-title">{LABELS.infoCardTitle}</p>
            <p className="gds-info-card-body">{LABELS.infoCardBody}</p>
          </div>
        </div>

        {/* ============ PRIVACY NOTICE ============ */}
        <div className="gds-privacy-note">
          <LockIcon />
          <div>
            <p className="gds-privacy-title">{LABELS.privacyTitle}</p>
            <p className="gds-privacy-text">{LABELS.privacyBody}</p>
          </div>
        </div>

        {/* ============ BOTTOM ACTIONS ============ */}
        <div className="gds-actions">
          <button type="button" className="gds-btn gds-btn-secondary">
            {LABELS.btnPrevious}
          </button>
          <button
            type="button"
            className="gds-btn gds-btn-primary"
            disabled={!file}
            onClick={handleContinue}
          >
            {LABELS.btnContinue}
          </button>
        </div>
      </div>
    </div>
  );
}

