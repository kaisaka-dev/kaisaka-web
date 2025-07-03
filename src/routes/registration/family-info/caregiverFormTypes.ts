export type CaregiverError =
		| {			// for new caregivers
		firstName: string;
		lastName: string;
		sex: string;
		contactNo: string;
		address: string;
		brgy: string;
	}				// for existing caregivers
		| { msg: string };


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
    brgy: number;
    occupation: string;
    relationship: string;
    communityGrp_id: number;
    income?: number;
};

/**
 * object type used to store information about a linked caregiver
 */
export type LinkedCaregiver = {
    // info about the search
    type: 'linked';
    firstName: string;
    lastName: string;
    contactNo: string;

    // info of a list of family members which are linked to the searched family member
    infoLinked: InfoLinked[];

};

/**
 * object type used to store information about the searched caregiver
 */
type InfoLinked = {
    caregiver_id: string;
    firstName: string;
    lastName: string;
    contactNo: string;
    relationship: string;
}

export type Caregiver =
    | NewCaregiver
    | LinkedCaregiver;