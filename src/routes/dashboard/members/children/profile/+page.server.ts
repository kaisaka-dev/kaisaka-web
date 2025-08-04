let entireFamily = []
let pwdHas:boolean
let pwdID:string
let pwdExpiry:string




export async function load( { url, fetch}  ) {
    
try{
    //gets record in the child table
	const childID = url.searchParams.get('id');
    if (!childID) throw new Error("Missing child ID in query params");
    const childRecRes = await fetch(`/api/children/${childID}?select=full-profile`)

    if(!childRecRes.ok) { //null check for if the kid doesn't exist
        throw new Error('Failed to get Child!')
    }
    const childRecord = await childRecRes.json()

    //gets record in the member table
    const memberRecRes = await fetch(`/api/members/${childRecord.member_id}?select=*, addresses(*), employment_status(*)`)

    if(!memberRecRes.ok ){ //null check for if the member record doesn't exist
        throw new Error('Member Info doesn\'t exist!')
    }

    const memberRecord = await memberRecRes.json()

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

    // gets record in social protection table
    const socsecRes = await fetch(`/api/social_participation?child_id=${childRecord.id}`)
    let socsecRecord;

    if(socsecRes.ok)
    {
            socsecRecord = await socsecRes.json()
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
        disabilityCategoryID: childRecord.disability_category?.id || "",
        disabilityNature: childRecord.disability_nature || "",
        admissionDate: new Date(memberRecord.admission_date).toISOString().split('T')['0'] || "",
        educationHistory: educationArray,
        schoolYearArray: yearArray,
        pwd:{
            has: pwdHas,
            id: pwdID,
            expiry: pwdExpiry
        },

        philHealth: childRecord.has_philhealth,
        birth_cert: childRecord.has_birth_cert,
        national_id: childRecord.has_national_id,
        voter_id: childRecord.has_vote,
        med_cert: childRecord.has_medical_cert,
        barangay_cert: childRecord.has_barangay_cert
    }
    const familyRes = await fetch(`/api/family_members?id=${childRecord.member_id}&select=*,families(*)&type=memberid`)
    if (!familyRes.ok) {
        throw new Error('Failed to fetch family member info');
    }
    const familyInfo = await familyRes.json()

    if (!familyInfo || familyInfo.length === 0 || !familyInfo.data[0]?.family_id) {
        entireFamily = []
    } else {
        const familyID = familyInfo.data[0].family_id
        const entireFamilyRes = await fetch(`/api/family_members?id=${familyID}&select=*,members(*)&type=familyid`)
        
        if (!entireFamilyRes.ok) {
            throw new Error('Failed to fetch family members');
        }

        else{
            entireFamily = await entireFamilyRes.json()
        
            const caregiverQuery = await fetch('/api/caregivers')
            const caregiverTable = await caregiverQuery.json()


            for(let i in entireFamily.data){
                if(entireFamily.data[i].is_child == false){
                    for(let j in caregiverTable.data){
                        if(entireFamily.data[i].member_id == caregiverTable.data[j].member_id){
                            entireFamily.data[i]['linkID'] = caregiverTable.data[j].id
                            console.log(entireFamily.data[i].linkID)
                        }
                    }
                }
            }

        }
    }


    const interventionRes = await fetch(`/api/intervention?id=${childRecord.id}&select=*, service_category(*)&type=serviceCategory`)
    const interventioninfo = await interventionRes.json()

    if(interventioninfo){
        for(let i = 0; i < interventioninfo.length;i++){
           const interventionhistoryinfo = await fetch(`/api/intervention_history?id=${interventioninfo[i].id}&type=by_intervention`)
           interventioninfo[i]['history'] = await interventionhistoryinfo.json()
        }
    }

    /// fetching the (dropdown) options for disability category
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
        family: entireFamily.data,
        member: memberRecord,
        interventioninfo: interventioninfo || [],
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

//will be used to make data more acceptable for front end modules
export type childInformation =  {
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    birthday: string,
    sex: string,
    address: string,
    barangay: string,
    disabilityCategoryID: string,
    disabilityNature: string | null,
    canWork:boolean,
    employmentType: string,
    remarks:string,
    admissionDate: string,
    terminationDate?: string,
    educationHistory?: any[],
    schoolYearArray?: string[],
    pwd: {
        has: boolean,
        id: string,
        expiry: string
    },
    philHealth: boolean,
    national_id: boolean,
    med_cert: boolean,
    birth_cert: boolean,
    voter_id: boolean,
    barangay_cert: boolean
}

export type personalInformation = {
    firstName: string,
    middleName: string,
    lastName: string,
    birthday: string,
    sex: string,
    address: string,
    barangay: string,
    disabilityCategoryID: string,
    disabilityNature: string | null,
    canWork:boolean,
    employmentType: string,
    remarks:string,
    admissionDate: string,


}

export type documentationInformation = {
    hasPWD: boolean,
    pwdID: string,
    pwdExpiry: string,
    socialParticipation: [],
    phHealth: boolean,
    natID: boolean,
    medCert:boolean,
    birthCert:boolean,
    barangayCert:boolean,
    voterID: boolean
}

export type educationInformation = {
    Educationtype: string,
    Educationstatus: string,
    Educationlevel: string,
    yearStart: string,
    yearEnd: string,
    isNew: boolean,
    isDeleted: boolean
}

