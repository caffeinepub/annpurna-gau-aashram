import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Announcement {
    id: bigint;
    contentHindi: string;
    title: string;
    content: string;
    titleHindi: string;
    date: Time;
    isActive: boolean;
}
export interface Donation {
    id: bigint;
    date: Time;
    donorName: string;
    message: string;
    amount: number;
    purpose: string;
}
export interface HealthRecord {
    id: bigint;
    status: string;
    date: Time;
    cowId: bigint;
    vetName: string;
    notes: string;
}
export type Time = bigint;
export interface Cow {
    id: bigint;
    age: bigint;
    name: string;
    description: string;
    healthStatus: string;
    addedDate: Time;
    breed: string;
}
export interface backendInterface {
    addAnnouncement(title: string, titleHindi: string, content: string, contentHindi: string, isActive: boolean): Promise<bigint>;
    addCow(name: string, breed: string, age: bigint, healthStatus: string, description: string): Promise<bigint>;
    addDonation(donorName: string, amount: number, message: string, purpose: string): Promise<bigint>;
    addHealthRecord(cowId: bigint, notes: string, status: string, vetName: string): Promise<bigint>;
    deleteCow(id: bigint): Promise<void>;
    getActiveAnnouncements(): Promise<Array<Announcement>>;
    getAllCows(): Promise<Array<Cow>>;
    getAllDonations(): Promise<Array<Donation>>;
    getAnnouncement(id: bigint): Promise<Announcement>;
    getCow(id: bigint): Promise<Cow>;
    getDonation(id: bigint): Promise<Donation>;
    getHealthRecord(id: bigint): Promise<HealthRecord>;
    getHealthRecordsByCow(cowId: bigint): Promise<Array<HealthRecord>>;
    updateCow(id: bigint, name: string, breed: string, age: bigint, healthStatus: string, description: string): Promise<void>;
}
