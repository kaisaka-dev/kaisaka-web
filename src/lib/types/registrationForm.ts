
// stores information for the family members of the child
export type FamilyMembers = {
	hasExisting: boolean,
	linkedFamily: LinkedFamily,
	newCaregivers: NewCaregiver[]
}

// object type used to store information about a new caregiver.
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

// object type used to store information about a linked caregiver
export type LinkedFamily = {
	// info about the search
	type: 'linked';
	family_id: string | null;
	firstName: string;
	lastName: string;
	contactNo: string;

	// info of a list of family members which are linked to the searched family member
	infoLinked: InfoLinked[];

};


// object type used to store information about the searched member
export type InfoLinked = {
	member_id: string;
	caregiver_id: string | null;
	firstName: string;
	lastName: string;
	contactNo: string;
	relationship: string;
}

export type CaregiverError = {
	firstName: string;
	lastName: string;
	sex: string;
	bday: string;
	contactNo: string;
	email: string;
	address: string;
	brgy: string;
	communityYr: string;
	msg: string;			// for existing caregivers
}

// list of all members who are part of a family (returned from GET api, not really associated to the child yet)
export type MemberListFamily = InfoLinked & {
	family_id: string;
}