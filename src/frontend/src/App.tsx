import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import { LanguageProvider } from "./lib/LanguageContext";
import Announcements from "./pages/Announcements";
import Backup from "./pages/Backup";
import CowRegistry from "./pages/CowRegistry";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import HealthRecords from "./pages/HealthRecords";
import MilkManagement from "./pages/MilkManagement";
import QRScanner from "./pages/QRScanner";

export type Page =
  | "dashboard"
  | "cows"
  | "health"
  | "donations"
  | "announcements"
  | "milk"
  | "scanner"
  | "backup";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [healthCowFilter, setHealthCowFilter] = useState<bigint | null>(null);
  const [prakarFilter, setPrakarFilter] = useState<string | null>(null);

  function navigateToHealth(cowId: bigint | null = null) {
    setHealthCowFilter(cowId);
    setPage("health");
  }

  function navigateToCowsWithFilter(prakar: string) {
    setPrakarFilter(prakar);
    setPage("cows");
  }

  return (
    <LanguageProvider>
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
          />
        )}
        {page === "health" && (
          <HealthRecords
            cowIdFilter={healthCowFilter}
            onClearFilter={() => setHealthCowFilter(null)}
          />
        )}
        {page === "donations" && <Donations />}
        {page === "announcements" && <Announcements />}
        {page === "milk" && <MilkManagement />}
        {page === "scanner" && <QRScanner />}
        {page === "backup" && <Backup />}
      </Layout>
      <Toaster position="top-right" richColors />
    </LanguageProvider>
  );
}
