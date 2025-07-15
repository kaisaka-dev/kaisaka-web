<script lang="ts">
    import type { child } from '$lib/types/child.js'
    import Header from '../../../../../components/Header.svelte'
    import Input from '../../../../../components/input/InputText.svelte'
    import TextArea from '../../../../../components/input/InputTextarea.svelte'
    import Check from '../../../../../components/input/Checkbox.svelte'
	import InputText from '../../../../../components/input/InputText.svelte';

    export let data;   

    //below are sample data declarations for the page to work, will delete when the relevant APIs are made
    let user: child = {
        firstName: "Juan", lastName: "De La Cruz", educationStatus: "Dropped Out", birthday: new Date(2011,2,3), sex: "M", address: "Sample Address",
        barangay: "Barangay 721", employmentStatus: "Sheltered Workshop", disabilityCategory: "sampleCategory", disabilityNature: "sampleNature", dateAdmission: new Date(2012, 9,11), education: "Home Program",

        family: {id: 1, members:[{role: "Parent", firstName:"Paolo", lastName: "Rivera"}, {role: "Child" , firstName: "Juan" , lastName:"De La Cruz"},  {role: "Child" , firstName: "John" , lastName:"De La Cruz"}],
                 dateCreated: new Date(2023,9,24), payments: [{amount: 200, date: new Date(2024,3,2)}, {amount:200, date: new Date(2025,4,2)}]
                },
    
        eventAttendance:[{id: 1231, name: "Health event", type: "Health", date: new Date(2022,2,12).toISOString().split('T')[0]},
                        {id: 12345, name: "Social event", type: "Social", date: new Date(2023,5, 16).toISOString().split('T')[0]}],

        PWD: true,
        PhilHealth: true,
        medCert: true,
        birthCert: false,
        barangayCert: true,
        voterID: true,
        natID: true,
        socialSecurity: {
            access: true,
            type: "Participation in family life",
            yearAccessed:2023
        },
        
        interventionHistory: [
        {id:1321123, name: "Learning Intervention" , type: "Education", 
            status: [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "IMPROVED" , date: new Date(2012,8, 25).toISOString().split('T')[0]} , {status: "REGRESSED" , date: new Date(2012,9, 25).toISOString().split('T')[0] }]
        },

        {id:1232132, name: "Livelihood Intervention" , type: "Livelihood", status:
            [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "REGRESSED" , date: new Date(2012,8, 25).toISOString().split('T')[0]}]
        }
        ]
    }
    let today = new Date();
    let yearCounter: number[] = [];
    let paymentYears: number[] = []


    //below are functions needed for the page

    for(let i = user.family.dateCreated.getFullYear(); i <= today.getFullYear(); i++) {
        yearCounter.push(i)
    }

    for(let i = 0; i < user.family.payments.length; i++) {
       paymentYears.push(user.family.payments[i].date.getFullYear())
    }




</script>
<Header/>

<section>
    <h1>
       {data.member.first_name} {data.member.last_name}'s Profile 
    </h1>
</section>
<div class = "flex flex-row ml-10 m-4 sticky top-20 z-1">
    <div class = "flex flex-col !font-[JSans]">
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Personal Info">Information </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Family Info">Family </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Event Info">Attendance </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Documentation Info">Documents </a>
        </div>
        <div>
            <a class = "hover:!text-[var(--green)]" href = "#Intervention Info">Interventions </a>
        </div>
        <div>
            <button class="w-40 -ml-5 mt-10" onclick={() => location.href='profile/edit'}>Edit Profile</button>
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
<div class = "border-[var(--border)] border-4 ml-55 mr-10 !font-bold z-2000 w-225 min-w-225" >
    <div class = "!flex !flex-row !justify-start mt-2">
        <div class = "flex flex-col">
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> First Name</div>
                <div class = "mt-4"> <Input disabled value = {data.member.first_name}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Last Name</div>
                <div class = "mt-4"> <Input  disabled value = {data.member.last_name}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education </div>
                {#if user.education == null}
                <div class = "mt-3"> <Input value = "N/A" disabled/> </div>
                {:else}
                <div class = "mt-3"> <Input value = {data.childRecord.education_status[0].education_type} disabled/> </div>
                {/if}            
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education Status </div>
                <div class = "mt-5"> <Input value = {data.childRecord.education_status[0].student_status_type} disabled/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Birthday</div>
                <div class = "mr-50 mt-3"> <Input disabled value = {data.member.birthday} label = ""/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Age</div>
                <div class = "mt-4"> <Input disabled value = {today.getFullYear() - new Date(data.member.birthday).getFullYear()}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Sex</div>
                <div class = "mt-3"> <Input disabled value = {data.member.sex}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Address</div>
                <div class = "mt-3"> <Input disabled value = {data.member.addresses.address}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Barangay</div>
                <div class = "mt-3"> <Input disabled value = {data.barangay.name}/> </div>
            </div>

            {#if data.member.employment_status.able_to_work}
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Employment Status </div>
                <div class = "mt-7"> <Input value = {data.member.employment_status.employment_type} disabled /> </div>
            </div>
            {/if}


            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-73"> Category of Disability</div>
                <div class = "mt-4"> <Input value = {data.childRecord.disability_category.name} disabled/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-73"> Nature of Disability</div>
                <div class = "mt-4"> <Input value = {data.childRecord.disability_nature} disabled/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Date of Admission</div>
                <div class = "mt-3"> <Input disabled label = "" value = {new Date(data.member.admission_date).toISOString().split('T')[0]}/> </div>
            </div>
            {#if user.dateTermination != null}
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-70"> Date of Termination</div>
                <div class = "mt-3"> <InputText type = "date" label = "" value = {user.dateTermination.toISOString().split('T')[0]}/> </div>
            </div>
            {/if}
        </div>
        
        
        <div class = "flex flex-col ml-3"> 
            <div class = "-ml-45"> <TextArea disabled value = {data.childRecord.remarks} label = "Remarks" rows = 10/> </div>
        </div>
    </div>
</div>
<!-- PERSONAL INFORMATION SECTION END-->

<!--CONTAINER FOR FAMILY AND MEMBERSHIP LABELS-->
<div id ="Family Info" class = "mb-15"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Family
        </h1>
    </div>

    <div>
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Membership
        </h1>
    </div>
</div>

<!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-125">
        {#each data.family as fammember}
        <div class = "flex flex-row mb-5">
            {#if fammember.is_child == false}
            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > {fammember.relationship_type} </div>
            {:else if fammember.is_child == true}
                {#if fammember.members.first_name === data.member.first_name}
                <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Child </div>
                {:else}
                <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Sibling </div>
                {/if}
            {/if}
            <div class = "!font-[JSans] mt-2"> {fammember.members.first_name} {fammember.members.last_name}</div>
        </div>
        {/each}
    </div>

    <div class = "border-[var(--border)] border-4 p-4 flex flex-col" id ="Membership Info">
        {#each yearCounter as year}
        <div class = "flex flex-row mb-5">
            <div class = 'mr-25 font-bold'> {year} </div>
            {#if paymentYears.includes(year)}
            <div class = " mb-5">  P{user.family.payments[paymentYears.indexOf(year)].amount} paid on {user.family.payments[paymentYears.indexOf(year)].date.toISOString().split('T')[0]}  </div>
            {:else}
            <div class = "!text-red-500 mb-5"> Payment Pending!</div>
            {/if}
        </div>
        {/each}
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->

<!--EVENT AND ATTENDANCE STARTS HERE-->
<div id ="Event Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Event and Attendance
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-238">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold">Event Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-90">Event Type </div>
           <div class = "!text-[var(--background)] !font-bold ml-35">Date Attended </div>
        </div>

        <div class = "border-[var(--border)] border-4 flex flex-col p-3 ">
            {#each user.eventAttendance as event}
            <div class = "flex flex-row mb-5">
                <div class = "mt-2 w-40 min-w-40">
                    {event.name}
                </div>

                <div class = "ml-73">
                    {#if event.type === "Social"}
                    <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>
                    {:else if event.type === "Education"}
                    <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>
                    {:else if event.type === "Health"}
                    <div class = "!bg-[var(--error-color)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>
                    {:else if event.type === "Livelihood"}
                    <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>  
                    {/if}                  
                </div>

                <div class = "ml-25 mt-2">
                    {event.date}
                </div>
            </div>
            {/each}
        </div>
    </div>
</div>

<!--END OF EVENT AND ATTENDANCE-->


<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 w-250 min-w-250">
    <div class = "flex flex-col !font-bold"> 
       <div>
            <Check label = "PWD ID" bind:checked = {data.childRecord.pwd_id} disabled/>
       </div>
       {#if data.childRecord.pwd_id} 
       <div class = "w-150">
            <Input type = "text" disabled label = "ID #" value = {data.childRecord.pwd_id} />
       </div>
       <div class = "w-150">
            <Input type = "text" disabled  label = "Expiry Date" value = {data.pwdID.expiry_date}/>
       </div>
       {/if}

       <div>
            <Check disabled label = "Social Security" bind:checked = {data.childRecord.social_protection_status}/>
       </div>
       {#if data.childRecord.social_protection_status} 
       <div class = "w-150">
            {#if data.childRecord.social_protection_status.participates_community_club}
            <Check checked disabled label = "Participation in Community Life" />
            <div class = "w-150">
            <Input disabled type = "text" label = "Year of Community Access" value = {data.childRecord.social_protection_status.comm_year_accessed}/>
            </div>
            {/if}

            {#if data.childRecord.social_protection_status.participates_family_life}
            <Check checked disabled label = "Participation in Family Life" />
            <div class = "w-150">
            <Input disabled type = "text" label = "Year of Family Access" value = {data.childRecord.social_protection_status.fam_year_accessed}/>
            </div>
            {/if} 
       </div>
       {/if}


       <div class = "mt-5">
            <Check label = "PhilHealth" bind:checked = {data.childRecord.has_philhealth} disabled/>
       </div>

       <div class = "mt-5">
            <Check label = "National ID" bind:checked = {data.childRecord.has_nat_id} disabled/>
       </div>
    </div>
    <div class = "flex flex-col !font-bold ml-10">
        <div>
            <Check label = "Medical Certificate" bind:checked = {data.childRecord.has_medical_cert} disabled/>
       </div>
        <div>
            <Check label = "Birth Certificate" bind:checked = {data.childRecord.birth} disabled/>
       </div>
        <div>
            <Check label = "Barangay Certificate" bind:checked = {data.childRecord.has_barangay_cert} disabled/>
       </div>
        <div>
            <Check label = "Voter ID" bind:checked = {data.childRecord.has_vote} disabled/>
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
        {#each user.interventionHistory as intervention}
            <div class = "flex flex-row">
                <div>
                    {#if intervention.type === "Social"}
                     <div class = "!bg-[var(--green)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > SOCIAL </div>
                    {:else if intervention.type === "Livelihood"}
                     <div class = "!bg-[var(--border)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > LIVELIHOOD </div>
                    {:else if intervention.type === "Health"}
                     <div class = "!bg-[var(--error-color)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > HEALTH </div>
                    {:else if intervention.type === "Education"}
                     <div class = "!bg-[var(--pink)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > EDUCATION </div>
                    {/if}
                </div>

                <div class = "ml-16 mt-5 w-150">
                   {intervention.name}
                </div>

                <div class =  "collapse">
                    <input type="checkbox" />
                    <div class = "collapse-title flex flex-row">
                        {#if intervention.status[0].status === "REGRESSED"}
                        <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > REGRESSED </div> 
                        {:else if intervention.status[0].status === "NEUTRAL"}
                        <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > NEUTRAL </div>
                        {:else} 
                        <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > IMPROVED </div>
                        {/if}
                        <div class = "ml-10 mt-2"> {intervention.status[0].date}</div>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        {#each intervention.status.splice(1) as status}
                        <div class= "flex flex-row mb-5">
                            {#if status.status === "REGRESSED"}
                            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > REGRESSED </div> 
                            {:else if status.status === "NEUTRAL"}
                            <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > NEUTRAL </div>
                            {:else} 
                            <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > IMPROVED </div>
                            {/if}
                        <div class = "ml-10 mt-2"> {status.date}</div>
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