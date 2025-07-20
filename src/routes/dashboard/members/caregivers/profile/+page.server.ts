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