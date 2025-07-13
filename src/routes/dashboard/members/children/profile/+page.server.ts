import TableManager from '$lib/types/manager.js';
import type { L } from 'vitest/dist/chunks/reporters.d.C-cu31ET.js';
import Table from '../../../../../components/text/Table.svelte';

export async function load() {
//gets record in the member table
const members = TableManager('members');
const memberDB = new members();
const memberInfo = await memberDB.findOneWithJoin('*, children(*)', {
    eq: {first_name: "Mika" }
  });

const childID = memberInfo.children[0].id;
const addressID = memberInfo.address_id;

 
//gets record in the education table
const educ = TableManager('education_status');
const educDB = new educ();
const educInfo = await educDB.findOneWithJoin('*', {
    eq: {child_id: childID  }
}
);

//gets record in the address table
const addresses = TableManager('addresses');

const addressDB = new addresses();
const addressInfo = await addressDB.findOneWithJoin('*', {
    eq:{id: addressID}
});

const barangayID = addressInfo.barangay_id;

//gets record in barangay table
const barangay = TableManager('barangays');
const barangayDB = new barangay();
const barangayInfo = await barangayDB.findOneWithJoin('*', {
    eq:{id: barangayID}
})

//gets record in employment table
const employment = TableManager('employment_status');
const employmentDB = new employment();
const employmentInfo = await employmentDB.findOneWithJoin('*', {
    eq: {member_id: memberInfo.id }
})

//gets record in disability category table
const categoryDisability = TableManager('disability_category')
const categoryDisabilityDB = new categoryDisability();
const categoryDisabilityInfo = await categoryDisabilityDB.findOneWithJoin('*',{
    eq: {id: memberInfo.children[0].disability_id}
}
)

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

//gets social protection record
const spStatus = TableManager('social_protection_status');
const spDB = new spStatus();

const spInfo = await spDB.findOneWithJoin('*' , {
    eq:{child_id: childID}
});

return {
    member: memberInfo,
    education: educInfo,
    address: addressInfo,
    barangay: barangayInfo,
    employment: employmentInfo,
    disabilityCategory: categoryDisabilityInfo,
    family: entireFamily,
    socialProtection: spInfo
  };
}