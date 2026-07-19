# Integration Test Plan & Checklist

Use this checklist to verify the end-to-end integration step-by-step. Mark each checkbox as you complete the test.

---

## 🛠️ Step 1: Environment & Services Launch

- [ ] **Start FAISS Model Recommendation Server (Port 8001)**
  - Open terminal and navigate to: `c:\Users\josha\OneDrive\Desktop\Makethon\model\final_deployment`
  - Command: `python -m uvicorn app:app --reload --port 8001`
  - *Verify*: Check that the output prints `Loading Model...` followed by `API Ready!`.
  - *Status Link*: Open `http://127.0.0.1:8001/` in browser to check `{"status": "API Running"}`.

- [ ] **Start Edlyn Resume Parser Backend (Port 8000)**
  - Open terminal and navigate to: `c:\Users\josha\OneDrive\Desktop\Makethon\edlyn-feature\backend`
  - Command: `python -m uvicorn app:app --reload --port 8000`
  - *Verify*: Check that it starts without error.
  - *Status Link*: Open `http://127.0.0.1:8000/` in browser to check `{"message": "CareerLens AI Backend Running"}`.

- [ ] **Start React Frontend Dev Server**
  - Open terminal and navigate to: `c:\Users\josha\OneDrive\Desktop\Makethon\hari-feature`
  - Command: `npm run dev`
  - *Verify*: Note the local URL (usually `http://localhost:5173`).

---

## 🖥️ Step 2: Onboarding Flow Verification

- [ ] **Access Onboarding Page**
  - Open Vite frontend app in browser (e.g. `http://localhost:5173/onboarding/student-details`).
  - Fill out personal details (Name, Date of Birth, Gender, Nationality, Mobile number, Email).
  - Click **Save & Continue**.

- [ ] **Select & Parse Resume PDF**
  - On the `Resume & Preferences` page, drag and drop or browse to upload a sample resume PDF.
  - Select your **Preferred Locations**, **Preferred Internship Roles**, **Sector**, and **Fields**.
  - Open the **Browser Developer Console** (F12 or right-click -> Inspect -> Console tab) to prepare for logging verification.

- [ ] **Submit Integration Call**
  - Click **Find My Internships**.
  - *Verify*: The button state should change to `"Analyzing & Matching..."`.
  - *Verify*: The console should print `========== RESUME PARSER ==========` along with your parsed name, email, phone, skills, and roles.
  - *Verify*: The backend logs for port 8000 should show the PDF being processed and parsed successfully.
  - *Verify*: The model server logs for port 8001 should show a query vector lookup for the roles & skills.

---

## 📊 Step 3: UI Output Verification

- [ ] **Check Dynamic Recommendations Page**
  - *Verify*: The app automatically redirects to `/recommended`.
  - *Verify*: The title displays your parsed name (e.g. `"{Your Name}'s Top 5 Recommended Companies"`).
  - *Verify*: The company cards render detailed descriptions, stipends (e.g. `₹9,000/mo`), and match percentages dynamically rather than static default values.

- [ ] **Check Dynamic Student Profile Page**
  - Navigate to `/profile` in the app.
  - *Verify*: The profile header displays your parsed name, parsed email, location, and role.
  - *Verify*: A new **Parsed Skills** tag grid displays the list of skills extracted from the PDF resume.
  - *Verify*: A new **Parsed Frameworks** tag grid displays the extracted frameworks.

---

## 🗄️ Step 4: Railway MySQL Database Verification

- [ ] **Confirm database is populated**
  - Go to your Railway dashboard → MySQL service → **Data** tab.
  - Verify the `jobs` table exists and has `357` rows (the full dataset from `jobs_clean.csv`).

- [ ] **Restart Model Server with DB Config**
  - Stop the model server if running (Ctrl+C).
  - Restart it: `python -m uvicorn app:app --reload --port 8001` from `model/final_deployment`.
  - *Verify*: The terminal output prints `Database connection configured successfully.` before `API Ready!`.

- [ ] **Confirm recommendations are served from Railway MySQL**
  - Submit a resume through the frontend.
  - *Verify*: The model server terminal logs show `Successfully loaded recommendations from Railway MySQL database.`
  - *Verify*: The recommended company cards on the `/recommended` page reflect real data from your Railway database.

- [ ] **Verify database fallback works**
  - Temporarily rename `.env` to `.env.bak` and restart the server.
  - Submit a resume again.
  - *Verify*: The server terminal logs show `Successfully loaded recommendations from fallback CSV.`
  - *Restore*: Rename `.env.bak` back to `.env` and restart the server.
