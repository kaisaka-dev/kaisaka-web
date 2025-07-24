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
	fbLink?: string;
	email?: string;
	address: string;
	brgy: string;
	occupation: string;
	relationship: string;
	communityGrp_id: number;
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