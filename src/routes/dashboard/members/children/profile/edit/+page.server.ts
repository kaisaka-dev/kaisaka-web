import TableManager from '$lib/types/manager.js';
import { redirect } from '@sveltejs/kit';

//declarations for the different tables we'll be querying
const members = TableManager('members');
const memberDB = new members();

const barangay = TableManager('barangays');
const barangayDB = new barangay();


const children = TableManager('children');
const childrenDB = new children();

const family = TableManager('family_members');
const familyDB = new family();

const pwd = TableManager('pwd_ids');
const pwdDB = new pwd();

const socialSecurity = TableManager('social_protection_status');
const socsecDB = new socialSecurity();

const educationStatus = TableManager('education_status');
const educationDB = new educationStatus();

const intervention = TableManager('intervention');
const interventionDB = new intervention();

const interventionHistory = TableManager('intervention_history');
const interventionHistoryDB = new interventionHistory();

//will be used to make data more acceptable for front end modules
export type childInformation =  {
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    birthday: string,
    sex: string,
    addressid: string,
    barangayid: string,
    address: string,
    barangay: string,
    disabilityCategory: string,
    disabilityNature: string,
    canWork:boolean,
    employmentType: string,
    remarks:string,
    admissionDate: string,
    terminationDate?: string
    pwd?:{
        recordid: string,
        has:boolean
        id: string,
        expiry: string
    }

    socialProtection?:{
        has:boolean,
        fam_life: boolean,
        family_year: number,
        community_club: boolean,
        community_year:number

    }

    philHealth: boolean,
    birth_cert: boolean,
    med_cert:boolean,
    barangay_cert: boolean,
    voter_id: boolean,
    national_id:boolean
    educationHistory?: any[]
    disabilitycatID?: string
}

type MemberRecord = {
    id: string,
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    birthday?: string;
    sex?: string;
    address_id?: string;
    addresses?: {
        address?: string;
    };
    barangay_id: number;
    employment_status?: {
        able_to_work?: boolean;
        employmentType?: string;
    };
    admission_date?: string;
};

type BarangayRecord = {
    name?: string;
};



type ChildRecord = {
    id:string
    member_id: string;
    remarks?: string;
    disability_nature?: string;
    disability_category?: {
        id?: string,
        name?: string
    };

    pwd_id?: string;
    has_philhealth: boolean,
    has_birth_cert: boolean,
    has_medical_cert:boolean,
    has_barangay_cert: boolean,
    has_vote: boolean,
    has_national_id:boolean
};

type familyquery = {
    family_id: string
}


let entireFamily
let pwdrecordid: string
let pwdHas:boolean
let pwdID:string
let pwdExpiry:string
let socsecHas: boolean
let socsecFamLife: boolean
let socsecFamYear: number
let socsecComLife: boolean
let socsecComYear: number



export async function load( { url, fetch, locals }  ) {
    if (!locals.user) {
     throw redirect(303, '/');
    }
    
try{
    //gets record in the child table
    const childRecord = await childrenDB.findOneWithJoin('*, members(*), education_status(*),disability_category(*), pwd_ids(*)' , {
    eq:{id: url.searchParams.get('id')}
    }) as ChildRecord;



    if(!childRecord) { //null check for if the kid doesn't exist
        throw new Error('Failed to get Child!')
    }

    //gets record in the member table
    const memberRecord = await memberDB.findOneWithJoin('*, addresses(*), employment_status(*)', {
    eq: {id : childRecord.member_id}
    }) as MemberRecord;

    if(!memberRecord ){ //null check for if the member record doesn't exist
        throw new Error('Member Info doesn\'t exist!')
    }



    //gets record in barangay table
    const barangayID = memberRecord.barangay_id
    const barangayInfo = await barangayDB.findOneWithJoin('*', {
        eq:{id: barangayID}
    }) as BarangayRecord;

    
    //gets record in pwd table
    if(!childRecord.pwd_id) {
        pwdHas = false;
    }
    else {
        const pwdRecord = await pwdDB.findOneWithJoin("*", {
            eq:{id: childRecord.pwd_id}
        })

        if(pwdRecord){
            pwdHas = true;
            pwdID = pwdRecord.pwd_id
            pwdExpiry = pwdRecord.expiry_date
            pwdrecordid = pwdRecord.id

        }

        
        
        
    }

    //gets record in social protection table
    // gets record in social protection table
    const socsecRes = await fetch(`/api/social_participation?child_id=${childRecord.id}`)
    let socsecRecord;

    if(socsecRes.ok)
    {
            socsecRecord = await socsecRes.json()
            console.log('SOCIAL PROTECTION!!!: ', socsecRecord)
    }

    let educationArray = []

    const educationHistory = await educationDB.findWithJoin('*', {
        eq:{child_id: childRecord.id}
    })

    if(educationHistory){
        for(let i = 0; i < educationHistory.length;i++) {
            educationArray.push(educationHistory[i])
        }
    }
    

    let child: childInformation = {
        id: childRecord.id,
        disabilitycatID: childRecord.disability_category?.id,
        addressid: memberRecord.address_id || "",
        barangayid: barangayID || "",
        firstName: memberRecord.first_name || "",
        middleName: memberRecord.middle_name|| "",
        lastName: memberRecord.last_name  || "",
        birthday: memberRecord.birthday || "",
        sex: memberRecord.sex || "",
        address: memberRecord.addresses?.address  || "",
        barangay: barangayInfo?.name || "",
        canWork: memberRecord.employment_status?.able_to_work || false,
        employmentType: memberRecord.employment_status?.employment_type || "",
        remarks: childRecord.remarks || "",
        disabilityCategory: childRecord.disability_category?.id  || "",
        disabilityNature: childRecord.disability_nature || "",
        admissionDate: memberRecord.admission_date || "",
        philHealth: childRecord.has_philhealth || false,
        med_cert: childRecord.has_medical_cert || false,
        birth_cert: childRecord.has_birth_cert || false,
        barangay_cert: childRecord.has_barangay_cert || false,
        
        pwd:{
            recordid: pwdrecordid,
            has: pwdHas,
            id: pwdID,
            expiry: pwdExpiry
        },

        socialProtection:{
            has: socsecHas,
            community_club:socsecComLife,
            fam_life: socsecFamLife,
            family_year: socsecFamYear,
            community_year: socsecComYear
        },

        voter_id: childRecord.has_vote || false,
        national_id: childRecord.has_national_id || false,
        educationHistory: educationArray,
    }
    
    const familyInfo = await familyDB.findOneWithJoin('*, families(*)', {
    eq:{member_id: childRecord.member_id}
    }) as familyquery;


    if(!familyInfo) {
           entireFamily = {
        } 
    }
    
    else {
        //finds the family id of the record with the given member_id in the family table
        entireFamily = await familyDB.findWithJoin('*, members(*)', {
        eq: {family_id: familyInfo.family_id }
        })  
        
    }


    const interventioninfo = await interventionDB.findWithJoin('*, service_category(*)' , {
        eq:{child_id: childRecord.id}
    });

    if(interventioninfo){
        for(let i = 0; i < interventioninfo.length;i++){
           const interventionhistoryinfo = await interventionHistoryDB.findWithJoin('*',{
            eq: {intervention_id: interventioninfo[i].id}
            })

            interventioninfo[i]['history'] = interventionhistoryinfo
        }
    }

    // fetching the (dropdown) options for disability category
    let options_disCategory = [];

	try {
		const res = await fetch('/api/disability_category');
		if (!res.ok) throw new Error('Failed to fetch categories');
		const json = await res.json();
		options_disCategory = json.data; 
	    } catch (e) {
		console.error('Disability category fetch failed:', e);
		// optionally fallback to empty
		options_disCategory = [];
	}

    


    return{
        child: child,
        error: null,
        family: entireFamily,
        member: memberRecord,
        interventioninfo: interventioninfo || '',
        discatOptions: options_disCategory,
        social_participation: socsecRecord
    } 
}
    catch(error){
        return {
            error: error instanceof Error ? error.message : 'Failed to load children data',
        }
    }
}
