import type { ChildFormData } from '$lib/stores/childForm.js';
import type { CaregiverFormData } from '$lib/stores/caregiverForm.js';
import { caregiverFormData } from '$lib/stores/caregiverForm.js';
import type { tableRow } from '$lib/types/manager.js';
import type { Caregiver, NewCaregiver } from './family-info/caregiverFormTypes.js';
import { get } from 'svelte/store';

type FamilyRow = tableRow<"families">;
type FamMembersRow = tableRow<"family_members">;

async function safeFetch<T = any>(url: string, method: string, payload?: any): Promise<T> {
	const res = await fetch(url, {
		method: method,
		body: JSON.stringify(payload),
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Failed to ${method} ${url}: ${error}`);
	}
	return await res.json();
}

export async function submitChildRegData(childRegData: Partial<ChildFormData>): Promise<{ success: boolean; childId?: string }>{
	try {
		// Insert address
		const addressData = await safeFetch('/api/addresses', 'POST', childRegData.address);
		console.log(addressData.message)
		childRegData.member!.address_id = addressData.data.id;

		// Insert member
		const memberData = await safeFetch('/api/members', 'POST', childRegData.member);
		console.log(memberData.message)
		const memberId = memberData.data.id;

		var pwdId = null;

		//insert PWD ID
		if(childRegData.pwd_id !== undefined){
			const pwdIdData = await safeFetch('/api/pwd_ids', 'POST', childRegData.pwd_id);
			console.log(pwdIdData.message)
			pwdId = pwdIdData.data.id;
		}

		// Insert child info
		childRegData.child!.member_id = memberId;
		childRegData.child!.pwd_id = pwdId;
		const childData = await safeFetch('/api/children', 'POST', childRegData.child);
		console.log(childData.message)
		const childId = childData.data.id;

		// Insert education status
		childRegData.education_status!.child_id = childId;
		const eduStatusData = await safeFetch('/api/education_status', 'POST', childRegData.education_status);
		console.log(eduStatusData.message)

		// Insert social protection status
		childRegData.social_protection_status!.child_id = childId;
		const socProtStatusData = await safeFetch('/api/social_protection_status', 'POST', childRegData.social_protection_status);
		console.log(socProtStatusData.message)

		// Insert employment status
		childRegData.employment_status!.member_id = memberId;
		const empStatusData = await safeFetch('/api/employment_status', 'POST', childRegData.employment_status);
		console.log(empStatusData.message)
		
		console.log('All Child data successfully inserted!');

		return { success: true, childId };
	}
	catch (err){
		console.log("failed to submit child data.");
		throw err;
	}
}

function createCaregiverFormData(caregiver: NewCaregiver, childId: string): Partial<CaregiverFormData>{
	caregiverFormData.set({});
	caregiverFormData.update(current => ({
		...current,
		address: {
			barangay_id: caregiver.brgy,
			address: caregiver.address,
		},
		member: {
			first_name: caregiver.firstName,
			last_name: caregiver.lastName, 
			birthday: caregiver.bday.trim() !== '' ? caregiver.bday : null,
			sex: caregiver.sex,
		},
		/*
    relationship: string;
    communityGrp_id: number;
		 */
		caregiver: {
			contact_number: caregiver.contactNo,
			facebook_link: caregiver.fbLink,
			email: caregiver.email,
			occupation: caregiver.occupation,
			income_id: caregiver.income
		},
		relationCC: {
			child: childId,
			relationship: caregiver.relationship
		},
		//only if theres communityGrp_id
		...(caregiver.communityGrp_id !== -1
		? {
			caregiver_group: {
				community_group_id: caregiver.communityGrp_id,
			}
		}
		: {})
    }));

	return get(caregiverFormData)
}

export async function submitCaregivers(caregiversList: Caregiver[], childId: string): Promise<{ newCaregiverMemberIds: string[]; family_id: string }>{
	try{
		const newCaregiverMemberIds: string[] = [];
		const family_id: string = "";

		//1. Process Caregivers
		//For each caregiver in caregiversList: If type === 'new':
		for (const caregiver of caregiversList){
			if(caregiver.type === "new"){
				const newCaregiverData = createCaregiverFormData(caregiver, childId)
				console.log(newCaregiverData)

				//insert address data
				const addressData = await safeFetch('/api/addresses', 'POST', newCaregiverData.address);
				console.log(addressData.message)
				newCaregiverData.member!.address_id = addressData.data.id;

				//insert member data
				const memberData = await safeFetch('/api/members', 'POST', newCaregiverData.member);
				console.log(memberData.message)
				const memberId = memberData.data.id;

				//insert caregiver data
				newCaregiverData.caregiver!.member_id = memberId;
				const caregiverData = await safeFetch('/api/caregivers', 'POST', newCaregiverData.caregiver);
				console.log(caregiverData.message)
				const caregiverId = caregiverData.data.id;

				//insert caregiver_group data
				if(newCaregiverData.caregiver_group !== undefined){
					newCaregiverData.caregiver_group!.caregiver_id = caregiverId;
					const groupData = await safeFetch('/api/caregiver_groups', 'POST', newCaregiverData.caregiver_group);
					console.log(groupData.message)
				}

				//link child to caregiver
				newCaregiverData.relationCC!.caregiver = caregiverId;
				const relationCCData = await safeFetch('/api/relationship_cc', 'POST', newCaregiverData.relationCC)
				console.log(relationCCData.message)

				console.log('New caregiver data successfully inserted! id: ', caregiverId);
				
				//store new caregivers's ids
				newCaregiverMemberIds.push(memberId)
			}
			
			else if (caregiver.type === "linked"){
				//to be coded :p
				/*
				If type === 'linked' (already exists):
				take their existing family_id ONCE (assuming all linked caregivers are in the SAME family)
				GET their caregiver_ids and Insert relationships to childId (via relationship_cc)
				*/
				continue
			}
			else throw "caregiver neither new nor linked";
		}
		return { newCaregiverMemberIds, family_id }
	}
	catch (err) {
		console.log("failed to submit caregiver data.");
		throw err;
	}
}

//WIPPP WIP WIP
export async function addToFamily(newCaregiverMemberIds: string[],  childId: string, newFamilyId: string){
	try{
		// STEP 1: Fetch child data
		//get child's member ID
		let childData = await safeFetch(`/api/children/${childId}`, 'GET');
		const childMemberId = childData.member_id;
		//should query for child's already existing family_id (if it exists)
		//for now, set it to null. we need GET for this.
		let childExistingFamily = null;

		//STEP 2: Check if we need to create a new family
		if (!newFamilyId || newFamilyId.trim() === "") {
			const familyData = await safeFetch('/api/families', 'POST');
			console.log(familyData.message)
			newFamilyId = familyData.data.id;
		}

		// STEP 3: If child belongs to another family, remove old links (requires DELETE method)
		if (childExistingFamily && childExistingFamily !== newFamilyId) {
			/* Remove all old relationship_cc where child is involved
				await safeFetch(`/api/relationship_cc/child/${childId}`, 'DELETE');

				// Remove old family_members link for the child
				await safeFetch(`/api/family_members/member/${childMemberId}`, 'DELETE');

				console.log("Removed child from old family relationships.");
			*/
		}

		// STEP 4: Link child to the new/current family
		if (childExistingFamily !== newFamilyId) {
			const famMemberData = await safeFetch('/api/family_members', 'POST', {
				family_id: newFamilyId,
				member_id: childMemberId,
				is_child: true
			});
			console.log(famMemberData.message);
		}

		// STEP 5: Add caregivers to family
		for (const caregiverId of newCaregiverMemberIds) {
			const caregiverFamMember = await safeFetch('/api/family_members', 'POST', {
				family_id: newFamilyId,
				member_id: caregiverId,
				is_child: false
			});

			console.log(caregiverFamMember.message + ": " + `${caregiverId}`);
		}

		console.log("Finished updating family and relationships.");
		return true
	}
	catch (err) {
		console.log("failed to submit family data.");
		throw err;
	}
}

