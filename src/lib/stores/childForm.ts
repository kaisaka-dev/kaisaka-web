import { writable } from 'svelte/store';
import type { tableRow } from '../types/manager.js';

type ChildRow = tableRow<"children">;
type MemberRow = tableRow<"members">;
type AddressRow = tableRow<"addresses">;
type BarangayRow = tableRow<"barangays">;
type EducationStatusRow = tableRow<"education_status">;
type SocParticipationRow = tableRow<"social_participation">;
type EmploymentStatusRow = tableRow<"employment_status">;
type PwdIdRow = tableRow<"pwd_ids">;

type ChildFormData = {
	address: Partial<AddressRow>;
	barangay: Partial<BarangayRow>;
	member: Partial<MemberRow>;
	child: Partial<ChildRow>;
	education_status?: Partial<EducationStatusRow>;
	social_participation_com?: Partial<SocParticipationRow>;
	social_participation_fam?: Partial<SocParticipationRow>;
	employment_status?: Partial<EmploymentStatusRow>;
	pwd_id?: Partial<PwdIdRow>;
};

export const childFormData = writable<Partial<ChildFormData>>({});