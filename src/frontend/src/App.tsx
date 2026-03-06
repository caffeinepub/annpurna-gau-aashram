import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import { LanguageProvider } from "./lib/LanguageContext";
import Announcements from "./pages/Announcements";
import CowRegistry from "./pages/CowRegistry";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import HealthRecords from "./pages/HealthRecords";

export type Page =
  | "dashboard"
  | "cows"
  | "health"
  | "donations"
  | "announcements";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [healthCowFilter, setHealthCowFilter] = useState<bigint | null>(null);

  function navigateToHealth(cowId: bigint | null = null) {
    setHealthCowFilter(cowId);
    setPage("health");
  }

  return (
    <LanguageProvider>
      <Layout page={page} setPage={setPage}>
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "cows" && (
          <CowRegistry onViewHealth={(id) => navigateToHealth(id)} />
        )}
        {page === "health" && (
          <HealthRecords
            cowIdFilter={healthCowFilter}
            onClearFilter={() => setHealthCowFilter(null)}
          />
        )}
        {page === "donations" && <Donations />}
        {page === "announcements" && <Announcements />}
      </Layout>
      <Toaster position="top-right" richColors />
    </LanguageProvider>
  );
}
