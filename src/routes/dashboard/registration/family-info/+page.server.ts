import type { PageLoad } from '../../../../../.svelte-kit/types/src/routes/$types.js';

export const load: PageLoad = async({fetch}) => {

	const response = await fetch('/api/community_group_type');
	const options_comGroupType = await response.json();

	return {
		options: {
			comGroupType: options_comGroupType.data
		},
		members: members
	};
}


const members: MemberListFamily[] = [
	{
		family_id: '06f137dd-27b9-4efc-a917-e93c0cb9db1e',
		member_id: '190641fd-22ab-4aaf-bb94-f03201c6f57f',
		firstName: 'Franz',
		lastName: 'Liszt',
		contactNo: '0912 123 1234',
		relationship: ''
	},
	{
		family_id: '06f137dd-27b9-4efc-a917-e93c0cb9db1e',
		member_id: '829e31ac-5e9f-4988-b39a-b8fa0a3ba8bc',
		firstName: 'Carl',
		lastName: 'Czerny',
		contactNo: '0912 123 1234',
		relationship: ''
	},
	{
		family_id: '06f137dd-27b9-4efc-a917-e93c0cb9db1e',
		member_id: '24dc990f-7266-4a3c-95b6-630f9c81c865',
		firstName: 'Fritz',
		lastName: 'Kreisler',
		contactNo: '0912 123 1234',
		relationship: ''
	},
	{
		family_id: '06f137dd-27b9-4efc-a917-e93c0cb9db1e',
		member_id: '7c7e243e-43ee-491f-965a-1ed68b9ea7a9',
		firstName: 'Antonin',
		lastName: 'Dvorak',
		contactNo: '0912 123 1234',
		relationship: ''
	},
	{
		family_id: 'ef8d621c-b743-4cda-a355-6e47ffeafba5',
		member_id: 'bd86b56b-3b6e-46c1-b967-6439efa9061a',
		firstName: 'test',
		lastName: 'test',
		contactNo: '0912 123 1234',
		relationship: ''
	},
	{
		family_id: 'ef8d621c-b743-4cda-a355-6e47ffeafba5',
		member_id: '0736e1e3-62fc-4dbe-a045-fd44bc4361ce',
		firstName: 'Michael',
		lastName: 'Holzer',
		contactNo: '0912 123 1234',
		relationship: ''
	}
]

/**
 * object type used to store information about a new caregiver.
 */
export type NewCaregiver = {
	type: 'new';
	firstName: string;
	lastName: string;
	bday: string;
	sex: string;
	contactNo: string;
	fbLink: string;
	email: string;
	address: string;
	brgy: string;
	occupation: string;
	relationship: string;
	communityGrp_id: number | null;
	income: string;
	communityYr: number;
};

/**
 * object type used to store information about a linked caregiver
 */
export type LinkedCaregiver = {
	// info about the search
	type: 'linked';
	family_id: string | null;
	firstName: string;
	lastName: string;
	contactNo: string;

	// info of a list of family members which are linked to the searched family member
	infoLinked: InfoLinked[];

};

/**
 * object type used to store information about the searched member
 */
export type InfoLinked = {
	member_id: string;
	firstName: string;
	lastName: string;
	contactNo: string;
	relationship: string;
}

export type Caregiver =
	| NewCaregiver
	| LinkedCaregiver;

export type CaregiverError = {
	firstName?: string;
	lastName?: string;
	sex?: string;
	contactNo?: string;
	address?: string;
	brgy?: string;
	msg?: string;			// for existing caregivers
}

export type MemberListFamily = InfoLinked & {
	family_id: string;
}