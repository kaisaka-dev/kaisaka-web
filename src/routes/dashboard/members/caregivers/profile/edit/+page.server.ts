export async function load( {url, fetch} ) {
    //gets record in the member table
    const id = url.searchParams.get('id')
    if(!id) {
        throw new Error("Missing id")
    }
    const caregiverRes = await fetch(`/api/caregivers/${id}?select=*, members(*)`)

    if(!caregiverRes.ok){
        throw new Error('Failed to fetch member info');
    }

    const caregiverInfo = await caregiverRes.json()

    const memberRecRes = await fetch(`/api/members/${caregiverInfo.members.id}?select=*,addresses(*),barangays(*)`);
        
    if(!memberRecRes.ok){
        throw new Error('Failed to fetch member record info');
    }

    const memberRecord = await memberRecRes.json()

    //finds the family id of the record with the given member_id in the family table
    const familyRes = await fetch(`/api/family_members?id=${memberRecord.id}&select=*,families(*)&type=memberid`)
    if (!familyRes.ok) {
        throw new Error('Failed to fetch family member info');
    }
    
    const familyInfo = await familyRes.json()
    let familyArray = [];

    for(let i in familyInfo.data) { //loop over every record, query the db for every family with the id, and add the members to an array

        let entireFamilyRes = await fetch(`/api/family_members?id=${familyInfo.data[i].family_id}&select=*,members(*)&type=familyid`)

        if(!entireFamilyRes.ok){
            throw new Error('Failed to fetch family members');
        }

        const entireFamily = await entireFamilyRes.json()

        familyArray.push(entireFamily)
    }

     const communityres = await fetch(`/api/caregiver_groups?caregiver_id=${caregiverInfo.id}`)
    let communityHistory = []

    if(communityres.ok){
        const communityInfo = await communityres.json()
        
        for(let i in communityInfo){
            communityHistory.push(communityInfo[i])
        }
    }

    communityHistory = communityHistory.flat()
    console.log(communityHistory)

    for(let i in communityHistory) {
        const communityTyperes = await fetch(`/api/community_group_type?id=${communityHistory[i].community_group_id}`)
        if(communityTyperes.ok){
            const communitytypeRecord = await communityTyperes.json()
            communityHistory[i]['name'] = communitytypeRecord.data.name
            communityHistory[i]['isDeleted'] = false
            communityHistory[i]['isNew'] = false
        }
    }






    const incomeres = await fetch(`/api/income_type?caregiver_id=${caregiverInfo.id}`)
    let incomeHistory = []

    if(incomeres.ok){
        const incomeInfo = await incomeres.json()
        for(let i in incomeInfo) {
            incomeHistory.push(incomeInfo[i])
        }
    }
    
    
    let caregiver: Caregiver = {
        id: id,
        first_name:  memberRecord.first_name,
        last_name: memberRecord. last_name,
        birthday: memberRecord.birthday,
        sex: memberRecord.sex,
        contact_no: caregiverInfo.contact_number,
        fb_link: caregiverInfo.facebook_link,
        email: caregiverInfo.email,
        address: memberRecord.addresses.address,
        barangay: memberRecord.barangays?.name,
        occupation: caregiverInfo.occupation,
        date_admission: memberRecord.admission_date.split('T')[0],
        date_termination: memberRecord.date_termination,
        family: familyArray,
        community_history: communityHistory,
        income_history: incomeHistory
    }


    return {
        caregiver: caregiver,
        memberRecord: memberRecord,
    };
}

export type Caregiver = {
    id: string,
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
	family: Family[] | null;
	community_history: Community[] | null;
	income_history: Income[] | null;
}

export type Community = {
	id: number;
	date_joined: string;
	date_left: string;
	name: string;
}

export type Income = {
	id: number;
	date_start: string;
	date_end: string;
	name: string;
}
export type Family = {
	firstName: string;
	lastName: string;
	role: string;
}