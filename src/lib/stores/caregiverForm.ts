import { writable } from 'svelte/store';
import type { tableRow } from '../types/manager.js';

type MemberRow = tableRow<"members">;
type AddressRow = tableRow<"addresses">;
type CaregiverRow = tableRow<"caregivers">;
type RelationCCRow = tableRow<"relationship_cc">;
type CaregiverGroupsRow = tableRow<"caregiver_groups">;


export type CaregiverFormData = {
    address: Partial<AddressRow>;
    member: Partial<MemberRow>;
    caregiver: Partial<CaregiverRow>;
    relationCC: Partial<RelationCCRow>;
    caregiver_group?: Partial<CaregiverGroupsRow>;
};

export const caregiverFormData = writable<Partial<CaregiverFormData>>({});