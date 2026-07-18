import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { SuggestPage } from './pages/SuggestPage';
import { ProfilePage } from './pages/ProfilePage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import InternshipPreferencesPage from './pages/InternshipPreferencesPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import RecommendedCompaniesPage from './pages/RecommendedCompaniesPage';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageModal } from './components/LanguageModal';

function App() {
  return (
    <LanguageProvider>
      <LanguageModal />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/suggest" element={<SuggestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding/student-details" element={<StudentDetailsPage />} />
          <Route path="/onboarding/preferences" element={<InternshipPreferencesPage />} />
          <Route path="/onboarding/resume" element={<ResumeUploadPage />} />
          <Route path="/recommended" element={<RecommendedCompaniesPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
