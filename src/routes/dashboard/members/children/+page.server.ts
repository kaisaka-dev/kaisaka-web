import type { Database} from '$lib/types/supabase-types.js';
import type { PageLoad} from '../../../../../.svelte-kit/types/src/routes/$types.js';

type ChildrenRow = Database['public']['Tables']['children']['Row'];
type MembersRow = Database['public']['Tables']['members']['Row'];
type DisabilityCategoryRow = Database['public']['Tables']['disability_category']['Row'];
type EducationStatusRow = Database['public']['Tables']['education_status']['Row'];

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

export const load: PageLoad = async ({ fetch }) => {
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
		// Fetch all required data in parallel
		const [childrenRes, membersRes, disabilityRes, educationRes] = await Promise.all([
			fetch('/api/children'),
			fetch('/api/members'),
			fetch('/api/disability_category'),
			fetch('/api/education_status')
		]);

		if (!childrenRes.ok || !membersRes.ok || !disabilityRes.ok || !educationRes.ok) {
			// throw new Error('Failed to fetch required data');
			if (!childrenRes.ok) {
				throw new Error('Failed to fetch childrenRes');
			}
			if (!membersRes.ok) {
				throw new Error('Failed to fetch membersRes');
			}
			if (!disabilityRes.ok) {
				throw new Error('Failed to fetch disabilityRes');
			}
			if (!educationRes.ok) {
				throw new Error('Failed to fetch educationRes');
			}
		}

		const childrenData: ChildrenRow[] = await childrenRes.json();
		const membersData: MembersRow[] = await membersRes.json();
		const disabilityData: DisabilityCategoryRow[] = await disabilityRes.json();
		const educationData: EducationStatusRow[] = await educationRes.json();
		console.log(childrenData)
		console.log(membersData)
		console.log(disabilityData)
		console.log(educationData)

		// Create lookup maps for faster access
		const membersMap = new Map<string, MembersRow>(membersData.map(m => [m.id, m]));
		const disabilityMap = new Map<number, string>(
			disabilityData.filter(d => d.name).map(d => [d.id, d.name as string])
		);
		const educationMap = new Map<string, EducationStatusRow[]>(
			educationData.reduce((acc, curr) => {
				if (!curr.child_id) return acc;
				const existing = acc.get(curr.child_id) || [];
				return acc.set(curr.child_id, [...existing, curr]);
			}, new Map())
		);

		// Transform the data into the Children type
		const children: Children[] = childrenData.map(child => {
			const member = child.member_id ? membersMap.get(child.member_id) : null;
			const latestEducation = child.id ? educationMap.get(child.id)?.[0] : null;

			return {
				id: child.id,
				firstName: [member?.first_name, member?.middle_name].filter(Boolean).join(' '),
				lastName: member?.last_name || '',
				birthday: member?.birthday || '',
				category: child.disability_id ? disabilityMap.get(child.disability_id) || '' : '',
				nature: child.disability_nature || '',
				age: calculateAge(member?.birthday || null),
				sex: member?.sex || '',
				educType: latestEducation?.education_type || '',
				gradeLevel: latestEducation?.grade_level || '',
				lastUpdated: formatDate(member?.last_updated || null),
				link: `/dashboard/members/children/profile/${child.id}`
			};
		});

		return {
			children,
			error: null
		};
	} catch (error) {
		return {
			children: [],
			error: error instanceof Error ? error.message : 'Failed to load children data'
		};
	}
};