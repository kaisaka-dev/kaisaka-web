export async function load( {url, fetch} ) {
    //gets record in the member table
    const id = url.searchParams.get('id')
    if(!id) {
        throw new Error("Missing id")
    }
    const memberRes = await fetch(`/api/caregivers/${id}?select=*, members(*)`)

    if(!memberRes.ok){
        throw new Error('Failed to fetch member info');
    }

    const memberInfo = await memberRes.json()

    const memberRecRes = await fetch(`/api/members/${memberInfo.members.id}?select=*,addresses(*)`);
        
    if(!memberRecRes.ok){
        throw new Error('Failed to fetch member record info');
    }

    const memberRecord = await memberRecRes.json()
    console.log(memberRecord)

    //gets record in barangay table
    let barangayInfo = {}
    const barangayID = memberRecord?.addresses?.barangay_id;

    if(barangayID != null){
        const barangayRes = await fetch(`/api/barangays?id=${barangayID}`)
        if (!barangayRes.ok) {
            throw new Error('Failed to fetch barangay info');
            
        }
        else{
            barangayInfo = await barangayRes.json();
        }
    }

    //finds the family id of the record with the given member_id in the family table
    const familyRes = await fetch(`/api/family_members?id=${memberInfo.members.id}&select=*,families(*)&type=memberid`)
    if (!familyRes.ok) {
        throw new Error('Failed to fetch family member info');
    }
    
    const familyInfo = await familyRes.json()
    
    //console.log("Family Info:", familyInfo)

    let familyArray = [];

    for(let i in familyInfo) { //loop over every record, query the db for every family with the id, and add the members to an array

        let entireFamilyRes = await fetch(`/api/family_members?id=${familyInfo[i].family_id}&select=*,members(*)&type=familyid`)

        if(!entireFamilyRes.ok){
            throw new Error('Failed to fetch family members');
        }

        const entireFamily = await entireFamilyRes.json()

        familyArray.push(entireFamily)
    }


    return {
        member: memberInfo,
        memberRecord: memberRecord,
        barangay: barangayInfo,
        family: familyArray,
    };
}

export type Caregiver = {
	first_name: string;
	last_name: string;
	birthday: string | null;
	sex: string | null;
	contact_no: string;
	fb_link: string | null;
	email: string | null;
	address: string;
	barangay: string;
	occupation: string | null;
	date_admission: string;
	date_termination: string;
	family: Family[];
	community_history: Community[];
	income_history: Income[];
}

export type Community = {
	date_joined: string;
	date_left: string;
	name: string;
}

export type Income = {
	date_start: string;
	date_end: string;
	name: string;
}
export type Family = {
	firstName: string;
	lastName: string;
	role: string;
}