<script lang="ts">
    import Header from '$components/Header.svelte'
    import Input from '$components/input/InputText.svelte'
    import TextArea from '$components/input/InputTextarea.svelte'
    import Check from '$components/input/Checkbox.svelte'
    import Select from '$components/input/Select.svelte'
    import { goto } from '$app/navigation';

    export let data;
    let selected;

    let firstName: string = data.child?.firstName || "Name Must Be Assigned"
    let lastName: string = data.child?.lastName || "Last Name Must Be Assigned"
    let birthday: string = data.child?.birthday || new Date().toISOString().split('T')[0]
    let sex: string = data.child?.sex || "N/A"
    let address: string = data.child?.address || "N/A"
    let barangay: string = data.child?.barangay || "N/A"
    let canwork: boolean = data.child?.canWork || false
    let employmentType: string = data.child?.employmentType || ""
    let disabilityCategory: string = data.child?.disabilityCategory || ""
    let disabilityNature: string = data.child?.disabilityNature || ""
    let admissionDate: string = data.child?.admissionDate

    let educType: string = "N/A"
    let educStatus: string = "N/A"
    let educLevel: string = "N/A"
    let studentStatus: string = "N/A"
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
            firstName: data.family[i]?.members.first_name,
            lastName: data.family[i]?.members.last_name,
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
        yearEnd: number
    }[] = []

    for(let i = 0; i < data.child?.educationHistory.length;i++){
        educHistory.push({
            Educationtype: data.child.educationHistory[i]?.education_type,
            Educationlevel: data.child.educationHistory[i]?.grade_level,
            Educationstatus: data.child.educationHistory[i]?.student_status_type,
            yearStart: data.child?.educationHistory[i]?.year_start,
            yearEnd: data.child?.educationHistory[i]?.year_end

        })
    }
    
    
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
        'Inclusive',
        'Special',
        'Nonformal',
        'Integrated'
    ]

    const student_options = [
        'past_student',
        'enrolled',
        'dropped_out',
        'completed'
    ]

    //below are functions needed for the page

    function updateField(index:number){
        educType = educHistory[index].Educationtype
        educLevel = educHistory[index].Educationlevel
        educStatus = educHistory[index].Educationstatus
        yearStart = educHistory[index].yearStart
        yearEnd = educHistory[index].yearEnd
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

            const addressres = await fetch('/api/addresses', {
            method: "PUT",
            body: JSON.stringify({
                id: data.member?.address_id,
                address: address
            }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const barangayres = await fetch('/api/barangays', {
            method: "PUT",
            body: JSON.stringify({
                id: data.child?.barangayid,
                name: barangay
            }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            //This should happen if a persons record isnt found 
            if(data.child?.canWork != canwork && data.child?.canWork == false){
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

            //this happens if the persons record is found in the db, needs a get tho 
            else if(data.child?.employmentType != ""){
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
                    console.log(existingFamily[i])
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

            console.log(data.child?.educationHistory)
            //EDUCATION RECORD UPDATES BEGIN HERE
            const updateEducRecord = await fetch('/api/education_status', {
                method: "PUT",
                body:JSON.stringify({
                    id: data.child.educationHistory[data.child.schoolYearArray?.indexOf(selected)]?.id,
                    education_type: educType,
                    education_status: educStatus,
                    grade_level: educLevel,
                    year_start: yearStart,
                    year_end:yearEnd
                })
            })
            

        goto(`/dashboard/members/children/profile?id=${data.child.id}`);
    }

</script>


<span class = "z-5000"> <Header/> </span>

<section>
    <h1>
     {data.child?.firstName ?? "First Name Missing!"} {data.child?.lastName ?? "Last Name Missing!"}'s Profile 
    </h1>
</section>
<div class = "flex flex-row ml-10 m-4 sticky top-20">
    <div class = "flex flex-col !font-[JSans]">
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#top">Information </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Family Info">Family </a>
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
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-5"></div>
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
        <TextArea value = {data.child?.remarks || "N/A"} label="Remarks" rows={10}  margin={false} /></div>

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
        {#each existingFamily as fammember}
        <div class = "flex flex-row mb-5">
            <div class = "w-50 ml-5"> <Select bind:value = {fammember.is_child} options = {["Yes", "No"]}/> </div>
            <div class = "mt-4 ml-10 w-50"> <Input type = "text" bind:value = {fammember.relationship}/> </div>
            <div class = "w-50 mt-4 ml-10">  <Input type = "text" bind:value ={fammember.lastName}/> </div>
            <div class = "w-50 mt-4 ml-10">  <Input type = "text" bind:value ={fammember.firstName}/> </div>
            <div class = "mt-1">
                <button  class = "!bg-white !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]">
                    x
                </button> 
            </div>
        </div>
        {/each}
        <div class = "w-150"> <button> Add Member </button> <span class = "!text-red-500 ml-5 !text-xs"> Make sure member is already registered!</span> </div>
        {:else}
            <div> Child is not part of any family </div>
        {/if}
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->


<!--CONTAINER FOR EDUCATION HISTORY-->
<div id ="Family Info" class = "mb-15"></div>
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
        <div> <Select label="Please select a school year" bind:value = {selected} options = {data.child?.schoolYearArray}/></div>
        {#if selected}
        {updateField(data.child?.schoolYearArray?.indexOf(selected))}
        <div class = "mt-3"> <Select label="Education Type:" bind:value = {educType} options = {educ_options} /></div>
        <div class = "mt-3"> <Input label="Education Level:" bind:value = {educLevel}/></div>
        <div class = "mt-3"> <Select label="Education Status:" bind:value = {educStatus} options = {student_options}/> </div>
        <div class = "mt-3"> <Input label="School Year Start:" bind:value = {yearStart}/> </div>
        <div class = "mt-3"> <Input label="School Year End:" bind:value = {yearEnd}/> </div>
        {/if}
        {:else}
        This child has no education history
        {/if}
    </div>
</div>
<!--END OF EDUCATION HISTORY -->

<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 w-250 min-w-250">
    <div class = "flex flex-col !font-bold"> 
       <div>
            <Check label="PWD ID" checked = {data.child?.pwd?.has} disabled/>
       </div>
       {#if data.child?.pwd?.has} 
       <div class = "w-150">
            <Input type = "text" disabled label="ID #" value = {data.child?.pwd.id} />
       </div>
       <div class = "w-150">
            <Input type = "text" disabled  label="Expiry Date" value = {data.child.pwd.expiry}/>
       </div>
       {/if}

       <div>
            <Check disabled label="Social Security" checked = {data.child?.socialProtection?.has}/>
       </div>
       {#if data.child?.socialProtection?.has} 
       <div class = "w-150">
            {#if data.child?.socialProtection?.community_club}
            <Check checked disabled label="Participation in Community Life" />
            <div class = "w-150">
            <Input disabled type = "text" label="Year of Community Access" value = {data.child.socialProtection.community_year}/>
            </div>
            {/if}

            {#if data.child?.socialProtection?.fam_life}
            <Check checked disabled label="Participation in Family Life" />
            <div class = "w-150">
            <Input disabled type = "text" label="Year of Family Access" value = {data.child.socialProtection.family_year}/>
            </div>
            {/if} 
       </div>
       {/if}




       <div class = "mt-5">
            <Check label = "PhilHealth" checked = {data.child?.philHealth} />
       </div>

       <div class = "mt-5">
            <Check label = "National ID" checked = {data.child?.national_id} />
       </div>
    </div>
    <div class = "flex flex-col !font-bold ml-10">
        <div>
            <Check label = "Medical Certificate" checked = {data.child?.med_cert} />
       </div>
        <div>
            <Check label = "Birth Certificate" checked = {data.child?.birth_cert} />
       </div>
        <div>
            <Check label = "Barangay Certificate" checked = {data.child?.barangay_cert} />
       </div>
        <div>
            <Check label = "Voter ID" checked = {data.child?.voter_id} />
       </div>
    </div>
</div>
<!--END OF DOCUMENTS LISTING-->

<!--INTERVENTIONS LIST BEGINS HERE-->
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Interventions
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-275" id ="Intervention Info">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold ml-65">Intervention Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-35">Status History </div>
        </div>

        <div class = "border-[var(--border)] border-4 flex flex-col p-3 ">
        {#each data.interventioninfo as intervention}
            <div class = "flex flex-row">
                <div>
                    {#if intervention.service_category.name === "Social"}
                     <div class = "!bg-[var(--green)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > SOCIAL </div>
                    {:else if intervention.service_category.name === "Livelihood"}
                     <div class = "!bg-[var(--border)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > LIVELIHOOD </div>
                    {:else if intervention.service_category.name === "Health"}
                     <div class = "!bg-[var(--error-color)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > HEALTH </div>
                    {:else if intervention.service_category.name === "Education"}
                     <div class = "!bg-[var(--pink)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > EDUCATION </div>
                    {/if}
                </div>

                <div class = "ml-16 mt-5 w-150">
                   {intervention?.intervention}
                </div>
                <div class =  "collapse">
                    <input type="checkbox" />
                    <div class = "collapse-title flex flex-row">
                        {#if intervention?.status === "Regressed"}
                        <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Regressed </div> 
                        {:else if intervention?.status === "Neutral"}
                        <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Neutral </div>
                        {:else} 
                        <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Improved </div>
                        {/if}
                        <div class = "ml-10 mt-2"> {intervention?.date_created.split('T')[0]}</div>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        {#each intervention?.history as status}
                        <div class= "flex flex-row mb-5">
                            {#if status.status === "Regressed"}
                            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Regressed </div> 
                            {:else if status.status === "Neutral"}
                            <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Neutral </div>
                            {:else} 
                            <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Improved </div>
                            {/if}
                        <div class = "ml-10 mt-2"> {status.date_checked}</div>
                        </div>
                        {/each}
                    </div>
                </div>

            </div>
        {/each}
        </div>
    </div>
</div>

<!--END OF INTERVENTIONS-->
