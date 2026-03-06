import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  PawPrint as CowIcon,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Cow } from "../backend.d";
import {
  useAddCow,
  useDeleteCow,
  useGetAllCows,
  useUpdateCow,
} from "../hooks/useQueries";
import { useLang } from "../lib/LanguageContext";
import { formatTime } from "../utils/timeUtils";

interface CowRegistryProps {
  onViewHealth: (id: bigint) => void;
}

const defaultForm = {
  name: "",
  breed: "",
  age: "",
  healthStatus: "Healthy",
  description: "",
};

export default function CowRegistry({ onViewHealth }: CowRegistryProps) {
  const { t, lang } = useLang();
  const { data: cows = [], isLoading } = useGetAllCows();
  const addCow = useAddCow();
  const updateCow = useUpdateCow();
  const deleteCow = useDeleteCow();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCow, setEditCow] = useState<Cow | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState(defaultForm);

  const filtered = cows.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.breed.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditCow(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEdit(cow: Cow) {
    setEditCow(cow);
    setForm({
      name: cow.name,
      breed: cow.breed,
      age: cow.age.toString(),
      healthStatus: cow.healthStatus,
      description: cow.description,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const age = BigInt(Number.parseInt(form.age) || 0);
    try {
      if (editCow) {
        await updateCow.mutateAsync({
          id: editCow.id,
          name: form.name,
          breed: form.breed,
          age,
          healthStatus: form.healthStatus,
          description: form.description,
        });
        toast.success(t("cowUpdated"));
      } else {
        await addCow.mutateAsync({
          name: form.name,
          breed: form.breed,
          age,
          healthStatus: form.healthStatus,
          description: form.description,
        });
        toast.success(t("cowAdded"));
      }
      setDialogOpen(false);
    } catch {
      toast.error(t("error"));
    }
  }

  async function handleDelete() {
    if (deleteId === null) return;
    try {
      await deleteCow.mutateAsync(deleteId);
      toast.success(t("cowDeleted"));
      setDeleteId(null);
    } catch {
      toast.error(t("error"));
    }
  }

  const isPending = addCow.isPending || updateCow.isPending;

  function getStatusClass(status: string) {
    const s = status.toLowerCase();
    if (s === "healthy") return "status-healthy";
    if (s === "sick") return "status-sick";
    return "status-recovering";
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <CowIcon className="h-6 w-6 text-primary" />
            {t("cowRegistry")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lang === "hi"
              ? `कुल ${cows.length} गाय`
              : `${cows.length} cows registered`}
          </p>
        </div>
        <Button
          data-ocid="cow.add_button"
          onClick={openAdd}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          {t("addCow")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          data-ocid="cow.search_input"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table / Cards */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="cow.loading_state">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="cow.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <CowIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{t("noCows")}</p>
          <Button onClick={openAdd} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            {t("addCow")}
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div
            data-ocid="cow.table"
            className="hidden md:block bg-card rounded-2xl border border-border shadow-card overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    {t("cowName")}
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    {t("breed")}
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    {t("age")}
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    {t("healthStatus")}
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    {t("addedDate")}
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cow, idx) => (
                  <motion.tr
                    key={cow.id.toString()}
                    data-ocid={`cow.item.${idx + 1}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-accent-foreground">
                            {cow.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {cow.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {cow.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cow.breed}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cow.age.toString()} yr
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium",
                          getStatusClass(cow.healthStatus),
                        )}
                      >
                        {cow.healthStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatTime(cow.addedDate, lang)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => onViewHealth(cow.id)}
                          title={t("viewHealth")}
                          data-ocid={`cow.secondary_button.${idx + 1}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => openEdit(cow)}
                          data-ocid={`cow.edit_button.${idx + 1}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteId(cow.id)}
                          data-ocid={`cow.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((cow, idx) => (
              <motion.div
                key={cow.id.toString()}
                data-ocid={`cow.item.${idx + 1}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 shadow-xs"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-accent/40 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-foreground">
                        {cow.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {cow.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cow.breed} · {cow.age.toString()} yr
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      getStatusClass(cow.healthStatus),
                    )}
                  >
                    {cow.healthStatus}
                  </span>
                </div>
                {cow.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {cow.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs h-7"
                    onClick={() => onViewHealth(cow.id)}
                  >
                    <Eye className="h-3 w-3" />
                    {t("viewHealth")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs h-7"
                    onClick={() => openEdit(cow)}
                    data-ocid={`cow.edit_button.${idx + 1}`}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs h-7 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(cow.id)}
                    data-ocid={`cow.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editCow ? t("editCow") : t("addCow")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("cowName")} *</Label>
              <Input
                data-ocid="cow.form.input"
                required
                placeholder={t("cowName")}
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t("breed")} *</Label>
                <Input
                  required
                  placeholder={t("breed")}
                  value={form.breed}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, breed: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("age")}</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.age}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, age: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("healthStatus")}</Label>
              <Select
                value={form.healthStatus}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, healthStatus: v }))
                }
              >
                <SelectTrigger data-ocid="cow.form.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">{t("healthy")}</SelectItem>
                  <SelectItem value="Sick">{t("sick")}</SelectItem>
                  <SelectItem value="Recovering">{t("recovering")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("description")}</Label>
              <Textarea
                placeholder={t("description")}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="cow.form.cancel_button"
                onClick={() => setDialogOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                data-ocid="cow.form.submit_button"
                disabled={isPending}
              >
                {isPending ? t("saving") : editCow ? t("save") : t("addCow")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              {t("confirmDelete")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmMsg")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="cow.form.cancel_button">
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="cow.delete_button.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCow.isPending ? t("saving") : t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
