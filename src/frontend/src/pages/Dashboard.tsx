import { Skeleton } from "@/components/ui/skeleton";
import {
  HandCoins,
  HeartPulse,
  Megaphone,
  PawPrint,
  TrendingUp,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import type { Page } from "../App";
import { useGetAllCows } from "../hooks/useQueries";
import { useGetAllDonations } from "../hooks/useQueries";
import { useGetActiveAnnouncements } from "../hooks/useQueries";
import { useLang } from "../lib/LanguageContext";
import { formatCurrency } from "../utils/timeUtils";

interface DashboardProps {
  setPage: (p: Page) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

export default function Dashboard({ setPage }: DashboardProps) {
  const { t, lang } = useLang();
  const { data: cows = [], isLoading: cowsLoading } = useGetAllCows();
  const { data: donations = [], isLoading: donationsLoading } =
    useGetAllDonations();
  const { data: announcements = [], isLoading: announcementsLoading } =
    useGetActiveAnnouncements();

  const healthyCows = cows.filter(
    (c) => c.healthStatus.toLowerCase() === "healthy",
  ).length;
  const sickCows = cows.filter(
    (c) => c.healthStatus.toLowerCase() === "sick",
  ).length;
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  const isLoading = cowsLoading || donationsLoading || announcementsLoading;

  const stats = [
    {
      label: t("totalCows"),
      value: cows.length,
      icon: PawPrint,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      page: "cows" as Page,
    },
    {
      label: t("healthyCows"),
      value: healthyCows,
      icon: HeartPulse,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      page: "health" as Page,
    },
    {
      label: t("sickCows"),
      value: sickCows,
      icon: HeartPulse,
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      page: "health" as Page,
    },
    {
      label: t("totalDonations"),
      value: formatCurrency(totalDonations),
      icon: HandCoins,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
      page: "donations" as Page,
    },
    {
      label: t("activeAnnouncements"),
      value: announcements.length,
      icon: Megaphone,
      color: "text-accent-foreground",
      bg: "bg-accent/30",
      border: "border-accent/40",
      page: "announcements" as Page,
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto" data-ocid="dashboard.section">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl mb-8 shadow-card"
      >
        <img
          src="/assets/generated/gaushala-hero.dim_1200x400.jpg"
          alt="Annpurna Gau Aashram"
          className="w-full h-44 lg:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center px-6 lg:px-10">
          <div>
            <h1 className="font-display text-white text-2xl lg:text-4xl font-bold mb-1 drop-shadow-lg">
              {t("appName")}
            </h1>
            <p className="text-white/80 text-sm lg:text-base font-body">
              {t("appSubtitle")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t("quickStats")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {isLoading
            ? (["s1", "s2", "s3", "s4", "s5"] as const).map((k) => (
                <Skeleton
                  key={k}
                  className="h-28 rounded-xl"
                  data-ocid="dashboard.loading_state"
                />
              ))
            : stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.button
                    type="button"
                    key={stat.label}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPage(stat.page)}
                    className={`text-left p-4 rounded-xl border ${stat.bg} ${stat.border} shadow-xs cursor-pointer transition-shadow hover:shadow-card`}
                  >
                    <div className={`${stat.color} mb-2`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div
                      className={`text-2xl font-bold ${stat.color} font-display`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {stat.label}
                    </div>
                  </motion.button>
                );
              })}
        </div>
      </div>

      {/* Recent Cows & Announcements side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cows */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-primary" />
              {lang === "hi" ? "गाय परिवार" : "Gau Parivar"}
            </h3>
            <button
              type="button"
              onClick={() => setPage("cows")}
              className="text-xs text-primary hover:underline font-medium"
            >
              {lang === "hi" ? "सभी देखें →" : "View All →"}
            </button>
          </div>
          <div className="p-4">
            {cowsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : cows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t("noCows")}
              </div>
            ) : (
              <div className="space-y-2">
                {cows.slice(0, 5).map((cow) => {
                  const statusClass =
                    cow.healthStatus.toLowerCase() === "healthy"
                      ? "status-healthy"
                      : cow.healthStatus.toLowerCase() === "sick"
                        ? "status-sick"
                        : "status-recovering";
                  return (
                    <div
                      key={cow.id.toString()}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-accent/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-accent-foreground">
                            {cow.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {cow.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {cow.breed}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${statusClass}`}
                      >
                        {cow.healthStatus}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Active Announcements */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              {t("announcements")}
            </h3>
            <button
              type="button"
              onClick={() => setPage("announcements")}
              className="text-xs text-primary hover:underline font-medium"
            >
              {lang === "hi" ? "सभी देखें →" : "View All →"}
            </button>
          </div>
          <div className="p-4">
            {announcementsLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t("noAnnouncements")}
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map((ann) => (
                  <div
                    key={ann.id.toString()}
                    className="px-3 py-3 rounded-lg bg-accent/20 border border-accent/30"
                  >
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {lang === "hi" ? ann.titleHindi || ann.title : ann.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {lang === "hi"
                        ? ann.contentHindi || ann.content
                        : ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
