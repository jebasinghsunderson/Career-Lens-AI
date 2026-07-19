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

import { useLanguage } from './context/LanguageContext';

const AppContent = () => {
  const { language } = useLanguage();

  if (language === null) {
    return <LanguageModal />;
  }

  return (
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
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
