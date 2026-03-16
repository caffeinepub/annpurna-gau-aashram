import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Announcement,
  Calf,
  ChangeLog,
  Cow,
  Donation,
  HealthRecord,
  User,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Cows ────────────────────────────────────────────────────────────────────
export function useGetAllCows() {
  const { actor, isFetching } = useActor();
  return useQuery<Cow[]>({
    queryKey: ["cows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCows();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useAddCow() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      breed: string;
      age: bigint;
      healthStatus: string;
      description: string;
      tagNumber: string;
      qrCode: string;
      changedBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addCow(
        data.name,
        data.breed,
        data.age,
        data.healthStatus,
        data.description,
        data.tagNumber,
        data.qrCode,
        data.changedBy,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cows"] });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

export function useUpdateCow() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      breed: string;
      age: bigint;
      healthStatus: string;
      description: string;
      tagNumber: string;
      qrCode: string;
      changedBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCow(
        data.id,
        data.name,
        data.breed,
        data.age,
        data.healthStatus,
        data.description,
        data.tagNumber,
        data.qrCode,
        data.changedBy,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cows"] });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

export function useDeleteCow() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; changedBy: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteCow(data.id, data.changedBy);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cows"] });
      qc.invalidateQueries({ queryKey: ["health"] });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

// ── Donations ───────────────────────────────────────────────────────────────
export function useGetAllDonations() {
  const { actor, isFetching } = useActor();
  return useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonations();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useAddDonation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      donorName: string;
      amount: number;
      message: string;
      purpose: string;
      changedBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addDonation(
        data.donorName,
        data.amount,
        data.message,
        data.purpose,
        data.changedBy,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donations"] });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

// ── Health Records ───────────────────────────────────────────────────────────────
export function useGetHealthRecordsByCow(cowId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<HealthRecord[]>({
    queryKey: ["health", cowId?.toString()],
    queryFn: async () => {
      if (!actor || cowId === null) return [];
      return actor.getHealthRecordsByCow(cowId);
    },
    enabled: !!actor && !isFetching && cowId !== null,
    refetchInterval: 30000,
  });
}

export function useGetAllHealthRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<HealthRecord[]>({
    queryKey: ["health", "all"],
    queryFn: async () => {
      if (!actor) return [];
      const cows = await actor.getAllCows();
      const results = await Promise.all(
        cows.map((c) => actor.getHealthRecordsByCow(c.id)),
      );
      return results.flat();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useAddHealthRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      cowId: bigint;
      notes: string;
      status: string;
      vetName: string;
      changedBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addHealthRecord(
        data.cowId,
        data.notes,
        data.status,
        data.vetName,
        data.changedBy,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health"] });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

// ── Announcements ───────────────────────────────────────────────────────────────
export function useGetActiveAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAnnouncements();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      titleHindi: string;
      content: string;
      contentHindi: string;
      isActive: boolean;
      changedBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addAnnouncement(
        data.title,
        data.titleHindi,
        data.content,
        data.contentHindi,
        data.isActive,
        data.changedBy,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

// ── Calves ────────────────────────────────────────────────────────────────────
export function useGetCalvesByCow(cowId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Calf[]>({
    queryKey: ["calves", cowId?.toString()],
    queryFn: async () => {
      if (!actor || cowId === null) return [];
      return actor.getCalvesByCow(cowId);
    },
    enabled: !!actor && !isFetching && cowId !== null,
    refetchInterval: 30000,
  });
}

export function useAddCalf() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      cowId: bigint;
      birthMonth: bigint;
      birthYear: bigint;
      gender: string;
      tagNumber: string;
      notes: string;
      changedBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addCalf(
        data.cowId,
        data.birthMonth,
        data.birthYear,
        data.gender,
        data.tagNumber,
        data.notes,
        data.changedBy,
      );
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["calves", variables.cowId.toString()],
      });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

export function useDeleteCalf() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; changedBy: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteCalf(data.id, data.changedBy);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calves"] });
      qc.invalidateQueries({ queryKey: ["changelogs"] });
    },
  });
}

export function useGetCowByTag() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (tag: string): Promise<Cow | null> => {
      if (!actor) throw new Error("No actor");
      return actor.getCowByTag(tag);
    },
  });
}

// ── Users ───────────────────────────────────────────────────────────────────
export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; role: string; pin: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createUser(data.name, data.role, data.pin);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteUser(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

// ── Change Logs ──────────────────────────────────────────────────────────────
export function useGetAllChangeLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<ChangeLog[]>({
    queryKey: ["changelogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChangeLogs();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}
