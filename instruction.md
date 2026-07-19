# CareerLens AI - Integration Instructions

This file serves as a guide for the end-to-end integration between the React frontend (`hari-feature`), the resume parsing backend (`edlyn-feature/backend`), and the recruitment embedding recommendation model (`model/final_deployment`).

---

## 🏗️ Architecture Flow

1. **Onboarding & Personal Info**: Student enters details on `StudentDetailsPage`.
2. **Resume & Preference Selection**:
   - Student uploads a resume PDF and enters preferences (Role, Location, Sector, Fields) on `ResumeUploadPage`.
3. **Resume Parsing (Edlyn Backend)**:
   - Frontend calls `POST http://127.0.0.1:8000/upload` with the PDF.
   - The parser extracts text, email, phone, skills, and roles, printing the parsing results in the console (matches Edlyn's dummy procedure).
4. **Recommendation Search (Model Server)**:
   - Frontend calls `POST http://127.0.0.1:8001/recommend` directly with a search query built from preferences and parsed skills/roles.
   - The model server embeds the query, searches the FAISS index, retrieves the top 5 matched job IDs, queries the Railway MySQL database for full job metadata, and returns detailed internship opportunities. Falls back to `jobs_clean.csv` if the database is unavailable.
5. **Interactive Dashboard & Profile**:
   - `RecommendedCompaniesPage` displays the dynamic matches.
   - `ProfilePage` displays the parsed name, email, and skills.

---

## 🚀 How to Run the System

### 1. Run the FAISS Model Recommendation Server
Start the model server on port `8001`:
```bash
cd model/final_deployment
python -m uvicorn app:app --reload --port 8001
```

### 2. Run the Edlyn Resume Parser Backend
Start the parser backend on port `8000`:
```bash
cd edlyn-feature/backend
python -m uvicorn app:app --reload --port 8000
```

### 3. Run the Frontend App
Start the Vite development server in `hari-feature`:
```bash
cd hari-feature
npm run dev
```

---

## 🛠️ Key Files Modified

- **Model Server App** ([model/final_deployment/app.py](file:///c:/Users/josha/OneDrive/Desktop/Makethon/model/final_deployment/app.py)): Added CORS support, MySQL database engine initialization, and queried FAISS matched IDs against Railway MySQL with local CSV fallback.
- **Resume Upload UI** ([hari-feature/src/pages/ResumeUploadPage.tsx](file:///c:/Users/josha/OneDrive/Desktop/Makethon/hari-feature/src/pages/ResumeUploadPage.tsx)): Configured two-stage asynchronous fetch to upload the PDF, print the parse details to console, fetch matching companies, and store details.
- **Recommended Companies UI** ([hari-feature/src/pages/RecommendedCompaniesPage.tsx](file:///c:/Users/josha/OneDrive/Desktop/Makethon/hari-feature/src/pages/RecommendedCompaniesPage.tsx)): Reads matches from storage to display personalized company cards.
- **Student Profile UI** ([hari-feature/src/pages/ProfilePage.tsx](file:///c:/Users/josha/OneDrive/Desktop/Makethon/hari-feature/src/pages/ProfilePage.tsx)): Displays parsed profile info and skills dynamically.

---

## 🗄️ Database (Railway MySQL)

- **Connection URL**: Configured in `model/final_deployment/.env` and `model/.env`.
- **Table**: `jobs` — populated from `jobs_clean.csv` using [upload_to_db.py](file:///c:/Users/josha/OneDrive/Desktop/Makethon/model/upload_to_db.py).
- **Driver**: `pymysql` via SQLAlchemy (`mysql+pymysql://`).
- **Fallback**: If the database is unreachable, the server automatically falls back to reading `jobs_clean.csv` locally.

> To repopulate the database after any changes to `jobs_clean.csv`:
> ```bash
> cd model
> python upload_to_db.py
> ```
