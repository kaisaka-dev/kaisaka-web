<script lang="ts">
    import Header from '$components/Header.svelte'
    import Input from '$components/input/InputText.svelte'
    import TextArea from '$components/input/InputTextarea.svelte'
    import Check from '$components/input/Checkbox.svelte'
    import Select from '$components/input/Select.svelte'
    import { goto } from '$app/navigation';
	

    export let data;


    let firstName: string = data.child?.firstName || "Name Must Be Assigned"
    let middleName: string = data.child?.middleName || "No Middle Name"
    let lastName: string = data.child?.lastName || "Last Name Must Be Assigned"
    let birthday: string = data.child?.birthday || new Date().toISOString().split('T')[0]
    let sex: string = data.child?.sex || ""
    let address: string = data.child?.address || "" 
    let barangay: string = data.child?.barangay || "" 
    let canwork: boolean = data.child?.canWork || false
    let employmentType: string = data.child?.employmentType || ""
    let disabilityCategory: string = data.child?.disabilityCategory || ""
    let disabilityNature: string = data.child?.disabilityNature || ""
    let admissionDate: string = data.child?.admissionDate
    let remarks: string = data.child?.remarks || ""

    let educType: string = "N/A"
    let educStatus: string = "N/A"
    let educLevel: string = "N/A"
    let yearStart: number 
    let yearEnd: number 

    let existingFamily: {
        firstName: string,
        lastName:string,
        is_child: string,
        relationship: string,
        isNew: boolean, //determines if object needs to be added
        isDeleted: boolean //determines what records need to be deleted
    }[] = []

    let count: number = data.family?.length || 0

    for(let i = 0; i <count; i++) {
        let iskid = "No"
         if(data.family[i]?.is_child){
                iskid ="Yes"
        }

        existingFamily.push({
            firstName: data.family[i]?.members?.first_name,
            lastName: data.family[i]?.members?.last_name,
            is_child: iskid,
            relationship: data.family[i]?.relationship_type,
            isNew: false,
            isDeleted: false
        })

    }

    let educHistory: {
        Educationtype: string,
        Educationlevel: string,
        Educationstatus: string,
        yearStart: number,
        yearEnd: number,
        isNew: boolean,
        isDeleted: boolean,
    }[] = []

    let selectedIndex: number

    for(let i = 0; i < data.child?.educationHistory.length; i++){
        educHistory.push({
            Educationtype: data.child.educationHistory[i]?.education_type,
            Educationlevel: data.child.educationHistory[i]?.grade_level,
            Educationstatus: data.child.educationHistory[i]?.student_status_type,
            yearStart: data.child?.educationHistory[i]?.year_start,
            yearEnd: data.child?.educationHistory[i]?.year_end,
            isNew:false,
            isDeleted: false

        })
    }

    let hasPWD: boolean = data.child?.pwd?.has;
    let pwdID: string = data.child?.pwd?.id;
    let pwdExpiry: string = data.child?.pwd?.expiry;
    
    let socialProtectionhas: boolean = data.child?.socialProtection?.has
    let socialProtectionFam: boolean = data.child?.socialProtection?.fam_life
    let socialProtectionFamYear: number = data.child?.socialProtection?.family_year
    let socialProtectionCom: boolean = data.child?.socialProtection?.community_club
    let socialProtectionComYear: number = data.child?.socialProtection?.community_year

    let hasPHhealth: boolean = data.child?.philHealth
    let natID: boolean = data.child?.national_id
    let medCert: boolean = data.child?.med_cert
    let birthCert: boolean = data.child?.birth_cert
    let barangayCert: boolean = data.child?.barangay_cert
    let voterID: boolean = data.child?.voter_id

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

    
    const options_disNature = [
    "Deaf/Hard of Hearing",
    "Intellectual Disability",
    "Learning Disability",
    "Mental Disability",
    "Physical Disability",
    "Psychosocial Disability",
    "Speech and Language Impairment",
    "Visual Disability",
    "Cancer",
    "Rare Disease (RA10747)",
    "Multiple Disability",
    ];

    const educ_options = [
        "",
        'Inclusive',
        'Special',
        'Nonformal',
        'Integrated'
    ]

    const student_options = [
        "",
        'past_student',
        'enrolled',
        'dropped_out',
        'completed'
    ]

    //below are functions needed for the page

    //TODO: IMPLEMENT VALIDATION CHECKING
    function addFamily(){
        existingFamily.push({
            firstName:"",
            lastName:"",
            relationship: "",
            is_child:"",
            isDeleted: false,
            isNew: true,
        })

        existingFamily = existingFamily
    }

    function deleteFamily(index:number){
        existingFamily[index].isDeleted = true
        existingFamily = existingFamily
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


    function addEducRecord(){
        educHistory.push({
             Educationtype: "",
             Educationlevel: "",
             Educationstatus: "",
             yearStart: new Date().getFullYear(),
             yearEnd: new Date().getFullYear(),
             isNew:true,
             isDeleted: false
        })

        data.child.schoolYearArray?.push(String(educHistory[educHistory.length-1].yearStart))
        data.child.schoolYearArray = data.child?.schoolYearArray

        educHistory = educHistory
    }

    function deleteEducRecord(index:number){
        educHistory[index].isDeleted = true
        educHistory = educHistory
        updateField(0)
    }

    function updateField(index:number){     
        if(index == 0) {
            educType = ""
            educLevel = ""
            educStatus = ""
            yearStart =0 ;
            yearEnd =0 ;
        }

        else {
            educType = educHistory[index-1].Educationtype
            educLevel = educHistory[index-1].Educationlevel
            educStatus = educHistory[index-1].Educationstatus
            yearStart = educHistory[index-1].yearStart
            yearEnd = educHistory[index-1].yearEnd

        }

        selectedIndex = index-1
    }
        async function editData(): Promise<void> {

            //PERSONAL INFORMATION EDITS BEGIN HERE
            const memberres = await fetch('/api/members', {
            method: "PUT",
            body: JSON.stringify({
                id: data.member.id,
                first_name: firstName,
                last_name: lastName,
                birthday: birthday,
                sex: sex,
                admission_date: admissionDate
            }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

           if(data.child?.addressid == "") { //creates new address if none exists
                const addressres = await fetch('/api/addresses' , {
                    method: "POST", 
                    body: JSON.stringify({
                        address: address
                    }),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
           }

           else if(data.child?.addressid !== "" && data.child?.address !== address ){ //updates existing address
            console.log(data.child?.addressid)
                const addressres = await fetch('/api/addresses' , {
                    method: "PUT",
                    body: JSON.stringify({
                        id: data.child?.addressid,
                        address: address
                    }),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
           } 

           if(data.child?.barangayid === ""){ //creates a new barangay
                const barangayres = await fetch("/api/barangays" , {
                    method: "POST",
                    body: JSON.stringify({
                        name: barangay
                    }),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
           }


            // const barangayres = await fetch('/api/barangays', {
            // method: "PUT",
            // body: JSON.stringify({
            //     id: data.child?.barangayid,
            //     name: barangay
            // }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            //This should happen if a persons record isnt found 
            const employmentRes = await fetch(`/api/employment_status?id=${data.member.id}`)


            if(!employmentRes.ok && canwork == true){
               console.log(await fetch('/api/employment_status', {
                    method: "POST",
                    body: JSON.stringify({
                        able_to_work: canwork,
                        employment_type: employmentType,
                        member_id: data.member?.id
                    }),
                     headers: {
                    'Content-Type': 'application/json'
                }
                }))   
            }

            //if the persons record is found in the db, we just update
            else if(employmentRes && canwork == true){
               console.log(await fetch('/api/employment_status', {
                    method: "PUT",
                    body: JSON.stringify({
                        member_id: data.member?.id,
                        able_to_work: canwork,
                        employment_type: employmentType
                    }),
                     headers: {
                    'Content-Type': 'application/json'
                }
                }))
            }

            //if the persons record is found in the db but we want to delete it NEEDS IMPLEMENTATION
            // else if(employmentRes && canwork == false){

            // }

            const disabilityCategoryres = await fetch('/api/disability_category', {
                method:"PUT",
                body:JSON.stringify({
                    id: data.child?.disabilitycatID,
                    name:disabilityCategory
                }),
                 headers: {
                    'Content-Type': 'application/json'
                }
            })

            //FAMILY EDITS BEGIN HERE
            //checks each record for updates
            for(let i = 0; i < existingFamily.length;i++)
            {
                    let ischild: boolean = false
                    if(existingFamily[i].is_child === "Yes"){
                        ischild = true
                    }

                    const updateFamMember = await fetch('/api/family_members', {
                        method:'PUT',
                        body: JSON.stringify({
                            family_id: data.family[i]?.family_id,
                            member_id: data.family[i]?.member_id,
                            relationship_type: existingFamily[i].relationship,
                            is_child: ischild
                        }),
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    })

                    const updateMember = await fetch('/api/members' , {
                        method: "PUT",
                        body:JSON.stringify({
                            id: data.family[i].members.id,
                            first_name: existingFamily[i].firstName,
                            last_name: existingFamily[i].lastName
                        }),
                         headers:{
                            'Content-Type': 'application/json'
                        }
                    })
                    
                    //TODO: implement POST, DELETE 
            }

            //EDUCATION RECORD UPDATES BEGIN HERE
            for(let i = 0; i < educHistory.length; i++){
                if(educHistory[i].isNew && !educHistory[i].isDeleted){
                const createeducRecord = await fetch('/api/education_status', {
                method: "POST",
                body:JSON.stringify({
                    child_id: data.child.id,
                    education_type: educType,
                    education_status: educStatus,
                    grade_level: educLevel,
                    year_start: yearStart,
                    year_end:yearEnd
                    }),
                    headers:{
                            'Content-Type': 'application/json'
                    }
                })
                }

                 else if(educHistory[i].isDeleted && !educHistory[i].isNew){
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
            
                const updateEducRecord = await fetch('/api/education_status', {
                method: "PUT",
                body:JSON.stringify({
                    id: data.child.educationHistory[selectedIndex]?.id,
                    education_type: educType,
                    education_status: educStatus,
                    grade_level: educLevel,
                    year_start: yearStart,
                    year_end:yearEnd
                }),
                headers:{
                         'Content-Type': 'application/json'
                     }
            })


        //DOCUMENT UPDATES BEGIN HERE
        if(data.child?.pwd?.has && hasPWD ){ //just updates pwd info
            const updatePWDrecord = await fetch('/api/pwd_ids', {
               method: "PUT",
                body:JSON.stringify({
                    id: data.child.pwd.recordid,
                    pwd_id: pwdID,
                    expiry_date:pwdExpiry
                }),
                headers:{
                         'Content-Type': 'application/json'
                     } 
            })
        }

        else if(!data.child?.pwd?.has && hasPWD){ //for when a new PWD record needs to be created
             const createPWDrecord = await fetch('/api/pwd_ids', {
               method: "POST",
                body:JSON.stringify({
                    pwd_id: pwdID,
                    expiry_date:pwdExpiry
                }),
                headers:{
                         'Content-Type': 'application/json'
                     } 
                })
        }
        
        // else if(data.child?.pwd?.has && !hasPWD){ //for when a PWD record needs to be deleted
        //     const deletePWDrecord = await fetch('/api/pwd_ids' , {
        //         method: "DELETE",
        //         body: JSON.stringify({

        //         })
        //     })
        // }

        
        const documentationUpdate = await fetch('/api/children', {
            method: "PUT",
            body:JSON.stringify({
                id: data.child?.id,
                remarks:  remarks,
                disability_nature: disabilityNature,
                has_philhealth: hasPHhealth,
                has_birth_cert: birthCert,
                has_medical_cert: medCert,
                has_barangay_cert: barangayCert,
                has_vote: voterID,
                has_national_id: natID
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
 <div class = "ml-22 -mt-70" id ="Personal Info">
    <h1 class = "!text-[var(--green)] font-[JSans] ml-33 mt-5 mb-2">
        Information
    </h1>
</div>
<div class = "border-[var(--border)] border-4 ml-55 mr-10 !font-bold w-250 min-w-225" >
    <div class = "!flex !flex-row !justify-start mt-2">
        <div class = "flex flex-col ml-4 mt-2 w-[1200px]">
          <Input label="First Name" id="first_name"  bind:value = {firstName} margin={false} />
          <Input label="Middle Name" id="middle_name"   bind:value = {middleName} margin={false} />
          <Input label="Last Name" id="last_name"   bind:value = {lastName} margin={false} />
          <Input label="Birthday" type="date" id="birthday" bind:value = {birthday}  margin={false} />
          <Input label="Age" id ="age" disabled value = {new Date().getFullYear() - new Date(birthday).getFullYear() || "Please Specify Birthday!"} margin={false} />
          <Select label="Sex" id="sex" bind:value = {sex} options = {['Male','Female','Other']}  margin={false} />
          <Input  label="Address" id="address"  bind:value = {address} margin={false} />
          <Input  label="Barangay" id="barangay"  bind:value = {barangay} margin={false} />
          <br>
          <Select label="Disability Category" id="disabilityCategory" bind:value = {disabilityCategory} options = {options_disNature} margin={false} />
          <Input  label="Disability Nature" id="disabilityNature"  bind:value = {disabilityNature} margin={false} />
          <br>
          <Check  label="Able to work" bind:checked={canwork} margin={false} />
          {#if canwork}
          <Select label="Employment Type" id="employment_type" bind:value = {employmentType} options = {['Wage Employed', "Self-Employed", "Sheltered Workshop"]} margin={false}  />
          <br>
          {/if}
          <Input label="Admission Date" type="date"  bind:value = {admissionDate} margin={false} />
        </div>
      <div style="height: fit-content">
        <TextArea bind:value = {remarks} label="Remarks" rows={10}  margin={false} /></div>

    </div>
</div>
<!-- PERSONAL INFORMATION SECTION END-->


<!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
<div id ="Family Info" class = "mb-15"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Family
        </h1>
    </div>
    
</div>

<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-350 min-w-275">
        {#if data.family?.length > 0}
        <div class = "!bg-[var(--green)] p-3 flex flex-row mb-10">
           <div class = "!text-[var(--background)] !font-bold !ml-10">Are They a Child? </div>
           <div class = "!text-[var(--background)] !font-bold ml-20">Relationship </div>
           <div class = "!text-[var(--background)] !font-bold ml-30">Last Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-35">First Name </div>
        </div>
        {#each existingFamily as fammember,index}
        {#if fammember.isDeleted == false}
        <div class = "flex flex-row mb-5">
            <div class = "w-50 ml-5"> <Select bind:value = {fammember.is_child} options = {["Yes", "No"]}/> </div>
            <div class = "mt-4 ml-10 w-50"> <Input type = "text" bind:value = {fammember.relationship}/> </div>
            <div class = "w-50 mt-4 ml-10">  <Input type = "text" bind:value ={fammember.lastName}/> </div>
            <div class = "w-50 mt-4 ml-10">  <Input type = "text" bind:value ={fammember.firstName}/> </div>
            <div class = "mt-1">
                <button on:click = {()=>deleteFamily(index)} class = "!bg-white !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]">
                    x
                </button> 
            </div>
        </div>
        {/if}
        {/each}
        <div class = "w-150"> <button on:click={()=>addFamily()}> Add Member </button> <span class = "!text-red-500 ml-5 !text-xs"> Make sure member is already registered!</span> </div>
        {:else}
            <div> Child is not part of any family </div>
        {/if}
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->


<!--CONTAINER FOR EDUCATION HISTORY-->
<div id ="Education Info" class = "mb-15"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 -mb-5">
        Education History
        </h1>
    </div>
</div>
<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-170 min-w-150">
        {#if educHistory.length > 0}
        <div class = "flex flex-row"> <div> Please select a school year </div> <select class = "ml-5 w-50 z-100" on:change={(e)=>updateField(e.target.selectedIndex)}>
            <option selected> </option>
            {#each educHistory as year}
            {#if year.isDeleted == false}
            <option> {year.yearStart}</option>
            {/if}
            {/each}
        </select></div>
        <div class = "mt-3"> <Select label="Education Type:" bind:value = {educType} options = {educ_options} /></div>
        <div class = "mt-3"> <Input label="Education Level:" bind:value = {educLevel}/></div>
        <div class = "mt-3"> <Select label="Education Status:" bind:value = {educStatus} options = {student_options}/> </div>
        <div class = "mt-3"> <Input label="School Year Start:" bind:value = {yearStart}/> </div>
        <div class = "mt-3"> <Input label="School Year End:" bind:value = {yearEnd}/> </div>
        {:else}
        This child has no education history
        {/if}
        <div class = "flex flex-row">
        <div class = "w-150 mt-10"> <button on:click = {()=>addEducRecord()}> Add Education Record </button> </div>
        <div class = "w-150 mt-10"> <button on:click = {()=>deleteEducRecord(selectedIndex)} class ="green"> Delete This Record </button> </div>
        </div>
    </div>
</div>
<!--END OF EDUCATION HISTORY -->

<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 w-250 min-w-250 ">
    <div class = "flex flex-col !font-bold"> 
       <div class = "z-500">
            <Check label="PWD ID" bind:checked = {hasPWD}/>
       </div>
       {#if hasPWD} 
       <div class = "w-150 z-500">
            <Input type = "text"  label="ID #" bind:value = {pwdID} />
       </div>
       <div class = "w-150 z-500">
            <Input type = "date"   label="Expiry Date" bind:value = {pwdExpiry}/>
       </div>
       {/if}

       <div class = "z-500">
            <Check label="Social Security" bind:checked = {socialProtectionhas}/>
       </div>
       {#if socialProtectionhas} 
       <div class = "w-150 z-500">
            <Check bind:checked = {socialProtectionCom} label="Participation in Community Life" />
            {#if socialProtectionCom}
            <div class = "w-150 z-500">
            <Input type = "number" label="Year of Community Access" bind:value = {socialProtectionComYear}/>
            </div>
            {/if}
            <Check bind:checked = {socialProtectionFam}  label="Participation in Family Life" />
            {#if socialProtectionFam}
            <div class = "w-150">
            <Input type = "number" label="Year of Family Access" value = {socialProtectionFamYear}/>
            </div>
            {/if}
       </div>
       {/if}




       <div class = "mt-5 z-500">
            <Check label = "PhilHealth" bind:checked = {hasPHhealth} />
       </div>

       <div class = "mt-5 z-500">
            <Check label = "National ID" bind:checked = {natID} />
       </div>
    </div>
    <div class = "flex flex-col !font-bold ml-10">
        <div class = "z-500">
            <Check label = "Medical Certificate" bind:checked = {medCert} />
       </div>
        <div class = "z-500">
            <Check label = "Birth Certificate" bind:checked = {birthCert} />
       </div>
        <div class = "z-500">
            <Check label = "Barangay Certificate" bind:checked = {barangayCert} />
       </div>
        <div class = "z-500">
            <Check label = "Voter ID" bind:checked = {voterID} />
       </div>
    </div>
</div>
<!--END OF DOCUMENTS LISTING-->

<!--INTERVENTIONS LIST BEGINS HERE-->
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Interventions
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-4 w-275" id ="Intervention Info">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold mt-2">Service Category </div>
           <div class = "!text-[var(--background)] !font-bold ml-20 mt-2">Interventions Performed </div>
           <div class = "!text-[var(--background)] !font-bold ml-55 mt-2">Status History </div>
        </div>
        {#each childInterventions as interventionvar,index}
            <div class = "flex flex-row mt-5">
                <div class = "mt-4.5 -mr-15 w-50">
                    <Input type = "text" disabled bind:value = {interventionvar.servicecat}/>
                </div>
                <div class = "mb-10 mt-4 ml-35 w-50">
                   <Input bind:value = {interventionvar.name}/>
                </div>
                <div class =  "collapse">
                <input type = "checkbox" />
                    <div class = "collapse-title flex flex-row">
                        <div class = " z-5000 w-50 ml-15">
                           <Select bind:value = {interventionvar.status} options = {["Regressed" , "Improved", "Neutral"]} />
                        </div> 
                        <div class = "w-50 ml-5 z-5000"><Input type = "date" bind:value = {interventionvar.dateCreated} /></div>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        <div class = "flex flex-col">
                        {#each interventionvar.history as status, statusindex}
                        {#if status.isDeleted == false}
                            <div class= "flex flex-row w-100">
                                <div class = " z-5000 w-50 ml-15">
                                <Select bind:value = {status.status} options = {["Regressed" , "Improved" , "Neutral"]} />
                                </div> 
                                <div class ="w-50 ml-5">  <Input type = "Date" bind:value = {status.date}/></div>
                                <div class = "-mt-2.5 -ml-5">
                                <button class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                                on:click = {()=>deleteStatus(statusindex, index)}>
                                    x
                                </button>
                                </div>
                            </div>
                        {/if}
                        {/each}
                        <button on:click = {() => addStatus(index)} class = "green w-50 ml-45 mt-5"> Add Status</button>
                        </div>
                    </div>
                </div>
                <div class = "mt-2">
                <button
                        class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                        on:click = {()=>deleteIntervention(index)}>
                        x
                </button>
                </div>
            </div>
        {/each}
    </div>
    
</div>


<!--END OF INTERVENTIONS-->