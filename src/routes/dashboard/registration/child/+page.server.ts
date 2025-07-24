import type { PageLoad } from '../../../../../.svelte-kit/types/src/routes/$types.js';
import { childFormData } from '$lib/stores/childForm.js';
import { get } from 'svelte/store';


export const load: PageLoad = async({fetch}) => {

	// load the (dropdown) options for disability category
	const response = await fetch('/api/disability_category');
	const options_disCategory = await response.json();

	// load the data in case back was pressed
	const formData = load_formData()

	return {
		options: {
			disCategory: options_disCategory.data

		},
		pastFormData: {
			formData
		}
	};
}

function calculateAge(birthday: string) {
	const birthDate = new Date(birthday);
	const today = new Date();
	let calculatedAge = today.getFullYear() - birthDate.getFullYear();
	const hasHadBirthdayThisYear =
		today.getMonth() > birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
	if (!hasHadBirthdayThisYear) {
		calculatedAge -= 1;
	}
	return calculatedAge.toString();
}

function load_formData() {
	const c = get(childFormData);
	const thisYear = new Date().getFullYear();

	return {
		first_name: c.member?.first_name || '',
		middle_name: c.member?.middle_name || '',
		last_name: c.member?.last_name || '',
		birthday: c.member?.birthday || '',
		age: c.member?.birthday ? calculateAge(c.member.birthday) : '',
		sex: c.member?.sex || '',
		address: c.address?.address || '',
		barangay: c.barangay?.name || '',
		remarks: c.child?.remarks || '',
		date_admission: c.member?.admission_date ? c.member.admission_date.substring(0, 7) : new Date().toISOString().slice(0, 7),
		disability: {
			category_id: c.child?.disability_id || null,
			nature: c.child?.disability_nature || ''
		},
		educ: {
			type: c.education_status?.education_type || "",
			year_start: c.education_status?.year_start || thisYear,
			year_end: c.education_status?.year_end || thisYear + 1,
			grade_level: c.education_status?.grade_level || "",
			status: c.education_status?.student_status_type || ""
		},
		has: {
			birth_cert: c.child?.has_birth_cert || false,
			medical_cert: c.child?.has_medical_cert || false,
			barangay_cert: c.child?.has_barangay_cert || false,
			philhealth: c.child?.has_philhealth || false,
			pwd_id: !!c.pwd_id,
			pwd: {
				expiry_date: c.pwd_id?.expiry_date || '',
				id: c.pwd_id?.pwd_id || ''
			},
			vote: c.child?.has_vote || false,
			national_id: c.child?.has_national_id || false,
		},
		employment: {
			able_to_work: c.employment_status?.able_to_work || false,
			type: c.employment_status?.employment_type || ''
		},
		part: {
			family_life: !!c.social_participation_fam,
			fam_year: c.social_participation_fam?.year || thisYear,
			community: !!c.social_participation_com,
			com_year: c.social_participation_com?.year || thisYear,
		}
	};
}