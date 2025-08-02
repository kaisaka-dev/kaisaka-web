<script lang="ts">
    import Header from '$components/Header.svelte'
    import Input from '$components/input/InputText.svelte'
    import Select from '$components/input/Select.svelte'
    import { goto } from '$app/navigation';
    import type { educationInformation, personalInformation } from '../+page.server.js'
    import type { documentationInformation } from '../+page.server.js';

    import PersonalInformation from '../components/personalInformation.svelte'
	import FamilyInformation from '../components/familyInformation.svelte';
    import EducationInformation from '../components/educationInformation.svelte';
	import DocumentationInformation from '../components/documentationInformation.svelte';

    export let data;

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
         admissionDate:  data.child?.admissionDate || "--",
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
    let yearEnd: number = displayEducHistory[0]?.yearEnd


    
    type interventions = {
        id?: string,
        name:string,
        servicecatID?: number,
        servicecat: string,
        dateCreated: string,
        status: string,
        isNew: boolean,
        isDeleted: boolean,
        history?:{
            status: string,
            id?: string,
            date:string,
            intervention_id?: string,
            isNew: boolean,
            isDeleted: boolean
        }[]
    }

    
    let healthIntervention : interventions = {
        name: "",
        servicecat: "Health",
        dateCreated: "",
        status: "",
        isNew: true,
        isDeleted: false,
        history: []
    }

    let educationIntervention: interventions  = {
        name: "",
        servicecat: "Education",
        dateCreated: "",
        status: "",
        isNew: true,
        isDeleted: false,
        history: []
    }

    let socialIntervention: interventions  = {
        name: "",
        servicecat: "Social",
        dateCreated: "",
        status: "",
        isNew: true,
        isDeleted: false,
        history: []
    }

    let livelihoodIntervention: interventions  = {
        name: "",
        servicecat: "Livelihood",
        dateCreated: "",
        status: "",
        isNew: true,
        isDeleted: false,
        history: []
    }
    
    for(let i = 0; i < data.interventioninfo?.length; i++){
        if(data.interventioninfo[i].service_category.name === "Health"){
           healthIntervention.dateCreated = data.interventioninfo[i].date_created.split("T")[0]
           healthIntervention.name = data.interventioninfo[i].intervention
           healthIntervention.id = data.interventioninfo[i].id
           healthIntervention.status = data.interventioninfo[i].status
           healthIntervention.isNew = false

           for(let j = 0; j < data.interventioninfo[i].history.length;j++){
                healthIntervention.history?.push({
                    status: data.interventioninfo[i].history[j].status,
                    date:  data.interventioninfo[i].history[j].date_checked,
                    isNew: false,
                    isDeleted: false,
                    id: data.interventioninfo[i].history[j].id,
                    intervention_id: data.interventioninfo[i].id
                })
            }

        }

        else if(data.interventioninfo[i].service_category.name === "Education"){
           educationIntervention.dateCreated = data.interventioninfo[i].date_created.split("T")[0]
           educationIntervention.name = data.interventioninfo[i].intervention
           educationIntervention.id = data.interventioninfo[i].id
           educationIntervention.status = data.interventioninfo[i].status
           educationIntervention.isNew = false

           for(let j = 0; j < data.interventioninfo[i].history.length;j++){
                educationIntervention.history?.push({
                    status: data.interventioninfo[i].history[j].status,
                    date:  data.interventioninfo[i].history[j].date_checked,
                    isNew: false,
                    isDeleted: false,
                    id: data.interventioninfo[i].history[j].id,
                    intervention_id: data.interventioninfo[i].id
                })
            }
        }

        else if(data.interventioninfo[i].service_category.name === "Livelihood"){
           livelihoodIntervention.dateCreated = data.interventioninfo[i].date_created.split("T")[0]
           livelihoodIntervention.name = data.interventioninfo[i].intervention
           livelihoodIntervention.id = data.interventioninfo[i].id
           livelihoodIntervention.status = data.interventioninfo[i].status
           livelihoodIntervention.isNew = false

           for(let j = 0; j < data.interventioninfo[i].history.length;j++){
                livelihoodIntervention.history?.push({
                    status: data.interventioninfo[i].history[j].status,
                    date:  data.interventioninfo[i].history[j].date_checked,
                    isNew: false,
                    isDeleted: false,
                    id: data.interventioninfo[i].history[j].id,
                    intervention_id: data.interventioninfo[i].id
                })
            }

        }

        else if(data.interventioninfo[i].service_category.name === "Social"){
           socialIntervention.dateCreated = data.interventioninfo[i].date_created.split("T")[0]
           socialIntervention.name = data.interventioninfo[i].intervention
           socialIntervention.id = data.interventioninfo[i].id
           socialIntervention.status = data.interventioninfo[i].status
           socialIntervention.isNew = false

           for(let j = 0; j < data.interventioninfo[i].history.length;j++){
                socialIntervention.history?.push({
                    status: data.interventioninfo[i].history[j].status,
                    date:  data.interventioninfo[i].history[j].date_checked,
                    isNew: false,
                    isDeleted: false,
                    id: data.interventioninfo[i].history[j].id,
                    intervention_id: data.interventioninfo[i].id
                })
            }

        }
    }

    let childInterventions: interventions[] = []
    childInterventions.push(healthIntervention, educationIntervention, socialIntervention, livelihoodIntervention)



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
        employmentType: "",
        educationtype: "",
        educationlvl: "",
        educstatus: "",
        yearstart: "",
        pwdID: "",
        pwdExpiry: "",
        healthIntervention: "",
        socialIntervention: "",
        livelihoodIntervention: "",
        educationIntervention: "",
        interventionnameErrors: ["","","",""],
        interventiondateErrors: ["","","",""],
        interventionstatusErrors: ["","","",""]
    }
  
    function validateForm(): boolean{
        let hasErrors = false
        //resets values that can be hidden
        errors.pwdID = ""
        errors.pwdExpiry = ""
        errors.educationtype = ""
        errors.educationlvl = ""
        errors.educstatus = ""


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
        if(newchildData.canWork){
            errors.employmentType = newchildData.employmentType.trim() === "--" ? "Required" : ""
         }

          
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
            errors.educationtype = educType.trim() === "" ? "Required" : ""
            errors.educationlvl = educLevel.trim() === "" ? "Required" : ""
            errors.educstatus = educStatus == null || educStatus === "" ? "Required" : ""
            errors.yearstart = yearStart == null ? "Required" : ""

            console.log(errors.educstatus)
        }

        if(documentationData.hasPWD == true) {
            errors.pwdID = documentationData.pwdID.trim() === "" ? "Required" : ""
            errors.pwdExpiry = documentationData.pwdExpiry.trim() === "" ? "Required" : ""
        }

        for(let i = 0; i < 4;i++) {
            //checks for the name related errors
            if(childInterventions[i].name == "" && (childInterventions[i].dateCreated != null && childInterventions[i].status != null)) {
                errors.interventionnameErrors[i] = "Required"
            }


            else{
                errors.interventionnameErrors[i] = ""
            }

            if(childInterventions[i].dateCreated == "" && (childInterventions[i].name != null && childInterventions[i].status != null)) {
                errors.interventiondateErrors[i] = "Required"
            }

            else{
                errors.interventiondateErrors[i] = ""
            }

            if(childInterventions[i].dateCreated == "" && (childInterventions[i].name != null && childInterventions[i].status != null)) {
                errors.interventiondateErrors[i] = "Required"
            }

            else{
                errors.interventiondateErrors[i] = ""
            }


            if(childInterventions[i].status == "" && (childInterventions[i].name != null && childInterventions[i].dateCreated != null)) {
                errors.interventionstatusErrors[i] = "Required"
            }

            else{
                errors.interventionstatusErrors[i] = ""
            }

            for(let j = 0; j < childInterventions[i].history?.length; j++){
                if(childInterventions[i]?.history[j]?.status == "" || childInterventions[i]?.history[j]?.date == ""){
                    childInterventions[i].status = ""
                    errors.interventionstatusErrors[i] = "Missing Status Information!"
                }
            }
           
            if(childInterventions[i].isDeleted == true){
                errors.interventionnameErrors[i] = ""
                errors.interventiondateErrors[i] = ""
                errors.interventionstatusErrors[i] = ""
            }

            else if(childInterventions[i].dateCreated == "" && childInterventions[i].status == "" && childInterventions[i].name == ""){
                errors.interventionnameErrors[i] = ""
                errors.interventiondateErrors[i] = ""
                errors.interventionstatusErrors[i] = ""
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

    
    function deleteIntervention(index:number) {
        childInterventions[index].isDeleted = true

        childInterventions[index].name = ""
        childInterventions[index].status = ""
        childInterventions[index].dateCreated = ""

        for(let i = 0; i < childInterventions[index].history.length;i++){
           deleteStatus(i, index)
        }   

        childInterventions = childInterventions
    }

    function deleteStatus(index:number, interventionIndex: number){
        childInterventions[interventionIndex].history[index].isDeleted = true
    }

    function addStatus( interventionIndex: number){
        childInterventions[interventionIndex].history?.push({
            status: "",
            date:"",
            isNew: true,
            isDeleted: false
        })

        childInterventions[interventionIndex].history = childInterventions[interventionIndex].history

    }

    
        async function editData(): Promise<void> {
           if(validateForm()) {
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
            if(!employmentRes.ok && newchildData.canWork == true){
                const emplymentstatusRes  = await fetch('/api/employment_status', {
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

            //if the persons record is found in the db, we just update
            else if(employmentRes.ok && newchildData.canWork == true){
               const emplymentstatusRes = await fetch('/api/employment_status', {
                    method: "PUT",
                    body: JSON.stringify({
                        member_id: data.member?.id,
                        able_to_work: newchildData.canWork,
                        employment_type: newchildData.employmentType
                    }),
                     headers: {
                    'Content-Type': 'application/json'
                }
                })
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
            if(displayEducHistory[selectedIndex].isNew == false) {
                const updateEducRecord = await fetch('/api/education_status', {
                method: "PUT",
                body:JSON.stringify({
                    id: data.child?.educationHistory[selectedIndex]?.id,
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

            else if(displayEducHistory[selectedIndex].isNew == true) {
                const createEducRecord = await fetch('/api/education_status' , {
                    method: "POST",
                    body: JSON.stringify({
                        child_id: data.child?.id,
                        year_start: yearStart,
                        year_end: yearEnd,
                        education_type: educType,
                        grade_level: educLevel,
                        student_status_type: educStatus 
                    })
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

        //INTERVENTION UPDATES BEGIN HERE
        for(let i = 0; i < childInterventions.length; i++) {
            if(childInterventions[i].isNew == true && childInterventions[i].name !== "" && childInterventions[i].isDeleted == false) { //for when interventions need to be created
                const createIntervention = await fetch('/api/intervention', {
                    method: "POST",
                    body: JSON.stringify({
                        child_id: data.child?.id,
                        intervention: childInterventions[i].name,
                        status: childInterventions[i].status,
                        service_category_name: childInterventions[i].servicecat,
                        type: childInterventions[i].servicecat
                    }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })

                const allinterventions = await fetch(`/api/intervention?id=${data.child.id}&type=serviceCategory&select=*,service_category(*)`)
                const newInterventionInfo = await allinterventions.json() //gets every intervention from the kid

                for(let j = 0; j < childInterventions[i].history?.length;j++) {
                    if(childInterventions[i].history[j].isDeleted == false){
                        const createStatus = await fetch('/api/intervention_history' , {
                        method: "POST",
                        body: JSON.stringify({
                            intervention_id: newInterventionInfo[newInterventionInfo.length-1].id,
                            improvement: new Date(),
                            status: childInterventions[i].history[j].status,
                            date_checked: childInterventions[i].history[j].date
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
                    intervention: childInterventions[i].name,
                    status: childInterventions[i].status,
                    date_created: childInterventions[i].dateCreated
                    }),
                    headers:{
                         'Content-Type': 'application/json'
                        } 
                    })

                    for(let j = 0; j < childInterventions[i].history?.length; j++){ //updates/deletes statuses
                        if(childInterventions[i].history[j].isDeleted == false){
                                const statusUpdate = await fetch('/api/intervention_history', {    
                        method: "PUT", 
                        body: JSON.stringify({
                        id: childInterventions[i].history[j].id,
                        intervention:{
                        status: childInterventions[i].history[j].status,
                        date_checked: childInterventions[i].history[j].date
                        },
                        }),
                        headers:{
                        'Content-Type': 'application/json'
                                } 
                            })
                        }

                        else{
                            const deleteStatus = await fetch(`/api/intervention_history?id=${childInterventions[i].history[j].id}`, {
                                method: "DELETE"
                            });
                        }
                    }
                }

                else if(childInterventions[i].isDeleted == true){
                    for(let j = 0; j < childInterventions[i].history?.length; j++){ //deletes all records in intervention_history first
                        const deleteStatus = await fetch(`/api/intervention_history?id=${childInterventions[i].history[j].id}`, {
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

}
</script>
 <Header/>





<section>
    <h1>
     {data.child?.firstName ?? "First Name Missing!"} {data.child?.lastName ?? "Last Name Missing!"}'s Profile 
    </h1>
</section>
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
            <button class = "green w-40 -ml-5 mt-5" on:click= {() => editData()}>
                Save Changes </button>
        </div>
        
        <div>
            <button class="w-40 -ml-5 mt-5" on:click={() => goto(`/dashboard/members/children/profile?id=${data.child.id}`)} >Back</button>
        </div>
    </div> 
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-5 -z-5000"></div>
</div>


<!-- PERSONAL INFORMATION SECTION BELOW-->
 <PersonalInformation disabled = {false} bind:data = {newchildData} bind:errors = {errors} discatOptions = {data.discatOptions} />
<!-- PERSONAL INFORMATION SECTION END-->


<!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
<FamilyInformation family = {data.family} firstName = {data.child?.firstName} editing = {true}/>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->


<!--CONTAINER FOR EDUCATION HISTORY-->
<EducationInformation bind:displayEducHistory = {displayEducHistory} bind:schoolYearArray = {displaySchoolYear} bind:educLevel = {educLevel} bind:educStatus = {educStatus} bind:educType = {educType} 
 bind:yearStart = {yearStart} bind:yearEnd = {yearEnd} bind:errors = {errors} bind:selectedIndex = {selectedIndex} bind:educHistory = {educHistory}/>
<!--END OF EDUCATION HISTORY -->

<!--BEGINNING OF DOCUMENTS LISTING-->
<DocumentationInformation bind:data = {documentationData} editing = {true} bind:errors = {errors}/>
<!--END OF DOCUMENTS LISTING-->

<!--INTERVENTIONS LIST BEGINS HERE-->
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Interventions
</h1>

<div class = "flex flex-col  max-w-250 mx-auto border-4 border-[var(--border)] ml-55 mr-10 p-4" id ="Intervention Info">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-col md:flex-row">
           <div class = "!text-[var(--background)] !font-bold mt-2">Service Category </div>
           <div class = "!text-[var(--background)] !font-bold md:ml-20 mt-2">Interventions Performed </div>
           <div class = "!text-[var(--background)] !font-bold md:ml-25 mt-2">Status History </div>
        </div>
        {#each childInterventions as interventionvar,index}
            <div class = "flex flex-col md:flex-row mt-5 ">
                <div class = "mt-4.5 -mr-15 max-w-20 md:max-w-50">
                    <Input type = "text" disabled bind:value = {interventionvar.servicecat}/>
                </div>
                <div class = "mb-10 mt-4 md:ml-35 max-w-50">
                   <Input type = "text" bind:value = {interventionvar.name} required msg = {errors.interventionnameErrors[index]}/>
                </div>
                <div class =  "collapse">
                <input type = "checkbox" />
                    <div class = "collapse-title flex flex-row">
                        <div class = " z-5000 max-w-30 md:ml-5">
                           <Select  required msg = {errors.interventionstatusErrors[index]} bind:value = {interventionvar.status} options = {["Regressed" , "Improved", "Neutral"]} />
                        </div> 
                        <div class = "max-w-10 md:ml-5 z-5000"><Input type = "date" bind:value = {interventionvar.dateCreated} required msg = {errors.interventiondateErrors[index]} /></div>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        <div class = "flex flex-col">
                        {#each interventionvar.history as status, statusindex}
                        {#if status.isDeleted == false}
                            <div class= "flex flex-row w-100">
                                <div class = " z-5000 w-30  md:ml-5">
                                <Select bind:value = {status.status} options = {["Regressed" , "Improved" , "Neutral"]} />
                                </div> 
                                <div class ="w-15 ml-5">  <Input type = "Date" bind:value = {status.date}/></div>
                                <div class = "-mt-2.5 md:ml-20">
                                <button class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                                on:click = {()=>deleteStatus(statusindex, index)}>
                                    X
                                </button>
                                </div>
                            </div>
                        {/if}
                        {/each}
                        <button on:click = {() => addStatus(index)} class = "green w-50 ml-15 mt-5"> Add Status</button>
                        </div>
                    </div>
                </div>
                <div class = "mt-1.5 z-500">
                <button
                        class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                        on:click = {()=>deleteIntervention(index)}>
                        X
                </button>
                </div>
            </div>
        {/each}
    </div>
    
</div>


<!--END OF INTERVENTIONS-->