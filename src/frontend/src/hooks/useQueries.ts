import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Announcement, Cow, Donation, HealthRecord } from "../backend.d";
import { useActor } from "./useActor";

// ── Cows ──────────────────────────────────────────────────────────────
export function useGetAllCows() {
  const { actor, isFetching } = useActor();
  return useQuery<Cow[]>({
    queryKey: ["cows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCows();
    },
    enabled: !!actor && !isFetching,
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
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addCow(
        data.name,
        data.breed,
        data.age,
        data.healthStatus,
        data.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cows"] }),
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
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCow(
        data.id,
        data.name,
        data.breed,
        data.age,
        data.healthStatus,
        data.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cows"] }),
  });
}

export function useDeleteCow() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteCow(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cows"] });
      qc.invalidateQueries({ queryKey: ["health"] });
    },
  });
}

// ── Donations ─────────────────────────────────────────────────────────
export function useGetAllDonations() {
  const { actor, isFetching } = useActor();
  return useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonations();
    },
    enabled: !!actor && !isFetching,
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
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addDonation(
        data.donorName,
        data.amount,
        data.message,
        data.purpose,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["donations"] }),
  });
}

// ── Health Records ────────────────────────────────────────────────────
export function useGetHealthRecordsByCow(cowId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<HealthRecord[]>({
    queryKey: ["health", cowId?.toString()],
    queryFn: async () => {
      if (!actor || cowId === null) return [];
      return actor.getHealthRecordsByCow(cowId);
    },
    enabled: !!actor && !isFetching && cowId !== null,
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
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addHealthRecord(
        data.cowId,
        data.notes,
        data.status,
        data.vetName,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health"] });
    },
  });
}

// ── Announcements ─────────────────────────────────────────────────────
export function useGetActiveAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAnnouncements();
    },
    enabled: !!actor && !isFetching,
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
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addAnnouncement(
        data.title,
        data.titleHindi,
        data.content,
        data.contentHindi,
        data.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}
