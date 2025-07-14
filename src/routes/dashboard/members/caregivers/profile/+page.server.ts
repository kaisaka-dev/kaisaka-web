import TableManager from '$lib/types/manager.js';

export async function load() {
//gets record in the member table
const members = TableManager('members');
const memberDB = new members();
const memberInfo = await memberDB.findOneWithJoin('*, caregivers(*),addresses(*)', {
    eq: {first_name: "mom" }
});

//gets record in barangay table
const barangayID = memberInfo.addresses.barangay_id;
const barangay = TableManager('barangays');
const barangayDB = new barangay();
const barangayInfo = await barangayDB.findOneWithJoin('*', {
    eq:{id: barangayID}
})


//finds the family id of the record with the given member_id in the family table
const family = TableManager('family_members');
const familyDB = new family();

const familyInfo = await familyDB.findWithJoin('*, families(*)', { //returns every record in the family table with this parent's id
    eq:{member_id: memberInfo.id }
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
    barangay: barangayInfo,
    family: familyArray,
  };
}