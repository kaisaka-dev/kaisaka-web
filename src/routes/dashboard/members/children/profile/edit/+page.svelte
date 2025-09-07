<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
    import Header from '$components/Header.svelte'
    import { goto } from '$app/navigation';
    import type { educationInformation, personalInformation, interventionInformation } from '../+page.server.js'
    import type { documentationInformation } from '../+page.server.js';

    import PersonalInformation from '../components/personalInformation.svelte'
	import FamilyInformation from '$components/shared/FamilyInformation.svelte';
    import EducationInformation from '../components/educationInformation.svelte';
	import DocumentationInformation from '../components/documentationInformation.svelte';
    import InterventionInformation from '../components/interventionInformation.svelte';
    import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';

    export let data;
    let loadingSave = false;
    let showSocialParticipation: boolean = false
    if(data.social_participation.length>0){
        showSocialParticipation = true
    }

    console.log("CHILD --> " , data.child)
    let showStatusInfo: boolean [] = [false,false,false,false]


    let newchildData: personalInformation = {
         firstName: data.child?.firstName || "--",
         middleName: data.child?.middleName || "--",
         lastName: data.child?.lastName || "--",
         birthday: data.child?.birthday || "--",
         sex: data.child?.sex || "--",
         address: data.child?.address || "--",
         barangay: data.child?.barangay || "--",
         canWork: data.child?.canWork || false,
         employmentType: data.child?.employmentType || "--",
         disabilityCategoryID: data.child?.disabilityCategory || "--",
         disabilityNature: data.child?.disabilityNature || "--",
         admissionDate:  data.child?.admissionDate.split('T')[0] || "--",
         remarks: data.child?.remarks || "--",
    }   

    let documentationData: documentationInformation = {
        hasPWD: data.child?.pwd?.has,
        pwdID: data.child?.pwd?.id,
        pwdExpiry: data.child?.pwd?.expiry,
        socialParticipation: data.social_participation,
        phHealth: data.child?.philHealth,
        natID: data.child?.national_id,
        medCert: data.child?.med_cert,
        barangayCert: data.child?.barangay_cert,
        birthCert: data.child?.birth_cert,
        voterID: data.child?.voter_id
    }


    let educHistory = []
    let displayEducHistory: educationInformation[] = []
    let displaySchoolYear: string[] = []
    let selectedIndex: number = 0

    for(let i = 0; i < data.child?.educationHistory?.length; i++){
        educHistory.push({
            Educationtype: data.child?.educationHistory[i]?.education_type,
            Educationlevel: data.child?.educationHistory[i]?.grade_level,
            Educationstatus: data.child?.educationHistory[i]?.student_status_type,
            yearStart: data.child?.educationHistory[i]?.year_start,
            yearEnd: data.child?.educationHistory[i]?.year_end,
            isNew:false,
            isDeleted: false
        })

        displayEducHistory.push({
            Educationtype: data.child?.educationHistory[i]?.education_type,
            Educationlevel: data.child?.educationHistory[i]?.grade_level,
            Educationstatus: data.child?.educationHistory[i]?.student_status_type,
            yearStart: data.child?.educationHistory[i]?.year_start,
            yearEnd: data.child?.educationHistory[i]?.year_end,
            isNew:false,
            isDeleted: false,
            index: i
        })

        displaySchoolYear.push(String(displayEducHistory[i].yearStart))
    }

    let educType: string = displayEducHistory[0]?.Educationtype
    let educStatus: string = displayEducHistory[0]?.Educationstatus
    let educLevel: string = displayEducHistory[0]?.Educationlevel
    let yearStart: number = displayEducHistory[0]?.yearStart
    let yearEnd: string = displayEducHistory[0]?.yearEnd    


    
   
    
    let healthIntervention : interventionInformation = {
        names: "",
        category: "Health",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    let educationIntervention: interventionInformation  = {
        names: "",
        category: "Education",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    let socialIntervention: interventionInformation  = {
        names: "",
        category: "Social",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    let livelihoodIntervention: interventionInformation  = {
        names: "",
        category: "Livelihood",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    
    
    for(let i = 0; i < data.interventioninfo?.length; i++){
        if(data.interventioninfo[i].service_category.name === "Health"){
           healthIntervention.creationDate = data.interventioninfo[i].date_created.split('T')[0]
           healthIntervention.names = data.interventioninfo[i].intervention
           healthIntervention.id = data.interventioninfo[i].id
           healthIntervention.overallStatus = data.interventioninfo[i].status
           healthIntervention.isNew = false

          healthIntervention.statuses = data.interventioninfo[i].history
          for(let j in healthIntervention.statuses){
            healthIntervention.statuses[j].isNew = false;
            healthIntervention.statuses[j].isDeleted = false
          }

        }

        else if(data.interventioninfo[i].service_category.name === "Education"){
           educationIntervention.creationDate = data.interventioninfo[i].date_created.split("T")[0]
           educationIntervention.names = data.interventioninfo[i].intervention
           educationIntervention.id = data.interventioninfo[i].id
           educationIntervention.overallStatus = data.interventioninfo[i].status
           educationIntervention.isNew = false

           educationIntervention.statuses = data.interventioninfo[i].history
           for(let j in educationIntervention.statuses){
            educationIntervention.statuses[j].isNew = false;
            educationIntervention.statuses[j].isDeleted = false
          }
        }

        else if(data.interventioninfo[i].service_category.name === "Livelihood"){
           livelihoodIntervention.creationDate = data.interventioninfo[i].date_created.split("T")[0]
           livelihoodIntervention.names = data.interventioninfo[i].intervention
           livelihoodIntervention.id = data.interventioninfo[i].id
           livelihoodIntervention.overallStatustatus = data.interventioninfo[i].status
           livelihoodIntervention.isNew = false

           livelihoodIntervention.statuses = data.interventioninfo[i].history
           for(let j in livelihoodIntervention.statuses){
            livelihoodIntervention.statuses[j].isNew = false;
            livelihoodIntervention.statuses[j].isDeleted = false
          }

        }

        else if(data.interventioninfo[i].service_category.name === "Social"){
           socialIntervention.creationDate = data.interventioninfo[i].date_created.split("T")[0]
           socialIntervention.names = data.interventioninfo[i].intervention
           socialIntervention.id = data.interventioninfo[i].id
           socialIntervention.overallStatus = data.interventioninfo[i].status
           socialIntervention.isNew = false

           socialIntervention.statuses = data.interventioninfo[i].history
           for(let j in socialIntervention.statuses){
            socialIntervention.statuses[j].isNew = false;
            socialIntervention.statuses[j].isDeleted = false
          }
        }
    }

    let childInterventions: interventionInformation[] = []
    childInterventions.push(healthIntervention, educationIntervention, socialIntervention, livelihoodIntervention)

    console.log(childInterventions)



    let errors = {
        firstName: "",
        lastName: "",
        birthday: "",
        sex: "",
        address:"",
        barangay:"",
        disabilityCat:"",
        disabilityNat: "",
        admissionDate: "",
        education:"",
        pwdID: "",
        pwdExpiry: "",
        socialParticipation: "",
        interventions: ["","","",""],
        interventionOverall:""
    }
  
    function validateForm(): boolean{
        let hasErrors = false
        //resets values that can be hidden
        errors.pwdID = ""
        errors.pwdExpiry = ""
        errors.education = ""
        for(let i in errors.interventions){
            errors.interventions[i] = ""
        }
        errors.interventionOverall = ""

        errors.firstName = newchildData.firstName.trim() === "" ? "Required" : ""
        errors.lastName = newchildData.lastName.trim() === "" ? "Required" : ""
        if(new Date(newchildData.birthday) > new Date()) {
            errors.birthday = "Birthday cannot be in the future"
        }
        else{
            errors.birthday = newchildData.birthday.trim() === "" ? "Required" : ""
        }

        errors.sex = newchildData.sex.trim() === "" ? "Required" : ""
        errors.address = newchildData.address.trim() === "" ? "Required" : ""
        errors.barangay = newchildData.barangay.trim() === "" ? "Required" : ""
        errors.disabilityCat = newchildData.disabilityCategoryID == null ? "Required" : ""
        errors.disabilityNat = newchildData.disabilityNature.trim() === "" ? "Required" : ""
          
        if(newchildData.admissionDate.trim() === ""){
            errors.admissionDate = "Required"
         }

        else if(new Date(newchildData.admissionDate) > new Date()){
            errors.admissionDate = "Date cannot be in the future"
        }
        
         else{
            errors.admissionDate = ""
         }



        if(displayEducHistory.length > 0) {
            for(let i in displayEducHistory) {
                if(displayEducHistory[i].Educationlevel === "" || displayEducHistory[i].Educationstatus === "" || displayEducHistory[i].Educationtype === ""
                    || displayEducHistory[i].yearEnd == null || displayEducHistory[i].yearStart == null) {
                        errors.education = "Missing Information!"
                    }
            }
 
        }

        if(documentationData.hasPWD == true) {
            errors.pwdID = documentationData.pwdID.trim() === "" ? "Required" : ""
            errors.pwdExpiry = documentationData.pwdExpiry.trim() === "" ? "Required" : ""
        }

        for(let i = 0; i < 4;i++) {
            //checks for the name related errors
            if(childInterventions[i].names === "" && (childInterventions[i].creationDate != null && childInterventions[i].overallStatus != null)) {
                errors.interventions[i] = "Missing Information!"
            }

            if(childInterventions[i].creationDate === "" && (childInterventions[i].names != "" && childInterventions[i].overallStatus != "")) {
                errors.interventions[i] = "Missing Information!"
            }

            if(childInterventions[i].creationDate === "" && (childInterventions[i].names != "" && childInterventions[i].overallStatus != "")) {
                errors.interventions[i] = "Missing Information!"
            }


            if(childInterventions[i].overallStatus === "" && (childInterventions[i].names != null && childInterventions[i].creationDate != null)) {
                errors.interventions[i] = "Missing Information!"
            }


             if(childInterventions[i].creationDate === "" && childInterventions[i].overallStatus === "" && childInterventions[i].names === ""){
                errors.interventions[i] = ""
            }

            if(errors.interventions[i] !== "") {
                errors.interventionOverall = "Missing Information"
            }

            for(let j = 0; j < childInterventions[i].statuses?.length; j++){
                console.log(childInterventions[i].statuses[j])
                if((childInterventions[i]?.statuses[j]?.status === "" || childInterventions[i]?.statuses[j]?.date_checked === '') && childInterventions[i].statuses[j].isDeleted === false){
                    errors.interventionOverall === "" ? errors.interventionOverall = "Missing Status Information!" : errors.interventionOverall += " and missing status information!"
                    console.log(errors.interventionOverall)
                }
            }
        }            

        if(data.social_participation.length > 0) {
            for(let i in data.social_participation) {
                if((data.social_participation[i].year == null || data.social_participation[i].year < 0 || data.social_participation[i].year > new Date().getFullYear()) && data.social_participation[i].isDeleted == false) {
                    errors.socialParticipation = "Invalid Date!"
                }
            }
        }
        
        for (let i of Object.values(errors)) {
            if(Array.isArray(i)) {
               for(let j = 0; j < i.length; j++) {
                 if(i[j] != "") {
                    hasErrors = true
                 }
               }
            }


           else if (i !== "") {
                hasErrors= true
            }
        }
        if(hasErrors){
            goto("#top")
            return false
        }
        return true
    }
    
        async function editData(): Promise<void> {
           if(validateForm()) {
             loadingSave = true;
            //PERSONAL INFORMATION EDITS BEGIN HERE
            const memberres = await fetch('/api/members', {
            method: "PUT",
            body: JSON.stringify({
                id: data.member?.id,
                first_name: newchildData.firstName,
                middle_name: newchildData.middleName,
                last_name: newchildData.lastName,
                birthday: newchildData.birthday,
                sex: newchildData.sex,
                admission_date: newchildData.admissionDate
            }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

           if(data.child?.addressid == "") { //creates new address if none exists
                const addressres = await fetch('/api/addresses' , {
                    method: "POST", 
                    body: JSON.stringify({
                        address: newchildData.address
                    }),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
                
                //gets the address
                const addressquery = await fetch(`/api/addresses?address=${newchildData.address}`)
                const addressrecord = await addressquery.json()

                const updateMember = await fetch("/api/members" , {
                    method: "PUT", 
                    body: JSON.stringify({
                        id: data.member?.id,
                        address_id: addressrecord.data[0].id
                    }),
                    headers: {'Content-Type':'application/json'}
                })
           }

           else if(data.child?.addressid !== "" && data.child?.address !== newchildData.address ){ //updates existing address
                const addressres = await fetch('/api/addresses' , {
                    method: "PUT",
                    body: JSON.stringify({
                        id: data.child?.addressid,
                        address: newchildData.address
                    }),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
           } 

           if(data.child?.barangayid === "" && newchildData.barangay !== ""){ //creates a new barangay
                const barangayres = await fetch("/api/barangays" , {
                    method: "POST",
                    body: JSON.stringify({
                        name: newchildData.barangay
                    }),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })

                const querybarangay = await fetch (`/api/barangays?name=${newchildData.barangay}`)
                const barangayRecord = await querybarangay.json() //gets the barangay record    

                const updateMember = await fetch("/api/members" , {
                    method: "PUT", 
                    body: JSON.stringify({
                        id: data.member?.id,
                        barangay_id: barangayRecord.data[0].id
                    }),
                    headers: {'Content-Type':'application/json'}
                } )
           }

           else{
                const barangayres = await fetch('/api/barangays', {
                method: "PUT",
                body: JSON.stringify({
                id: data.child?.barangayid,
                name: newchildData.barangay
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
                });
           }


            
            //This should happen if a persons record isnt found 
            const employmentRes = await fetch(`/api/employment_status?id=${data.member.id}`)
            const employmentRecord = await employmentRes.json()

            if(!employmentRes.ok && newchildData.canWork == true){

                if(newchildData.employmentType === "") {
                    const employmentstatusRes  = await fetch('/api/employment_status', {
                    method: "POST",
                    body: JSON.stringify({
                        able_to_work: newchildData.canWork,
                        employment_type: null,
                        member_id: data.member?.id
                    }),
                     headers: {
                    'Content-Type': 'application/json'
                }
                })
                }

                else {
                    const employmentstatusRes  = await fetch('/api/employment_status', {
                    method: "POST",
                    body: JSON.stringify({
                        able_to_work: newchildData.canWork,
                        employment_type: newchildData.employmentType,
                        member_id: data.member?.id
                    }),
                     headers: {
                    'Content-Type': 'application/json'
                }
                })   
                }
            }

            //if the persons record is found in the db, we just update
            else if(employmentRes.ok && newchildData.canWork == true){
                if(newchildData.employmentType === ''){
                    console.log("nulling")
                    const emplymentstatusRes = await fetch('/api/employment_status', {
                    method: "PUT",
                    body: JSON.stringify({
                        id: data.member?.id,
                        able_to_work: newchildData.canWork,
                        employment_type: null
                    }),
                     headers: {
                    'Content-Type': 'application/json'
                }
                })
                }

            
                else{
                    const emplymentstatusRes = await fetch('/api/employment_status', {
                    method: "PUT",
                    body: JSON.stringify({
                        id: data.member?.id,
                        able_to_work: newchildData.canWork,
                        employment_type: newchildData.employmentType
                    }),
                     headers: {
                    'Content-Type': 'application/json'
                }
                })
                }
               
            }

            //if the persons record is found in the db but we want to delete it 
            else if(employmentRes.ok && newchildData.canWork == false) {
                const deleteEmploymentRecord = await fetch(`/api/employment_status?member_id=${data.member?.id}`, {
                    method: 'DELETE'
                })
            }

            //EDUCATION RECORD UPDATES BEGIN HERE

            //goes through old history to determine if any existing records need to be deleted
            if(educHistory.length > 0) {
                for(let i = 0; i < educHistory?.length; i++){
                if(educHistory[i].isDeleted){
                 const deleteEducRecord = await fetch('/api/education_status', {
                 method: "DELETE",
                 body:JSON.stringify({
                     id: data.child?.educationHistory[i].id,
                     }),
                     headers:{
                         'Content-Type': 'application/json'
                     }
                 })
                }
                }
            }

            if(displayEducHistory.length > 0) {
            //Update and Post for the selected record
            for(let i in displayEducHistory){
                if(displayEducHistory[i].isNew == false) {
                const updateEducRecord = await fetch('/api/education_status', {
                method: "PUT",
                body:JSON.stringify({
                    id: data.child?.educationHistory[i]?.id,
                    education_type: educType,
                    student_status_type: educStatus,
                    grade_level: educLevel,
                    year_start: yearStart,
                    year_end: yearEnd
                }),
                headers:{
                         'Content-Type': 'application/json'
                     }
                })
            }

            else if(displayEducHistory[i].isNew == true) {
                const createEducRecord = await fetch('/api/education_status' , {
                    method: "POST",
                    body: JSON.stringify({
                        child_id: data.child?.id,
                        year_start: displayEducHistory[i].yearStart,
                        year_end: displayEducHistory[i].yearEnd,
                        education_type: displayEducHistory[i].Educationtype,
                        grade_level: displayEducHistory[i].Educationlevel,
                        student_status_type:displayEducHistory[i].Educationstatus 
                    }),
                     headers:{
                         'Content-Type': 'application/json'
                     } 
                })
            }
            }
            }

        //FAMILY UPDATES BEGIN HERE
        for(let i in data.family){
           if(data.family[i].isDeleted){
                const deleteFamilyMember = await fetch('/api/family_members',{
                    method: "DELETE",
                    body: JSON.stringify({
                        family_id: data.family[i].family_id,
                        member_id: data.family[i].members.id
                    }),
                    headers:{'Content-Type': "application/json"}
                })
           }
        }

        //DOCUMENT UPDATES BEGIN HERE
        if(data.child?.pwd?.has && documentationData.hasPWD ){ //just updates pwd info
            const updatePWDrecord = await fetch('/api/pwd_ids', {
               method: "PUT",
                body:JSON.stringify({
                    id: data.child.pwd.recordid,
                    pwd_id: documentationData.pwdID,
                    expiry_date: documentationData.pwdExpiry
                }),
                headers:{
                         'Content-Type': 'application/json'
                     } 
            })
        }

        else if(!data.child?.pwd?.has && documentationData.hasPWD){ //for when a new PWD record needs to be created
             const createPWDrecord = await fetch('/api/pwd_ids', {
               method: "POST",
                body:JSON.stringify({
                    pwd_id: documentationData.pwdID,
                    expiry_date: documentationData.pwdExpiry
                }),
                headers:{
                         'Content-Type': 'application/json'
                     } 
                })

                const getPWD = await fetch(`/api/pwd_ids?pwd_id=${documentationData.pwdID}`)
                let pwdRecord = await getPWD.json()

                const updateChild = await fetch('/api/children' , {
                    method: "PUT", 
                    body: JSON.stringify({
                        id: data.child?.id,
                        pwd_id: pwdRecord.data[0].id
                    })
                })
            }
        else if(data.child?.pwd.has && documentationData.hasPWD == false) {
                const deletePWDrecord = await fetch('/api/pwd_ids' , {
                method: "DELETE",
                body: JSON.stringify({
                    childID:data.child.id
                }),
                headers:{ 'Content-Type': 'application/json'}
            })
        }

        console.log(documentationData.phHealth)
          
        const childUpdate = await fetch('/api/children', {
            method: "PUT",
            body:JSON.stringify({
                id: data.child?.id,
                disability_id: newchildData.disabilityCategoryID,
                remarks:  newchildData.remarks,
                disability_nature: newchildData.disabilityNature,
                has_philhealth: documentationData.phHealth,
                has_birth_cert: documentationData.birthCert,
                has_medical_cert: documentationData.medCert,
                has_barangay_cert: documentationData.barangayCert,
                has_vote: documentationData.voterID,
                has_national_id: documentationData.natID
            }),
             headers:{
                         'Content-Type': 'application/json'
                     } 
        })

        if(!showSocialParticipation && data.social_participation.length > 0){
            const deleteAllSocialParticipation = await fetch(`/api/social_participation?child_id=${data.child.id}`, {
                method: "DELETE"
            })
        }

        else{
            for(let i in data.social_participation){
            //POST new social_participation data
            if(data.social_participation[i].isNew && !data.social_participation[i].isDeleted){
                const createSocialParticipation = await fetch(`/api/social_participation` , {
                    method:"POST",
                    body:JSON.stringify({
                        child_id: data.child?.id,
                        participation_type: data.social_participation[i].participation_type,
                        year: data.social_participation[i].year
                    }),
                    headers:{ "Content-type":"application/json"}
                })
            }

            //DELETE existing social_participation data
            else if(!data.social_participation[i].isNew && data.social_participation[i].isDeleted){
                const deleteSocialParticipation = await fetch(`/api/social_participation?id=${data.social_participation[i].id}` , {
                    method: "DELETE"
                })
            }
            //PUT existing social_participation data
            else if(!data.social_participation[i].isNew && !data.social_participation[i].isDeleted){
                const createSocialParticipation = await fetch(`/api/social_participation` , {
                    method:"PUT",
                    body:JSON.stringify({
                        id: data.social_participation[i].id,
                        participation_type: data.social_participation[i].participation_type,
                        year: data.social_participation[i].year
                    }),
                    headers:{ "Content-type":"application/json"}
                })
            }
        }
        }

        //INTERVENTION UPDATES BEGIN HERE
        for(let i = 0; i < childInterventions.length; i++) {
            if(childInterventions[i].isNew == true && childInterventions[i].names !== "" && childInterventions[i].isDeleted == false) { //for when interventions need to be created
                const createIntervention = await fetch('/api/intervention', {
                    method: "POST",
                    body: JSON.stringify({
                        child_id: data.child?.id,
                        intervention: childInterventions[i].names,
                        status: childInterventions[i].overallStatus,
                        service_category_name: childInterventions[i].category,
                        type: childInterventions[i].category
                    }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })

                const allinterventions = await fetch(`/api/intervention?id=${data.child.id}&type=serviceCategory&select=*,service_category(*)`)
                const newInterventionInfo = await allinterventions.json() //gets every intervention from the kid

                for(let j = 0; j < childInterventions[i].statuses?.length;j++) {
                    if(childInterventions[i].statuses[j].isDeleted == false){
                        const createStatus = await fetch('/api/intervention_history' , {
                        method: "POST",
                        body: JSON.stringify({
                            intervention_id: newInterventionInfo[newInterventionInfo.length-1].id,
                            improvement: new Date(),
                            status: childInterventions[i].statuses[j].status,
                            date_checked: childInterventions[i].statuses[j].date_checked
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })

                    }
                }
            }

            else if(childInterventions[i].isNew == false) { //for updating/deleting existing records
                if(childInterventions[i].isDeleted == false){

                    const interventionUpdate = await fetch('/api/intervention', { //updates the main record
                    method:'PUT',
                    body: JSON.stringify({
                    id: childInterventions[i].id,
                    intervention: childInterventions[i].names,
                    status: childInterventions[i].overallStatus,
                    date_created: childInterventions[i].creationDate
                    }),
                    headers:{
                         'Content-Type': 'application/json'
                        } 
                    })

                    for(let j in childInterventions[i].statuses){ //updates/deletes statuses
                        if(childInterventions[i].statuses[j].isDeleted == false && childInterventions[i].statuses[j].isNew == false){
                            const statusUpdate = await fetch('/api/intervention_history', {    
                            method: "PUT", 
                            body: JSON.stringify({
                            id: childInterventions[i].statuses[j].id,
                            intervention:{
                                status: childInterventions[i].statuses[j].status,
                                date_checked: childInterventions[i].statuses[j].date_checked
                            },
                        }),
                        headers:{
                        'Content-Type': 'application/json'
                                } 
                            })
                        }

                        else if(childInterventions[i].statuses[j].isNew == true && childInterventions[i].statuses[j].isDeleted == false){
                        const createStatus = await fetch('/api/intervention_history' , {
                        method: "POST",
                        body: JSON.stringify({
                            intervention_id: childInterventions[i].id,
                            improvement: new Date().toISOString(),
                            status: childInterventions[i].statuses[j].status,
                            date_checked: childInterventions[i].statuses[j].date_checked
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                        })
                    }

                        

                        else{
                            const deleteStatus = await fetch(`/api/intervention_history?id=${childInterventions[i].statuses[j].id}`, {
                                method: "DELETE"
                            });
                        }
                    }
                }

                else if(childInterventions[i].isDeleted == true){
                    for(let j = 0; j < childInterventions[i].statuses?.length; j++){ //deletes all records in intervention_history first
                        const deleteStatus = await fetch(`/api/intervention_history?id=${childInterventions[i].statuses[j].id}`, {
                            method: 'DELETE'
                        });
                    }

                    const deleteIntervention = await fetch(`/api/intervention?id=${childInterventions[i].id}`, {
                        method: "DELETE"
                    })
                }
            }   
        }
            
        goto(`/dashboard/members/children/profile?id=${data.child.id}`);
    }
     loadingSave = false;

}

function showStatusHistory(index:number){
    showStatusInfo[index] = !showStatusInfo[index]
    showStatusInfo = showStatusInfo
}
</script>
 <Header/>





<section>
    <h1>
     {data.child?.firstName ?? "First Name Missing!"} {data.child?.lastName ?? "Last Name Missing!"}'s Profile
    </h1>
</section>
{#if loadingSave}
  <LoadingBtn showBtn={false} />
{/if}
<div class = "flex flex-row ml-10 m-4 sticky top-20 ">
    <div class = "flex flex-col !font-[JSans]">
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#top">Information </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Family Info">Family </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Education Info">Education </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Documentation Info">Documents </a>
        </div>
        <div>
            <a class = "hover:!text-[var(--green)]" href = "#Intervention Info">Interventions </a>
        </div>
        <div>
          {#if loadingSave}
            <LoadingBtn label="Save Changes" btnClass="green w-40 -ml-5 mt-5" disableCover={false} />
          {:else}
            <button class = "green w-40 -ml-5 mt-5" on:click= {() => editData()}>
                Save Changes </button>
          {/if}
        </div>

        <div>
            <button class="w-40 -ml-5 mt-5" on:click={() => goto(`/dashboard/members/children/profile?id=${data.child.id}`)} >Cancel Changes</button>
        </div>
    </div>
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-5 -z-5000"></div>
</div>

<div class="ml-55 -mt-90">
  <!-- PERSONAL INFORMATION SECTION BELOW-->
   <PersonalInformation id ="Personal Info" disabled = {false} bind:data = {newchildData} bind:errors = {errors} discatOptions = {data.discatOptions} />
  <!-- PERSONAL INFORMATION SECTION END-->

  <!--BEGINNING OF DOCUMENTS LISTING-->
  <DocumentationInformation id="Documentation Info" bind:data = {documentationData} bind:socialParticipation = {data.social_participation} editing = {true} bind:errors = {errors} bind:showSocialParticipation = {showSocialParticipation}/>
  <!--END OF DOCUMENTS LISTING-->

  <!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
  <FamilyInformation id="Family Info" family={data.family.data && data.family.data.length > 0 ? [data.family] : []} firstName={data.child?.firstName} editing = {true} childID = {data.child.id} memberType="child"/>
  <!--END OF FAMILY AND MEMBERSHIP INFORMATION-->


  <!--CONTAINER FOR EDUCATION HISTORY-->
  <EducationInformation id="Education Info" bind:displayEducHistory = {displayEducHistory} bind:schoolYearArray = {displaySchoolYear} bind:educLevel = {educLevel} bind:educStatus = {educStatus} bind:educType = {educType}
   bind:yearStart = {yearStart} bind:yearEnd = {yearEnd} bind:errors = {errors} bind:selectedIndex = {selectedIndex} bind:educHistory = {educHistory}/>
  <!--END OF EDUCATION HISTORY -->


 <!--INTERVENTIONS LIST BEGINS HERE-->
    <InterventionInformation id = "Intervention Info" bind:data = {childInterventions} bind:errors = {errors}/>
 <!--END OF INTERVENTIONS-->
</div>
