import TableManager from '$lib/types/manager.js';

export async function load( {url} ) {
//gets record in the member table
const caregivers = TableManager('caregivers')
const caregiverDB = new caregivers()
const members = TableManager('members')
const memberDB = new members()


if(!url.searchParams.get('id')) {
    throw new Error("Missing id")
}

const memberInfo = await caregiverDB.findOneWithJoin('*, members(*)', {
    eq: {id: url.searchParams.get('id')}
});



const memberRecord = await memberDB.findOneWithJoin('*,addresses(*)', {
    eq:{id: memberInfo.members.id}
})

//gets record in barangay table
const barangayID = memberRecord.addresses.barangay_id;
const barangay = TableManager('barangays');
const barangayDB = new barangay();
const barangayInfo = await barangayDB.findOneWithJoin('*', {
    eq:{id: barangayID}
})


//finds the family id of the record with the given member_id in the family table
const family = TableManager('family_members');
const familyDB = new family();

const familyInfo = await familyDB.findWithJoin('*, families(*)', { //returns every record in the family table with this parent's id
    eq:{member_id: memberInfo.members.id }
});

let familyArray = [];

for(let i in familyInfo) { //loop over every record, query the db for every family with the id, and add the members to an array

    let entireFamily = await familyDB.findWithJoin('*,members(*)', {
    eq: {family_id: familyInfo[i].family_id}
    });

    familyArray.push(entireFamily)
}


return {
    member: memberInfo,
    memberRecord: memberRecord,
    barangay: barangayInfo,
    family: familyArray,
  };
}