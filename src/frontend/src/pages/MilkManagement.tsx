import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Milk, MilkOff, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Cow, MilkRecord } from "../backend.d";
import {
  useAddMilkRecord,
  useGetAllCows,
  useGetMilkRecordsByDate,
  useGetTodayMilkRecords,
} from "../hooks/useQueries";
import { useLang } from "../lib/LanguageContext";

// ── AGA ID helper ──────────────────────────────────────────────────────
function getAgaId(cow: Cow): string {
  return `AGA${String(cow.id).padStart(5, "0")}`;
}

// Format date as YYYY-MM-DD
function dateToKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayKey() {
  return dateToKey(new Date());
}

function getRecordForCow(
  records: MilkRecord[],
  cowId: bigint,
): MilkRecord | undefined {
  return records.find((r) => r.cowId === cowId);
}

// ── Component ──────────────────────────────────────────────────────────
export default function MilkManagement() {
  const { t, lang } = useLang();
  const { data: allCows = [], isLoading: cowsLoading } = useGetAllCows();

  const [selectedDate, setSelectedDate] = useState<string>(todayKey());
  const isToday = selectedDate === todayKey();

  // Use today-specific hook when date is today, otherwise date-specific hook
  const { data: todayRecords = [], isLoading: todayLoading } =
    useGetTodayMilkRecords();
  const { data: dateRecords = [], isLoading: dateLoading } =
    useGetMilkRecordsByDate(selectedDate);

  const records: MilkRecord[] = isToday ? todayRecords : dateRecords;
  const isLoading = cowsLoading || (isToday ? todayLoading : dateLoading);

  const addMilkRecord = useAddMilkRecord();

  const [sheetOpen, setSheetOpen] = useState(false);
  // savedRows: set of cowIds that were just saved (reset on date change)
  const [savedRows, setSavedRows] = useState<Set<string>>(new Set());

  // Inline edit state: cowId → {morning, evening}
  const [inlineValues, setInlineValues] = useState<
    Record<string, { morning: string; evening: string }>
  >({});

  // Reset inline values when date changes
  const prevDateRef = useState(() => selectedDate);
  if (prevDateRef[0] !== selectedDate) {
    prevDateRef[1](selectedDate);
    setInlineValues({});
    setSavedRows(new Set());
  }

  // Only show Lactating (Dujni) cows
  const lactatingCows = allCows.filter(
    (c) => c.healthStatus === "Lactating" || c.healthStatus === "दूजनी",
  );

  // Get current inline value (inline state takes priority over backend record)
  function getMorning(cow: Cow): string {
    const id = cow.id.toString();
    if (inlineValues[id]?.morning !== undefined)
      return inlineValues[id].morning;
    const rec = getRecordForCow(records, cow.id);
    return rec && rec.morning > 0 ? rec.morning.toString() : "";
  }

  function getEvening(cow: Cow): string {
    const id = cow.id.toString();
    if (inlineValues[id]?.evening !== undefined)
      return inlineValues[id].evening;
    const rec = getRecordForCow(records, cow.id);
    return rec && rec.evening > 0 ? rec.evening.toString() : "";
  }

  function setMorning(cow: Cow, val: string) {
    const id = cow.id.toString();
    setSavedRows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setInlineValues((prev) => ({
      ...prev,
      [id]: { morning: val, evening: prev[id]?.evening ?? getEvening(cow) },
    }));
  }

  function setEvening(cow: Cow, val: string) {
    const id = cow.id.toString();
    setSavedRows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setInlineValues((prev) => ({
      ...prev,
      [id]: { morning: prev[id]?.morning ?? getMorning(cow), evening: val },
    }));
  }

  const currentUser = (() => {
    try {
      const s = localStorage.getItem("gau_session");
      return s ? (JSON.parse(s) as { name: string }).name : "Admin";
    } catch {
      return "Admin";
    }
  })();

  async function saveInline(cow: Cow) {
    const id = cow.id.toString();
    const morning = Number.parseFloat(getMorning(cow)) || 0;
    const evening = Number.parseFloat(getEvening(cow)) || 0;
    try {
      await addMilkRecord.mutateAsync({
        cowId: cow.id,
        cowName: cow.name,
        date: selectedDate,
        morning,
        evening,
        changedBy: currentUser,
      });
      setSavedRows((prev) => new Set(prev).add(id));
    } catch {
      toast.error(lang === "hi" ? "सहेजने में त्रुटि" : "Save failed");
    }
  }

  // ── Totals ─────────────────────────────────────────────────────────
  const totals = lactatingCows.reduce(
    (acc, cow) => {
      const m = Number.parseFloat(getMorning(cow)) || 0;
      const e = Number.parseFloat(getEvening(cow)) || 0;
      acc.morning += m;
      acc.evening += e;
      return acc;
    },
    { morning: 0, evening: 0 },
  );

  // ── Bulk entry sheet ───────────────────────────────────────────────
  const [bulkValues, setBulkValues] = useState<
    Record<string, { morning: string; evening: string }>
  >({});

  function openBulkSheet() {
    const init: Record<string, { morning: string; evening: string }> = {};
    for (const cow of lactatingCows) {
      const id = cow.id.toString();
      const rec = getRecordForCow(records, cow.id);
      init[id] = {
        morning: rec && rec.morning > 0 ? rec.morning.toString() : "",
        evening: rec && rec.evening > 0 ? rec.evening.toString() : "",
      };
    }
    setBulkValues(init);
    setSheetOpen(true);
  }

  async function saveBulkEntry() {
    try {
      await Promise.all(
        lactatingCows.map((cow) => {
          const id = cow.id.toString();
          const morning = Number.parseFloat(bulkValues[id]?.morning ?? "") || 0;
          const evening = Number.parseFloat(bulkValues[id]?.evening ?? "") || 0;
          return addMilkRecord.mutateAsync({
            cowId: cow.id,
            cowName: cow.name,
            date: selectedDate,
            morning,
            evening,
            changedBy: currentUser,
          });
        }),
      );
      setSavedRows(new Set(lactatingCows.map((c) => c.id.toString())));
      setInlineValues({});
      setSheetOpen(false);
      toast.success(t("milkSaved"));
    } catch {
      toast.error(lang === "hi" ? "सहेजने में त्रुटि" : "Save failed");
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Milk className="h-6 w-6 text-primary" />
            {t("milkManagement")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lang === "hi"
              ? `टोटल ${lactatingCows.length} दूजनी गाय`
              : `${lactatingCows.length} lactating cows`}
          </p>
        </div>
        <Button
          data-ocid="milk.open_modal_button"
          onClick={openBulkSheet}
          className="gap-2 font-semibold"
          style={{ background: "oklch(0.65 0.2 55)", color: "white" }}
        >
          <Milk className="h-4 w-4" />
          {t("milkEntry")}
        </Button>
      </motion.div>

      {/* Date selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-5 bg-card border border-border rounded-xl px-4 py-3 shadow-sm"
      >
        <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {t("selectDate")}:
        </Label>
        <input
          data-ocid="milk.input"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-1 bg-transparent text-sm font-medium text-foreground border-none outline-none cursor-pointer"
          max={todayKey()}
        />
      </motion.div>

      {/* Summary tiles */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        <div
          className="rounded-2xl p-4 text-center flex flex-col items-center justify-center"
          style={{ background: "oklch(0.25 0.05 260)" }}
        >
          <div className="text-white/70 text-xs font-medium mb-1">
            {lang === "hi" ? "कुल दूध" : "Total Milk"}
          </div>
          <div className="text-white text-2xl font-bold font-display">
            {(totals.morning + totals.evening).toFixed(1)}
          </div>
          <div className="text-white/60 text-xs mt-0.5">
            {lang === "hi" ? "ली." : "L"}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
          <div className="text-amber-600 text-xs font-medium mb-1 flex items-center gap-1">
            <Sun className="h-3 w-3" /> {lang === "hi" ? "सुबह" : "Morning"}
          </div>
          <div className="text-amber-700 text-2xl font-bold font-display">
            {totals.morning.toFixed(1)}
          </div>
          <div className="text-amber-500 text-xs mt-0.5">
            {lang === "hi" ? "ली." : "L"}
          </div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
          <div className="text-indigo-600 text-xs font-medium mb-1 flex items-center gap-1">
            <Moon className="h-3 w-3" /> {lang === "hi" ? "शाम" : "Evening"}
          </div>
          <div className="text-indigo-700 text-2xl font-bold font-display">
            {totals.evening.toFixed(1)}
          </div>
          <div className="text-indigo-500 text-xs mt-0.5">
            {lang === "hi" ? "ली." : "L"}
          </div>
        </div>
      </motion.div>

      {/* Main table */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="milk.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : lactatingCows.length === 0 ? (
        <div
          data-ocid="milk.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <MilkOff className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{t("noMilkCows")}</p>
          <p className="text-xs mt-1 opacity-60">
            {lang === "hi"
              ? "गाय परिवार में जाकर गाय का प्रकार 'दूजनी' सेट करें"
              : "Go to Gau Parivar and set a cow's type to 'Lactating'"}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          data-ocid="milk.table"
          className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  <div className="flex items-center gap-1.5">
                    <span>🐄</span>
                    {lang === "hi" ? "गाय का नाम" : "Cow Name"}
                  </div>
                </th>
                <th className="text-center px-3 py-3 font-semibold text-amber-700">
                  <div className="flex items-center justify-center gap-1">
                    <Sun className="h-3.5 w-3.5" />
                    {lang === "hi" ? "सुबह" : "Morning"}
                  </div>
                </th>
                <th className="text-center px-3 py-3 font-semibold text-indigo-700">
                  <div className="flex items-center justify-center gap-1">
                    <Moon className="h-3.5 w-3.5" />
                    {lang === "hi" ? "शाम" : "Evening"}
                  </div>
                </th>
                <th className="text-center px-3 py-3 font-semibold text-foreground">
                  {lang === "hi" ? "कुल" : "Total"}
                </th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {lactatingCows.map((cow, idx) => {
                const morning = getMorning(cow);
                const evening = getEvening(cow);
                const rowTotal =
                  (Number.parseFloat(morning) || 0) +
                  (Number.parseFloat(evening) || 0);
                const isSaved = savedRows.has(cow.id.toString());
                const isSaving = addMilkRecord.isPending;
                return (
                  <motion.tr
                    key={cow.id.toString()}
                    data-ocid={`milk.item.${idx + 1}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-amber-700">
                            {cow.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {cow.name}
                          </p>
                          <p className="text-[10px] text-green-700 font-mono font-medium">
                            {getAgaId(cow)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        data-ocid={`milk.input.${idx + 1}`}
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={morning}
                        onChange={(e) => setMorning(cow, e.target.value)}
                        className="h-8 text-sm text-center w-20 border-amber-200 focus:border-amber-400"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        data-ocid={`milk.input.${idx + 1}`}
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={evening}
                        onChange={(e) => setEvening(cow, e.target.value)}
                        className="h-8 text-sm text-center w-20 border-indigo-200 focus:border-indigo-400"
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={cn(
                          "font-bold text-sm",
                          rowTotal > 0
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {rowTotal.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isSaving}
                        className={cn(
                          "h-8 text-xs px-3 transition-all duration-200",
                          isSaved
                            ? "text-green-700 border-green-400 bg-green-50 hover:bg-green-50 cursor-default"
                            : "text-primary border-primary/30 hover:bg-primary/10",
                        )}
                        onClick={() => saveInline(cow)}
                        data-ocid={`milk.save_button.${idx + 1}`}
                      >
                        {isSaved
                          ? lang === "hi"
                            ? "सहेजा गया ✓"
                            : "Saved ✓"
                          : lang === "hi"
                            ? "सहेजें"
                            : "Save"}
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr className="bg-muted/40 border-t-2 border-border">
                <td className="px-4 py-3 font-bold text-foreground">
                  {lang === "hi" ? "कुल योग" : "Total"}
                </td>
                <td className="px-3 py-3 text-center font-bold text-amber-700">
                  {totals.morning.toFixed(1)} L
                </td>
                <td className="px-3 py-3 text-center font-bold text-indigo-700">
                  {totals.evening.toFixed(1)} L
                </td>
                <td className="px-3 py-3 text-center font-bold text-primary">
                  {(totals.morning + totals.evening).toFixed(1)} L
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </motion.div>
      )}

      {/* Bulk Entry Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          data-ocid="milk.sheet"
          className="w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="font-display flex items-center gap-2">
              <Milk className="h-5 w-5 text-primary" />
              {t("cowMilkEntry")}
            </SheetTitle>
            <p className="text-xs text-muted-foreground">
              {lang === "hi"
                ? `दिनांक: ${selectedDate}`
                : `Date: ${selectedDate}`}
            </p>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            {lactatingCows.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t("noMilkCows")}
              </p>
            ) : (
              lactatingCows.map((cow, idx) => (
                <div
                  key={cow.id.toString()}
                  data-ocid={`milk.item.${idx + 1}`}
                  className="bg-muted/30 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-700">
                        {cow.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {cow.name}
                      </p>
                      <p className="text-[10px] text-green-700 font-mono font-medium">
                        {getAgaId(cow)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-amber-700 flex items-center gap-1">
                        <Sun className="h-3 w-3" />
                        {lang === "hi" ? "सुबह (ली.)" : "Morning (L)"}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={bulkValues[cow.id.toString()]?.morning ?? ""}
                        onChange={(e) =>
                          setBulkValues((prev) => ({
                            ...prev,
                            [cow.id.toString()]: {
                              morning: e.target.value,
                              evening: prev[cow.id.toString()]?.evening ?? "",
                            },
                          }))
                        }
                        className="h-9 text-sm border-amber-200 focus:border-amber-400"
                        data-ocid={`milk.input.${idx + 1}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-indigo-700 flex items-center gap-1">
                        <Moon className="h-3 w-3" />
                        {lang === "hi" ? "शाम (ली.)" : "Evening (L)"}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={bulkValues[cow.id.toString()]?.evening ?? ""}
                        onChange={(e) =>
                          setBulkValues((prev) => ({
                            ...prev,
                            [cow.id.toString()]: {
                              morning: prev[cow.id.toString()]?.morning ?? "",
                              evening: e.target.value,
                            },
                          }))
                        }
                        className="h-9 text-sm border-indigo-200 focus:border-indigo-400"
                        data-ocid={`milk.input.${idx + 1}`}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <SheetFooter className="mt-6 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSheetOpen(false)}
              data-ocid="milk.cancel_button"
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={saveBulkEntry}
              disabled={addMilkRecord.isPending}
              data-ocid="milk.submit_button"
              className="flex-1 font-semibold"
              style={{ background: "oklch(0.65 0.2 55)", color: "white" }}
            >
              {t("milkEntry")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
