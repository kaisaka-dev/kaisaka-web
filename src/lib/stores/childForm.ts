import { writable } from 'svelte/store';
import type { tableRow } from '../types/manager.js';

type ChildRow = tableRow<"children">;
type MemberRow = tableRow<"members">;
type AddressRow = tableRow<"addresses">;
type EducationStatusRow = tableRow<"education_status">;
type DisabilityRow = tableRow<"disability_category">;
type SocProtectStatusRow = tableRow<"social_protection_status">;
type EmploymentStatusRow = tableRow<"employment_status">;
type PwdIdRow = tableRow<"pwd_ids">;

type ChildFormData = {
    address: Partial<AddressRow>;
    member: Partial<MemberRow>;
    child: Partial<ChildRow>;
    education_status: Partial<EducationStatusRow>;
    social_protection_status: Partial<SocProtectStatusRow>;
    employment_status: Partial<EmploymentStatusRow>;
    pwd_id?: Partial<PwdIdRow>;
};

export const childFormData = writable<Partial<ChildFormData>>({});