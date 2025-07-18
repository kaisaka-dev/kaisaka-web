import TableManager from '$lib/types/manager.js';

export async function load() {
//gets record in the member table
const members = TableManager('members');
const memberDB = new members();
const memberInfo = await memberDB.findOneWithJoin('*, addresses(*), children(*),employment_status(*)', {
    eq: {first_name: "Mika" }
  });


const children = TableManager('children');
const childrenDB = new children();
const childRecord = await childrenDB.findOneWithJoin('*, education_status(*),disability_category(*), social_protection_status(*), pwd_ids(*)' , {
    eq:{member_id: memberInfo.id}
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

const familyInfo = await familyDB.findOneWithJoin('*, families(*)', {
    eq:{member_id: memberInfo.id }
});

const familyID = familyInfo.family_id; //this is what we'll use to actually find all the members of  the kid's family

const entireFamily = await familyDB.findWithJoin('*, members(*)', {
    eq: {family_id: familyID}
});

return {
    member: memberInfo,
    childRecord: childRecord,
    barangay: barangayInfo,
    family: entireFamily,
  };
}