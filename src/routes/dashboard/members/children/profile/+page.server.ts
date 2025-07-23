//will be used to make data more acceptable for front end modules
export type childInformation =  {
    id: string,
    firstName: string,
    lastName: string,
    birthday: string,
    sex: string,
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
    schoolYearArray?: string[]
}

type MemberRecord = {
    first_name?: string;
    middle_name?:string;
    last_name?: string;
    birthday?: string;
    sex?: string;
    addresses?: {
        address?: string;
    };
    employment_status?: {
        able_to_work?: boolean;
        employmentType?: string;
    };
    admission_date?: string;
    barangay_id: number;
};

type BarangayRecord = {
    name?: string;
};

type socsecRecord = {
    child_id:string,
    fam_year_accessed: number,
    participates_family_life: boolean,
    participates_community_club: boolean,
    comm_year_accessed: number
}

type ChildRecord = {
    id:string
    member_id: string;
    remarks?: string;
    disability_nature?: string;
    disability_category?: {
        name?: string;
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

let entireFamily = {}
let pwdHas:boolean
let pwdID:string
let pwdExpiry:string
let socsecHas: boolean
let socsecFamLife: boolean
let socsecFamYear: number
let socsecComLife: boolean
let socsecComYear: number


export async function load( { url, fetch}  ) {
    
try{
    //gets record in the child table
    const childID = url.searchParams.get('id');
    if (!childID) throw new Error("Missing child ID in query params");
    const childRecRes = await fetch(`/api/children/${childID}?select=full-profile`)

    if(!childRecRes.ok) { //null check for if the kid doesn't exist
        throw new Error('Failed to get Child!')
    }
    const childRecord : ChildRecord = await childRecRes.json()
    console.log('childRecord: ', childRecord)

    //gets record in the member table
    const memberRecRes = await fetch(`/api/members/${childRecord.member_id}?select=*, addresses(*), employment_status(*)`)

    if(!memberRecRes.ok ){ //null check for if the member record doesn't exist
        throw new Error('Member Info doesn\'t exist!')
    }

    const memberRecord : MemberRecord = await memberRecRes.json()
    console.log('memberRecord: ', memberRecord)

    //gets record in barangay table
    let barangayInfo = {}
    const barangayID = memberRecord?.barangay_id;

    if(barangayID != null){
        const barangayRes = await fetch(`/api/barangays?id=${barangayID}`)
        if (!barangayRes.ok) {
            throw new Error('Failed to fetch barangay info');
            
        }
        else{
            barangayInfo = await barangayRes.json();
        }
    }
    //console.log('brgy info: ', barangayInfo)
    
    //gets record in pwd table
    if(!childRecord.pwd_id) {
        pwdHas = false;
    }
    else {
        pwdHas = true;
        pwdID = childRecord.pwd_ids.pwd_id
        pwdExpiry = childRecord.pwd_ids.expiry_date   
    }

    //gets record in social protection table
    const socsecRes = await fetch(`/api/social_protection_status?id=${childRecord.id}`)

    const socsecRecord = await socsecRes.json()
    //console.log('social protection: ', socsecRecord)

    if(!socsecRecord){
        socsecHas = false;
        socsecComLife = false;
        socsecComYear = 0;
        socsecFamLife = false;
        socsecFamYear = 0;
    }

    else{
        socsecHas = true;
        socsecComLife = socsecRecord.participates_community_club
        socsecComYear = socsecRecord.comm_year_accessed
        socsecFamLife = socsecRecord.participates_family_life
        socsecFamYear = socsecRecord.fam_year_accessed
    }

    let educationArray = []
    let yearArray = []

    const educationRes = await fetch(`/api/education_status?id=${childRecord.id}`)
    
    const educationHistory = await educationRes.json()
    
    if(educationHistory){
        for(let i = 0; i < educationHistory.length;i++) {
            educationArray.push(educationHistory[i])
            yearArray.push(String(educationHistory[i].year_start))
        }
    }

    const child: childInformation = {
        id: childRecord.id,
        firstName: memberRecord?.first_name || "",
        middleName: memberRecord?.middle_name || "",
        lastName: memberRecord?.last_name  || "",
        birthday: memberRecord?.birthday || "",
        sex: memberRecord.sex || "",
        address: memberRecord.addresses?.address  || "",
        barangay: barangayInfo.data?.name || "",
        canWork: memberRecord.employment_status?.able_to_work  || false,
        employmentType: memberRecord.employment_status?.employment_type || "",
        remarks: childRecord.remarks || "",
        disabilityCategory: childRecord.disability_category?.name  || "",
        disabilityNature: childRecord.disability_nature || "",
        admissionDate: new Date(memberRecord.admission_date).toISOString().split('T')['0'] || "",
        philHealth: childRecord.has_philhealth || false,
        med_cert: childRecord.has_medical_cert || false,
        birth_cert: childRecord.has_birth_cert || false,
        barangay_cert: childRecord.has_barangay_cert || false,
        pwd:{
            has: pwdHas,
            id: pwdID  || "",
            expiry: pwdExpiry || ""
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
        schoolYearArray: yearArray
    }

    console.log("CHILD: " +child)
    const familyRes = await fetch(`/api/family_members?id=${childRecord.member_id}&select=*,families(*)&type=memberid`)
    if (!familyRes.ok) {
        throw new Error('Failed to fetch family member info');
    }
    const familyInfo = await familyRes.json()

    if (!familyInfo || familyInfo.length === 0 || !familyInfo[0]?.family_id) {
        entireFamily = {}
    } else {
        const familyID = familyInfo[0].family_id
        const entireFamilyRes = await fetch(`/api/family_members?id=${familyID}&select=*,members(*)&type=familyid`)
        
        if (!entireFamilyRes.ok) {
            throw new Error('Failed to fetch family members');
        }

        entireFamily = await entireFamilyRes.json()
    }


    const interventionRes = await fetch(`/api/intervention?id=${childRecord.id}&select=*, service_category(*)&type=serviceCategory`)
    const interventioninfo = await interventionRes.json()

    if(interventioninfo){
        for(let i = 0; i < interventioninfo.length;i++){
           const interventionhistoryinfo = await fetch(`/api/intervention_history?id=${interventioninfo[i].id}&type=by_intervention`)
           interventioninfo[i]['history'] = await interventionhistoryinfo.json()
        }
    }

    // console.log("Child: ", child)
    // console.log("family: ", entireFamily)
    // console.log("member: ", memberRecord)

    return{
        child: child,
        error: null,
        family: entireFamily,
        member: memberRecord,
        interventioninfo: interventioninfo || ''
    } 
}
    catch(error){
        return {
            error: error instanceof Error ? error.message : 'Failed to load children data',
        }
    }
}

