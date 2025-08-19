import type { PageLoad } from '../../../../.svelte-kit/types/src/routes/$types.js';
import type { MemberListFamily } from '$lib/types/registrationForm.js';

export const load: PageLoad = async({fetch}) => {

	// fetch (dropdown) options for community group
	const response = await fetch('/api/community_group_type');
	const options_comGroupType = await response.json();

	// fetch list of members
	const familyMembersResponse = await fetch('/api/family_members?details=true');
	const familyMembersData = await familyMembersResponse.json();

	// transform api data to match MembersListFamily
	const members: MemberListFamily[] = familyMembersData.data.map((item: any) => ({
		family_id: item.family_id,
		member_id: item.member_id,
		caregiver_id: item.members.caregivers.length > 0
			? item.members.caregivers[0].id
			: null,
		firstName: item.members.first_name,
		lastName: item.members.last_name,
		contactNo: item.members.caregivers.length > 0
			? item.members.caregivers[0].contact_number
			: '', // Use first caregiver's contact number, or empty string if no caregivers
		relationship: item.relationship_type || ''
	}));

	return {
		options: {
			comGroupType: options_comGroupType.data
		},
		members: members
	};
}
