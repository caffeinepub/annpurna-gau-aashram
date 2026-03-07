import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useGetAllCows } from "../hooks/useQueries";
import { useLang } from "../lib/LanguageContext";

interface DashboardProps {
  setPage: (p: Page) => void;
}

function getTodayKey() {
  const d = new Date();
  return `gaushala-milk-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

interface MilkData {
  morning: number;
  evening: number;
  date: string;
}

export default function Dashboard({ setPage }: DashboardProps) {
  const { t, lang } = useLang();
  const { data: cows = [], isLoading: cowsLoading } = useGetAllCows();

  // Milk tracker state
  const [morningInput, setMorningInput] = useState("");
  const [eveningInput, setEveningInput] = useState("");
  const [savedMilk, setSavedMilk] = useState<MilkData>({
    morning: 0,
    evening: 0,
    date: "",
  });

  // Load today's milk from localStorage on mount
  useEffect(() => {
    const key = getTodayKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as MilkData;
        setSavedMilk(parsed);
        setMorningInput(parsed.morning > 0 ? parsed.morning.toString() : "");
        setEveningInput(parsed.evening > 0 ? parsed.evening.toString() : "");
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  function saveMilk() {
    const morning = Number.parseFloat(morningInput) || 0;
    const evening = Number.parseFloat(eveningInput) || 0;
    const key = getTodayKey();
    const data: MilkData = {
      morning,
      evening,
      date: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    setSavedMilk(data);
    toast.success(lang === "hi" ? "दूध की जानकारी सहेजी गई" : "Milk data saved");
  }

  // Category counts
  const gayCount = cows.filter(
    (c) => c.healthStatus !== "Bull" && c.healthStatus !== "Retired-Bull",
  ).length;
  const nandiCount = cows.filter(
    (c) => c.healthStatus === "Bull" || c.healthStatus === "Retired-Bull",
  ).length;

  const categories = [
    {
      key: "dujni",
      label: t("dujni"),
      count: cows.filter((c) => c.healthStatus === "Lactating").length,
      emoji: "🐄",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    {
      key: "bachdi",
      label: t("bachdi"),
      count: cows.filter((c) => c.healthStatus === "Calf-F").length,
      emoji: "🐮",
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    {
      key: "gabhin",
      label: t("gabhin"),
      count: cows.filter((c) => c.healthStatus === "Pregnant").length,
      emoji: "🤰",
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-200",
    },
    {
      key: "vasuki",
      label: t("vasuki"),
      count: cows.filter((c) => c.healthStatus === "Dry").length,
      emoji: "🌿",
      bg: "bg-lime-50",
      text: "text-lime-800",
      border: "border-lime-200",
    },
    {
      key: "nandi",
      label: t("nandi"),
      count: cows.filter((c) => c.healthStatus === "Bull").length,
      emoji: "🐃",
      bg: "bg-sky-50",
      text: "text-sky-800",
      border: "border-sky-200",
    },
    {
      key: "bachda",
      label: t("bachda"),
      count: cows.filter((c) => c.healthStatus === "Calf-M").length,
      emoji: "🐂",
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    {
      key: "retiredNandi",
      label: t("retiredNandi"),
      count: cows.filter((c) => c.healthStatus === "Retired-Bull").length,
      emoji: "🧓",
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
    },
    {
      key: "retiredGay",
      label: t("retiredGay"),
      count: cows.filter((c) => c.healthStatus === "Retired").length,
      emoji: "🌸",
      bg: "bg-pink-50",
      text: "text-pink-800",
      border: "border-pink-200",
    },
  ];

  const pregnantCount = cows.filter(
    (c) => c.healthStatus === "Pregnant",
  ).length;
  const dryCount = cows.filter((c) => c.healthStatus === "Dry").length;
  const totalMilk = savedMilk.morning + savedMilk.evening;

  return (
    <div className="p-3 sm:p-5 lg:p-8 max-w-2xl mx-auto space-y-5">
      {/* ── Section A: Header (Gaudhan counter) ── */}
      <motion.section
        data-ocid="dashboard.gaudhan.section"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl overflow-hidden shadow-card"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.18 50) 0%, oklch(0.65 0.2 40) 100%)",
        }}
      >
        <div className="px-5 py-4 text-center">
          <p className="text-white/80 text-sm font-medium tracking-wide mb-0.5">
            {lang === "hi" ? "🐄" : "🐄"}{" "}
            <span className="font-bold text-white text-3xl block mt-0.5">
              {cowsLoading ? "..." : cows.length}
            </span>
          </p>
          <h2 className="font-display text-white text-xl font-bold">
            {t("totalGaudhan")}
          </h2>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-1.5">
              <span className="text-lg">🐄</span>
              <span className="text-white font-semibold text-sm">
                {t("totalGay")} :{" "}
                <span className="font-bold text-base">
                  {cowsLoading ? "..." : gayCount}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-1.5">
              <span className="text-lg">🐃</span>
              <span className="text-white font-semibold text-sm">
                {t("totalNandi")} :{" "}
                <span className="font-bold text-base">
                  {cowsLoading ? "..." : nandiCount}
                </span>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Section B: 8-tile category grid ── */}
      {cowsLoading ? (
        <div
          className="grid grid-cols-4 gap-2"
          data-ocid="dashboard.loading_state"
        >
          {(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const).map(
            (k) => (
              <Skeleton key={k} className="h-20 rounded-xl" />
            ),
          )}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              data-ocid={`dashboard.category.item.${i + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className={`${cat.bg} ${cat.border} border rounded-xl p-2.5 text-center cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => setPage("cows")}
            >
              <div className="text-xl mb-0.5">{cat.emoji}</div>
              <div
                className={`text-2xl font-bold ${cat.text} font-display leading-none`}
              >
                {cat.count}
              </div>
              <div
                className={`text-xs font-medium ${cat.text} mt-0.5 leading-tight`}
              >
                {cat.label}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Section C: Quick access row ── */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          data-ocid="dashboard.allgay.button"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage("cows")}
          className="bg-white border-2 border-amber-200 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all hover:border-amber-400 group"
        >
          <div className="text-4xl mb-2">🐄</div>
          <div className="font-bold text-amber-800 text-sm leading-tight">
            {t("allGay")}
          </div>
          <div className="text-xs text-amber-600 mt-0.5">
            {lang === "hi" ? "सभी गायें देखें" : "View all cows"}
          </div>
        </motion.button>

        <motion.button
          type="button"
          data-ocid="dashboard.allnandi.button"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage("cows")}
          className="bg-white border-2 border-sky-200 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all hover:border-sky-400 group"
        >
          <div className="text-4xl mb-2">🐃</div>
          <div className="font-bold text-sky-800 text-sm leading-tight">
            {t("allNandi")}
          </div>
          <div className="text-xs text-sky-600 mt-0.5">
            {lang === "hi" ? "सभी नंदी देखें" : "View all bulls"}
          </div>
        </motion.button>
      </div>

      {/* ── Section D: Pregnancy info ── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-display text-base font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="text-lg">🤰</span>
          {t("pregnancyInfo")}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPage("health")}
            className="bg-white border border-orange-200 rounded-xl p-3 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-1">🌡️</div>
            <div className="text-sm font-semibold text-orange-800">
              {t("heatRecord")}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {lang === "hi" ? "रिकॉर्ड देखें" : "View records"}
            </div>
          </button>
          <button
            type="button"
            onClick={() => setPage("health")}
            className="bg-white border border-rose-200 rounded-xl p-3 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-1">🐄</div>
            <div className="text-sm font-semibold text-rose-800">
              {t("pregnantCows")}
            </div>
            <div className="text-lg font-bold text-rose-600">
              {pregnantCount}
            </div>
          </button>
          <button
            type="button"
            onClick={() => setPage("cows")}
            className="bg-white border border-lime-200 rounded-xl p-3 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-1">🌿</div>
            <div className="text-sm font-semibold text-lime-800">
              {t("dryCows")}
            </div>
            <div className="text-lg font-bold text-lime-600">{dryCount}</div>
          </button>
        </div>
      </motion.section>

      {/* ── Section E: Milk tracker ── */}
      <motion.section
        data-ocid="dashboard.milk.section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-display text-base font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="text-lg">🥛</span>
          {t("milkInfo")}
        </h3>

        {/* Milk display tiles */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Total milk — dark navy */}
          <div
            className="rounded-2xl p-4 text-center col-span-1 flex flex-col items-center justify-center"
            style={{ background: "oklch(0.25 0.05 260)" }}
          >
            <div className="text-white/70 text-xs font-medium mb-1">
              {t("totalMilk")}
            </div>
            <div className="text-white text-2xl font-bold font-display">
              {totalMilk.toFixed(1)}
            </div>
            <div className="text-white/60 text-xs mt-0.5">
              {lang === "hi" ? "ली." : "L"}
            </div>
          </div>

          {/* Morning milk */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
            <div className="text-amber-600 text-xs font-medium mb-1">
              ☀️ {t("morningMilk")}
            </div>
            <div className="text-amber-700 text-2xl font-bold font-display">
              {savedMilk.morning.toFixed(1)}
            </div>
            <div className="text-amber-500 text-xs mt-0.5">
              {lang === "hi" ? "ली." : "L"}
            </div>
          </div>

          {/* Evening milk */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
            <div className="text-teal-600 text-xs font-medium mb-1">
              🌙 {t("eveningMilk")}
            </div>
            <div className="text-teal-700 text-2xl font-bold font-display">
              {savedMilk.evening.toFixed(1)}
            </div>
            <div className="text-teal-500 text-xs mt-0.5">
              {lang === "hi" ? "ली." : "L"}
            </div>
          </div>
        </div>

        {/* Milk input row */}
        <div className="bg-white border border-border rounded-xl p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                htmlFor="morning-milk-input"
                className="text-xs font-medium text-amber-700 flex items-center gap-1"
              >
                ☀️ {t("morningMilk")}
              </label>
              <Input
                id="morning-milk-input"
                data-ocid="dashboard.milk.morning.input"
                type="number"
                min="0"
                step="0.1"
                placeholder={t("enterMorning")}
                value={morningInput}
                onChange={(e) => setMorningInput(e.target.value)}
                className="h-9 text-sm border-amber-200 focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="evening-milk-input"
                className="text-xs font-medium text-teal-700 flex items-center gap-1"
              >
                🌙 {t("eveningMilk")}
              </label>
              <Input
                id="evening-milk-input"
                data-ocid="dashboard.milk.evening.input"
                type="number"
                min="0"
                step="0.1"
                placeholder={t("enterEvening")}
                value={eveningInput}
                onChange={(e) => setEveningInput(e.target.value)}
                className="h-9 text-sm border-teal-200 focus:border-teal-400"
              />
            </div>
          </div>
          <Button
            data-ocid="dashboard.milk.save_button"
            onClick={saveMilk}
            className="w-full h-9 text-sm font-semibold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.65 0.2 40))",
              color: "white",
              border: "none",
            }}
          >
            🥛 {t("saveMilk")}
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
