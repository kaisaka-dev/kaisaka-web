
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
	admission_date: string;
	communityGrp: {
		id: number | null;
		yrFrom: string;
		yrTo: string;
	}[];
	income: {
		type: string;
		yrFrom: string;
		yrTo: string;
	}[];
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
	admissionDate: string;
	msg: string;			// for existing caregivers
}

// object type used to store information about a new child in the registration form
export type NewChild = {
	first_name: string;
	middle_name: string;
	last_name: string;
	birthday: string;
	age: string;
	sex: string;
	address: string;
	barangay: string;
	remarks: string;
	date_admission: string;
	disability: {
		category_id: number | null;
		nature: string;
	};
	education: {
		type: string;
		grade_level: string;
		status: string;
		year_start: string;
		year_end: string;
	}[];
	has: {
		birth_cert: boolean;
		medical_cert: boolean;
		barangay_cert: boolean;
		philhealth: boolean;
		pwd_id: boolean;
		pwd: {
			expiry_date: string;
			id: string;
		};
		vote: boolean;
		national_id: boolean;
	};
	employment: {
		able_to_work: boolean;
		type: string;
	};
	part: {
		family_life: boolean;
		fam_year: number;
		community: boolean;
		com_year: number;
	};
	participation?: {
		social_protection: boolean;
		family_life: boolean;
		community_life: boolean;
		year: number;
	}[];
};

export type ChildError = {
	overall: string;
	firstName: string;
	lastName: string;
	birthday: string;
	sex: string;
	address: string;
	barangay: string;
	disCategory: string;
	disNature: string;
	educType: string;
	educLvl: string;
	educStatus: string;
	pwdId: string;
	pwdExpy: string;
	admissionDate: string;
	partFamilyYear: string;
	ayStart: string;
	ayEnd: string;
	partCommunityYear: string;
};

// list of all members who are part of a family (returned from GET api, not really associated to the child yet)
export type MemberListFamily = InfoLinked & {
	family_id: string;
}