import type { PageServerLoad} from '../../../../../.svelte-kit/types/src/routes/$types.js';
import  {redirect} from '@sveltejs/kit'

export type CaregiverListItem = {
	id: string;
	firstName: string;
	lastName: string;
	contact: string;
	link: string;
};

export const load: PageServerLoad = async ({locals, fetch}) => {
	if (!locals.user) {
        throw redirect(303, '/');
    }
	
	try {
		const response = await fetch('/api/caregivers');

		if (!response.ok) {
			throw new Error('Failed to fetch caregivers');
		}

		const result = await response.json();

		// Transform API data to match component expectations
		const caregiverList: CaregiverListItem[] = result.data.map((caregiver: any) => {

			return {
				id: caregiver.id,
				firstName: caregiver.members?.first_name || '',
				lastName: caregiver.members?.last_name || '',
				contact: caregiver.contact_number || '',
				link: `/dashboard/members/caregivers/profile?id=${caregiver.id}`
			};

		});

		return { caregiverList, error: null };
	} catch (err) {
		return {
			caregiverList: [],
			error: err instanceof Error ? err.message : 'Failed to load caregiver data'
		};
	}
}