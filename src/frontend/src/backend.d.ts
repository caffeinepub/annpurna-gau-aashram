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
export interface Calf {
    id: bigint;
    birthYear: bigint;
    cowId: bigint;
    gender: string;
    notes: string;
    birthMonth: bigint;
    addedDate: Time;
    tagNumber: string;
}
export interface Cow {
    id: bigint;
    age: bigint;
    name: string;
    description: string;
    healthStatus: string;
    addedDate: Time;
    breed: string;
    tagNumber: string;
    qrCode: string;
}
export interface backendInterface {
    addAnnouncement(title: string, titleHindi: string, content: string, contentHindi: string, isActive: boolean): Promise<bigint>;
    addCalf(cowId: bigint, birthMonth: bigint, birthYear: bigint, gender: string, tagNumber: string, notes: string): Promise<bigint>;
    addCow(name: string, breed: string, age: bigint, healthStatus: string, description: string, tagNumber: string, qrCode: string): Promise<bigint>;
    addDonation(donorName: string, amount: number, message: string, purpose: string): Promise<bigint>;
    addHealthRecord(cowId: bigint, notes: string, status: string, vetName: string): Promise<bigint>;
    deleteCalf(id: bigint): Promise<void>;
    deleteCow(id: bigint): Promise<void>;
    getActiveAnnouncements(): Promise<Array<Announcement>>;
    getAllCows(): Promise<Array<Cow>>;
    getAllDonations(): Promise<Array<Donation>>;
    getAnnouncement(id: bigint): Promise<Announcement>;
    getCalvesByCow(cowId: bigint): Promise<Array<Calf>>;
    getCow(id: bigint): Promise<Cow>;
    getCowByTag(tag: string): Promise<Cow | null>;
    getDonation(id: bigint): Promise<Donation>;
    getHealthRecord(id: bigint): Promise<HealthRecord>;
    getHealthRecordsByCow(cowId: bigint): Promise<Array<HealthRecord>>;
    updateCow(id: bigint, name: string, breed: string, age: bigint, healthStatus: string, description: string, tagNumber: string, qrCode: string): Promise<void>;
}
