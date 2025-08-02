import type { PageLoad } from '../../../../../.svelte-kit/types/src/routes/$types.js';

type PendingDocument = {
	id: string;
	firstName: string;
	lastName: string;
	medCert: string;
	birthCert: string;
	brgyCert: string;
	interventionPlan: string;
	link: string;
};

export const load: PageLoad = async ({ fetch }) => {
	try {
		console.log('Fetching: /api/children?type=pending-documents');
		const response = await fetch('/api/children?type=pending-documents');

		if (!response.ok) {
			throw new Error('Failed to fetch pending documents');
		}

		const result = await response.json();

		// Transform API data to match component expectations
		const pendingList: PendingDocument[] = result.data.map((child: any) => ({
			id: child.id || '',
			firstName: child.members?.first_name || '',
			lastName: child.members?.last_name || '',
			medCert: child.has_medical_cert ? "✅" : "❌",
			birthCert: child.has_birth_cert ? "✅" : "❌",
			brgyCert: child.has_barangay_cert ? "✅" : "❌",
			interventionPlan: child.intervention?.intervention ? "✅" : "❌",
			link: `/dashboard/members/children/profile?id=${child.id}`
		}));

		return { pendingList: pendingList }

	} catch (error) {
		console.error('Error fetching pending documents:', error);

		return {
			pendingList: [],
			error: error instanceof Error ? error.message : 'Failed to load pending list data'
		}
	}

}