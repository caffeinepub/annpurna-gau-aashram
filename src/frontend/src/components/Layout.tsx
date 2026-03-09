import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Archive,
  Globe,
  HandCoins,
  HeartPulse,
  LayoutDashboard,
  Megaphone,
  Menu,
  Milk,
  PawPrint,
  ScanLine,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import { useLang } from "../lib/LanguageContext";

interface LayoutProps {
  page: Page;
  setPage: (p: Page) => void;
  children: React.ReactNode;
}

const navItems: {
  id: Page;
  icon: React.ElementType;
  en: string;
  hi: string;
}[] = [
  { id: "dashboard", icon: LayoutDashboard, en: "Dashboard", hi: "डैशबोर्ड" },
  { id: "cows", icon: PawPrint, en: "Gau Parivar", hi: "गाय परिवार" },
  { id: "health", icon: HeartPulse, en: "Swasthya", hi: "स्वास्थ्य" },
  { id: "milk", icon: Milk, en: "Dudh", hi: "दूध प्रबंधन" },
  { id: "donations", icon: HandCoins, en: "Daan", hi: "दान" },
  { id: "announcements", icon: Megaphone, en: "Ghoshna", hi: "घोषणा" },
  { id: "scanner", icon: ScanLine, en: "QR Scanner", hi: "QR स्कैनर" },
  { id: "backup", icon: Archive, en: "Backup", hi: "बैकअप" },
];

const ocidMap: Record<Page, string> = {
  dashboard: "nav.dashboard.link",
  cows: "nav.cows.link",
  health: "nav.health.link",
  milk: "nav.milk.link",
  donations: "nav.donations.link",
  announcements: "nav.announcements.link",
  scanner: "nav.scanner.link",
  backup: "nav.backup.link",
};

export default function Layout({ page, setPage, children }: LayoutProps) {
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLang = () => setLang(lang === "en" ? "hi" : "en");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop Sidebar ────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 sidebar-gradient shadow-sidebar flex-shrink-0">
        {/* Logo Area */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-sidebar-accent">
              <img
                src="/assets/generated/gaushala-logo-transparent.dim_120x120.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-display text-sm font-semibold leading-tight">
                {t("appName")}
              </h1>
              <p className="text-sidebar-foreground/60 text-xs mt-0.5">
                {lang === "hi" ? "गौ आश्रम प्रबंधन" : "Gaushala Management"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={ocidMap[item.id]}
                onClick={() => setPage(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{lang === "hi" ? item.hi : item.en}</span>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground/60"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Language toggle */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            type="button"
            data-ocid="lang.toggle"
            onClick={toggleLang}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sm font-medium transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>
              {lang === "en" ? "Switch to हिन्दी" : "Switch to English"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <p className="text-sidebar-foreground/40 text-xs text-center">
            © {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sidebar-foreground/60"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* ── Mobile Overlay Sidebar ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 sidebar-gradient flex flex-col lg:hidden shadow-xl"
            >
              <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-sidebar-accent">
                    <img
                      src="/assets/generated/gaushala-logo-transparent.dim_120x120.png"
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1 className="text-sidebar-foreground font-display text-sm font-semibold">
                    {t("appName")}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = page === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      data-ocid={ocidMap[item.id]}
                      onClick={() => {
                        setPage(item.id);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{lang === "hi" ? item.hi : item.en}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-sidebar-border">
                <button
                  type="button"
                  data-ocid="lang.toggle"
                  onClick={toggleLang}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent text-sm font-medium transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>
                    {lang === "en" ? "Switch to हिन्दी" : "Switch to English"}
                  </span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-xs">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-sm font-semibold text-foreground">
            {t("appName")}
          </h1>
          <button
            type="button"
            data-ocid="lang.toggle"
            onClick={toggleLang}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
