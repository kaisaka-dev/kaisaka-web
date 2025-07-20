import type { PageLoad } from '../../../../../.svelte-kit/types/src/routes/$types.js';

export type Children = {
	id: string;
	firstName: string;      // from members table: first_name + middle_name
	lastName: string;       // from members table: last_name
	birthday: string;       // from members table: birthday
	category: string;       // from children table: disability_id -> id from disability_category: name
	nature: string;         // from children table: disability_nature
	age: number;            // computed
	sex: string;            // from members table: sex
	educType: string;       // from children table: id -> child_id from education_status: education_type
	gradeLevel: string;     // from children table: id -> child_id from education_status: grade_level
	lastUpdated: string;    // from members table: last_updated
	link: string;           // /dashboard/members/children/profile/{child.id}
};

export const load: PageServerLoad = async ({ fetch, locals }) => {
	 if (!locals.user) {
        throw redirect(303, '/');
    }
	// Function which calculates age from birthday
	const calculateAge = (birthDate: string | null): number => {
		if (!birthDate) return 0;
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	};

	// Function for date formatting
	const formatDate = (dateString: string | null): string => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString();
	};

	try {
		// Use the new getChildrenList method that returns joined data
		const childrenRes = await fetch('/api/children?type=list');

		if (childrenRes.status === 401){
            throw new Error('401 Not Authorized.');
        }

		if (!childrenRes.ok) {
			throw new Error('Failed to fetch children list');
		}

		const response = await childrenRes.json();
		const childrenData = response.data;

		// Transform the joined data into the Children type
		const children: Children[] = childrenData.map((child: any) => {
			const member = child.members;
			const disability = child.disability_category;
			const educationArray = child.education_status;
			let education = null;

			if (educationArray && Array.isArray(educationArray) && educationArray.length > 0) {
				// Get the most recent education record (sorted by updated_at)
				education = educationArray.sort((a: any, b: any) => {
					if (!a.updated_at) return 1;
					if (!b.updated_at) return -1;
					return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
				})[0];
			}

			return {
				id: child.id,
				firstName: [member?.first_name, member?.middle_name].filter(Boolean).join(' '),
				lastName: member?.last_name || '',
				birthday: member?.birthday || '',
				category: disability?.name || '',
				nature: child.disability_nature || '',
				age: calculateAge(member?.birthday || null),
				sex: member?.sex || '',
				educType: education?.education_type || '',
				gradeLevel: education?.grade_level || '',
				lastUpdated: formatDate(education?.updated_at || null),
				link: `/dashboard/members/children/profile?id=${child.id}`
			};
		});

		const disCatRes = await fetch('/api/disability_category');
		const disCatData = await disCatRes.json();
		const options_disCategory = [...new Set(disCatData.data.map((item: any) => item.name))];

		return {
			children,
			error: null,
			options: { disCategory: options_disCategory }
		};
	} catch (error) {
		return {
			children: [],
			error: error instanceof Error ? error.message : 'Failed to load children data'
		};
	}
};