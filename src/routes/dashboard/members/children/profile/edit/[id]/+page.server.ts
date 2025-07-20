export async function load({params, fetch}){
    const { id } = params;
    const memberRes = await fetch(`/api/members/${id}?select=*,addresses(*),children(*),employment_status(*)`);
    
    if (!memberRes.ok) {
        throw new Error('Failed to fetch member info');
    }

    const memberInfo = await memberRes.json();

    const childRes = await fetch(`/api/children/${id}?select=full-profile`)

     if (!childRes.ok) {
        throw new Error('Failed to fetch member info');
    }

    const childRecord = await childRes.json();
     
    //gets record in barangay table
    const barangayID = memberInfo.addresses.barangay_id;

    const barangayRes = await fetch(`/api/barangays?id=${barangayID}`)

    if (!barangayRes.ok) {
        throw new Error('Failed to fetch barangay info');
    }
    
    const barangayInfo = await barangayRes.json();
    
    //finds the family id of the record with the given member_id in the family table
    
    const familyRes = await fetch(`/api/family_members?id=${memberInfo.id}&select=*,families(*)&type=memberid`)
    if (!familyRes.ok) {
        throw new Error('Failed to fetch family member info');
    }
    
    const familyInfo = await familyRes.json()
    //console.log("Fam info: ", familyInfo)
    const familyID = familyInfo?.[0]?.family_id //this is what we'll use to actually find all the members of  the kid's family

    const entireFamilyRes = await fetch(`/api/family_members?id=${familyID}&select=*,members(*)&type=familyid`)

    if(!entireFamilyRes.ok){
        throw new Error('Failed to fetch family members');
    }

    const entireFamily = await entireFamilyRes.json()

    console.log("Member: ", memberInfo)
    console.log("childRecord: ", childRecord)
    console.log("barangay: ", barangayInfo)
    console.log("family: ", entireFamily)
    
    return {
        member: memberInfo,
        childRecord: childRecord,
        barangay: barangayInfo,
        family: entireFamily,
      };
}

