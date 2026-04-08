import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import { useAuth } from "./lib/AuthContext";
import { AuthProvider } from "./lib/AuthContext";
import { LanguageProvider } from "./lib/LanguageContext";
import AdminPage from "./pages/AdminPage";
import Announcements from "./pages/Announcements";
import Backup from "./pages/Backup";
import ChangeLogPage from "./pages/ChangeLogPage";
import CowRegistry from "./pages/CowRegistry";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import FeedManagement from "./pages/FeedManagement";
import HealthRecords from "./pages/HealthRecords";
import LoginPage from "./pages/LoginPage";
import MilkManagement from "./pages/MilkManagement";
import Profile from "./pages/Profile";
import QRScanner from "./pages/QRScanner";
import VanshavaliPage from "./pages/VanshavaliPage";

export type Page =
  | "dashboard"
  | "cows"
  | "health"
  | "donations"
  | "announcements"
  | "milk"
  | "feed"
  | "scanner"
  | "backup"
  | "changelog"
  | "admin"
  | "profile"
  | "vanshavali";

function AppContent() {
  const [page, setPage] = useState<Page>("dashboard");
  const [healthCowFilter, setHealthCowFilter] = useState<bigint | null>(null);
  const [prakarFilter, setPrakarFilter] = useState<string | null>(null);
  const { currentUser, sessionValidated } = useAuth();

  const changedBy = currentUser?.name ?? "Guest";

  function navigateToHealth(cowId: bigint | null = null) {
    setHealthCowFilter(cowId);
    setPage("health");
  }

  function navigateToCowsWithFilter(prakar: string) {
    setPrakarFilter(prakar);
    setPage("cows");
  }

  // Show loading/initializing screen while session is being validated
  if (!sessionValidated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-amber-100 border-4 border-amber-200 shadow-md">
            <img
              src="/assets/generated/gaushala-logo-transparent.dim_120x120.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-amber-700 font-medium text-sm animate-pulse">
            अन्नपूर्णा गौ आश्रम
          </p>
          <p className="text-muted-foreground text-xs mt-1 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Show login page if no valid session
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <Layout page={page} setPage={setPage}>
      {page === "dashboard" && (
        <Dashboard
          setPage={setPage}
          onCategoryClick={navigateToCowsWithFilter}
        />
      )}
      {page === "cows" && (
        <CowRegistry
          onViewHealth={(id) => navigateToHealth(id)}
          prakarFilter={prakarFilter}
          onClearPrakarFilter={() => setPrakarFilter(null)}
          changedBy={changedBy}
        />
      )}
      {page === "health" && (
        <HealthRecords
          cowIdFilter={healthCowFilter}
          onClearFilter={() => setHealthCowFilter(null)}
          changedBy={changedBy}
        />
      )}
      {page === "donations" && <Donations changedBy={changedBy} />}
      {page === "announcements" && <Announcements changedBy={changedBy} />}
      {page === "milk" && <MilkManagement />}
      {page === "feed" && <FeedManagement />}
      {page === "scanner" && <QRScanner />}
      {page === "backup" && <Backup />}
      {page === "changelog" && <ChangeLogPage />}
      {page === "admin" && <AdminPage />}
      {page === "profile" && <Profile />}
      {page === "vanshavali" && <VanshavaliPage />}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </LanguageProvider>
  );
}
